import { Either } from "../Either/Either";
import { Maybe } from "../Maybe/Maybe";
export declare class Bool<T extends boolean> {
    private value;
    constructor(value: boolean);
    static of(arg: unknown): Bool<false>;
    static fromFn(cb: () => false | undefined | null): Bool<false>;
    static false(): Bool<false>;
    static true(): Bool<true>;
    map<U extends boolean>(cb: (arg: boolean) => boolean): Bool<U>;
    and(value: unknown): Bool<boolean>;
    or(value: unknown): Bool<boolean>;
    true(cb: () => void): this;
    false(cb: () => void): this;
    match<T, U>({ true: trueCB, false: falseCB, }: {
        true: () => T;
        false: () => U;
    }): T | U;
    toEither(): Either<true, false>;
    toMaybe(): Maybe<boolean>;
}
