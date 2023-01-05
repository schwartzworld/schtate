import { Either } from "../Either/Either";
import { Maybe } from "../Maybe/Maybe";
export declare class Bool {
    private value;
    constructor(value: boolean);
    static of(arg: unknown): Bool;
    static fromFn(cb: () => boolean | undefined | null): Bool;
    static false(): Bool;
    static true(): Bool;
    map(cb: (arg: boolean) => boolean): Bool;
    and(value: unknown): Bool;
    or(value: unknown): Bool;
    true(cb: (arg: boolean) => void): this;
    false(cb: (arg: boolean) => void): this;
    match<T, U>({ true: trueCB, false: falseCB, }: {
        true: () => T;
        false: () => U;
    }): T | U;
    toEither(): Either<true, false>;
    toMaybe(): Maybe<boolean>;
}
