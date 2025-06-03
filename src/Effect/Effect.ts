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

  static of<T>(fn: () => Promise<T> | T | Effect<T>) {
    return new Effect<T>({
      fn: async () => {
        const result = await fn();
        if (result instanceof Effect) {
          return result.fn();
        }
        return result;
      },
    });
  }

  private getState(): EffectState<T> {
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
      return finalEffect;
    }
  }

  finished(matcher: {
    true: (effect: Effect<T>) => void;
    false: () => void;
  }): void {
    const state = this.getState();
    state.loading.match({
      true: () => matcher.false(),
      false: () => {
        state.result.match({
          something: () => matcher.true(this),
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

  match<T2>(matcher: {
    data: (value: T) => T2;
    error: (error: string) => T2;
    loading: () => T2;
    nothing: () => T2;
  }): T2 {
    const state = this.getState();

    return state.loading.match({
      true: () => matcher.loading(),
      false: () =>
        state.result.match({
          something: (result) =>
            result.match({
              data: (value) => matcher.data(value),
              error: (error) => matcher.error(error),
            }),
          nothing: () => matcher.nothing(),
        }),
    });
  }
}
