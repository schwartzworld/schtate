import { Either } from "../Either/Either";
import { Maybe } from "../Maybe/Maybe";

type Error = string;

export class Result<Data> {
  private value: Either<Data, Error>;
  constructor(value: Either<Data, Error>) {
    this.value = value;
  }

  static error<T>(message: string) {
    return new Result<T>(Either.right<T, Error>(message));
  }

  static data<T>(data: T) {
    return new Result<T>(Either.left<T, Error>(data));
  }

  static isResult(val: unknown): val is Result<unknown> {
    return val instanceof Result;
  }

  static async of<T>(cb: () => Promise<T> | T) {
    try {
      const value = await cb();
      return Result.data<T>(value);
    } catch (e) {
      return Result.error<T>(String(e));
    }
  }

  static fromFunction<T>(cb: (data: typeof Result.data, error: typeof Result.error) => Promise<Result<T>> | Result<T>) {
      return cb(Result.data, Result.error);
  }

  static async ofMaybe<T>(cb: () => Promise<T> | T) {
    const res = await Result.of(cb);
    return res.data((d) => Maybe.of(d));
  }

  map = <U>({
    data: dataCb,
    error: errorCb,
  }: {
    data: (value: Data) => U;
    error: (message: Error) => Error;
  }): Result<U> => {
    return new Result<U>(
      this.value.map<U, Error>({
        left: (value) => {
          return dataCb(value);
        },
        right: (err) => {
          return errorCb(err);
        },
      })
    );
  };

  data<U>(cb: (value: Data) => U) {
    return this.map({
      data: cb,
      error: (e) => e,
    });
  }

  error<U>(cb: (value: Error) => Error | void) {
    return this.map({
      data: (d) => d,
      error: (err) => {
        return cb(err) ?? err;
      },
    });
  }

  reduce<SomethingElse>(
    cb: (arg0: SomethingElse, arg1: Data) => SomethingElse,
    starterThing: SomethingElse
  ): Result<SomethingElse> {
    return this.data((val) => {
      return cb(starterThing, val);
    });
  }

  match<T, U>({
    data: dataCB,
    error: errorCb,
  }: {
    data: (arg: Data) => T;
    error: (err: Error) => U;
  }) {
    return this.value.match({
      left: dataCB,
      right: errorCb,
    });
  }
}
