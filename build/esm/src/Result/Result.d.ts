import { Either } from "../Either/Either";
import { Maybe } from "../Maybe/Maybe";
type Error = string;
export declare class Result<Data> {
    private value;
    constructor(value: Either<Data, Error>);
    static error<T>(message: string): Result<T>;
    static data<T>(data: T): Result<T>;
    static isResult(val: unknown): val is Result<unknown>;
    static of<T>(cb: () => Promise<T> | T): Promise<Result<T>>;
    static fromFunction<T>(cb: (data: typeof Result.data, error: typeof Result.error) => Promise<Result<T>> | Result<T>): Promise<Result<T>>;
    static ofMaybe<T>(cb: () => Promise<T> | T): Promise<Result<Maybe<T>>>;
    map: <U>({ data: dataCb, error: errorCb, }: {
        data: (value: Data) => U;
        error: (message: Error) => Error;
    }) => Result<U>;
    data<U>(cb: (value: Data) => U): Result<U>;
    error(cb: (value: Error) => Error | void): Result<Data>;
    reduce<SomethingElse>(cb: (arg0: SomethingElse, arg1: Data) => SomethingElse, starterThing: SomethingElse): Result<SomethingElse>;
    match<T, U>({ data: dataCB, error: errorCb, }: {
        data: (arg: Data) => T;
        error: (err: Error) => U;
    }): T | U;
    get: (args: keyof Data) => Maybe<Data[keyof Data]> | Maybe<string | number | (() => StringIterator<string>) | (() => string) | ((pos: number) => string) | ((index: number) => number) | ((...strings: string[]) => string) | ((searchString: string, position?: number) => number) | ((searchString: string, position?: number) => number) | {
        (that: string): number;
        (that: string, locales?: string | string[], options?: Intl.CollatorOptions): number;
    } | {
        (regexp: string | RegExp): RegExpMatchArray | null;
        (matcher: {
            [Symbol.match](string: string): RegExpMatchArray | null;
        }): RegExpMatchArray | null;
    } | {
        (searchValue: string | RegExp, replaceValue: string): string;
        (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
        (searchValue: {
            [Symbol.replace](string: string, replaceValue: string): string;
        }, replaceValue: string): string;
        (searchValue: {
            [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
        }, replacer: (substring: string, ...args: any[]) => string): string;
    } | {
        (regexp: string | RegExp): number;
        (searcher: {
            [Symbol.search](string: string): number;
        }): number;
    } | ((start?: number, end?: number) => string) | {
        (separator: string | RegExp, limit?: number): string[];
        (splitter: {
            [Symbol.split](string: string, limit?: number): string[];
        }, limit?: number): string[];
    } | ((start: number, end?: number) => string) | (() => string) | ((locales?: string | string[]) => string) | (() => string) | ((locales?: string | string[]) => string) | (() => string) | ((from: number, length?: number) => string) | (() => string) | ((pos: number) => number | undefined) | ((searchString: string, position?: number) => boolean) | ((searchString: string, endPosition?: number) => boolean) | {
        (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
        (form?: string): string;
    } | ((count: number) => string) | ((searchString: string, position?: number) => boolean) | ((name: string) => string) | (() => string) | (() => string) | (() => string) | (() => string) | ((color: string) => string) | {
        (size: number): string;
        (size: string): string;
    } | (() => string) | ((url: string) => string) | (() => string) | (() => string) | (() => string) | (() => string)>;
}
export {};
//# sourceMappingURL=Result.d.ts.map