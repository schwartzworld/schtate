import { Result } from "../Result/Result";
import { Maybe } from "../Maybe/Maybe";

export class Effect<T> {
  private fn: () => Promise<T> | T;
  private result: Maybe<Result<T>>;

  constructor({
    fn,
    result = Maybe.nothing(),
  }: {
    fn: () => Promise<T> | T;
    result?: Maybe<Result<T>>;
  }) {
    this.fn = fn;
    this.result = result;
  }

  static of<T>(fn: () => Promise<T> | T) {
    return new Effect<T>({ fn });
  }

  async run(): Promise<Effect<T>> {
    const value = await this.fn();
    return new Effect<T>({
      fn: () => value,
      result: Maybe.of(await Result.of(() => value as T)),
    });
  }
}
