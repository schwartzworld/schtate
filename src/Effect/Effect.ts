import { Result } from "../Result/Result";
import { Maybe } from "../Maybe/Maybe";

type EffectState<T> = {
  loading: boolean;
  result: Maybe<Result<T>>;
};

type Subscriber<T> = (state: EffectState<T>) => void;

export class Effect<T> {
  private fn: () => Promise<T> | T;
  private state: EffectState<T>;
  private subscribers: Set<Subscriber<T>>;

  constructor({
    fn,
    result = Maybe.nothing(),
    loading = false,
  }: {
    fn: () => Promise<T> | T;
    result?: Maybe<Result<T>>;
    loading?: boolean;
  }) {
    this.fn = fn;
    this.state = { loading, result };
    this.subscribers = new Set();
  }

  static of<T>(fn: () => Promise<T> | T) {
    return new Effect<T>({ fn });
  }

  getState(): EffectState<T> {
    return { ...this.state };
  }

  subscribe(subscriber: Subscriber<T>): () => void {
    this.subscribers.add(subscriber);
    // Immediately notify subscriber of current state
    subscriber(this.getState());

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  private setState(newState: Partial<EffectState<T>>) {
    this.state = { ...this.state, ...newState };
    // Notify all subscribers of the state change
    this.subscribers.forEach((subscriber) => subscriber(this.getState()));
  }

  async run(): Promise<Effect<T>> {
    // Notify subscribers of loading state
    const loadingEffect = new Effect<T>({
      fn: this.fn,
      loading: true,
      result: this.state.result,
    });
    this.subscribers.forEach((subscriber) =>
      subscriber(loadingEffect.getState())
    );

    try {
      const value = await this.fn();
      const result = Maybe.of(await Result.of(() => value as T));
      const finalEffect = new Effect<T>({
        fn: () => value,
        result,
        loading: false,
      });
      // Notify subscribers of final state
      this.subscribers.forEach((subscriber) =>
        subscriber(finalEffect.getState())
      );
      return finalEffect;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const result = Maybe.of(Result.error<T>(errorMessage));
      const finalEffect = new Effect<T>({
        fn: () => {
          throw error;
        },
        result,
        loading: false,
      });
      // Notify subscribers of final state
      this.subscribers.forEach((subscriber) =>
        subscriber(finalEffect.getState())
      );
      return finalEffect;
    }
  }
}
