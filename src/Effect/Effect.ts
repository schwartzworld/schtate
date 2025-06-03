import { Result } from "../Result/Result.js";
import { Maybe } from "../Maybe/Maybe.js";
import { Bool } from "../Bool/Bool.js";

export type EffectState<T> = {
  loading: Bool;
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
    loading = Bool.false(),
  }: {
    fn: () => Promise<T> | T;
    result?: Maybe<Result<T>>;
    loading?: Bool;
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

  async run(): Promise<Effect<T>> {
    // Notify subscribers of loading state
    const loadingEffect = new Effect<T>({
      fn: this.fn,
      loading: Bool.true(),
      result: this.state.result,
    });
    this.subscribers.forEach((subscriber) =>
      subscriber(loadingEffect.getState())
    );

    // Store loading effect for testing
    (this as any)._loadingEffect = loadingEffect;

    try {
      const value = await this.fn();
      const result = Maybe.of(await Result.of(() => value as T));
      const finalEffect = new Effect<T>({
        fn: () => value,
        result,
        loading: Bool.false(),
      });
      // Notify subscribers of final state
      this.subscribers.forEach((subscriber) =>
        subscriber(finalEffect.getState())
      );
      // Clear loading effect
      (this as any)._loadingEffect = undefined;
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
        loading: Bool.false(),
      });
      // Notify subscribers of final state
      this.subscribers.forEach((subscriber) =>
        subscriber(finalEffect.getState())
      );
      // Clear loading effect
      (this as any)._loadingEffect = undefined;
      return finalEffect;
    }
  }

  // For testing only
  private _getLoadingEffect(): Effect<T> | undefined {
    return (this as any)._loadingEffect;
  }

  finished(matcher: {
    true: (state: EffectState<T>) => void;
    false: () => void;
  }): void {
    const state = this.getState();
    state.loading.match({
      true: () => matcher.false(),
      false: () => {
        state.result.match({
          something: () => matcher.true(state),
          nothing: () => matcher.false(),
        });
      },
    });
  }

  loading(matcher: { true: () => void; false: () => void }): void {
    const state = this.getState();
    state.loading.match({
      true: () => matcher.true(),
      false: () => matcher.false(),
    });
  }
}
