import { Either } from "../Either/Either";
import { Maybe } from "../Maybe/Maybe";
declare type Error = string;
export declare class Result<Data> {
    private value;
    constructor(value: Either<Data, Error>);
    static error<T>(message: string): Result<T>;
    static data<T>(data: T): Result<T>;
    static isResult(val: unknown): val is Result<unknown>;
    static of<T>(cb: () => Promise<T> | T): Promise<Result<T>>;
    static fromFunction<T>(cb: (data: typeof Result.data, error: typeof Result.error) => Promise<Result<T>> | Result<T>): Result<T> | Promise<Result<T>>;
    static ofMaybe<T>(cb: () => Promise<T> | T): Promise<Result<Maybe<T>>>;
    map: <U>({ data: dataCb, error: errorCb, }: {
        data: (value: Data) => U;
        error: (message: Error) => Error;
    }) => Result<U>;
    data<U>(cb: (value: Data) => U): Result<U>;
    error<U>(cb: (value: Error) => Error | void): Result<Data>;
    reduce<SomethingElse>(cb: (arg0: SomethingElse, arg1: Data) => SomethingElse, starterThing: SomethingElse): Result<SomethingElse>;
    match<T, U>({ data: dataCB, error: errorCb, }: {
        data: (arg: Data) => T;
        error: (err: Error) => U;
    }): T | U;
}
export {};
