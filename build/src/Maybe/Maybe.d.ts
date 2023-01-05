import { Nothing } from "./nothing";
import { Schtate } from "../types/Schtate";
import { Either } from "../Either/Either";
import { Bool } from "../Bool/Bool";
export declare class Maybe<Something> implements Schtate<Something> {
    private value;
    private constructor();
    private static isNothing;
    static isMaybe: (arg: unknown) => arg is Maybe<unknown>;
    static nothing<T>(): Maybe<T>;
    static of<Something>(val: Something | Nothing | Maybe<Something> | null | undefined): Maybe<Something>;
    static fromFunction<Something>(cb: (something: typeof Maybe.of, nothing: typeof Maybe.nothing) => Something | null | Nothing): Maybe<Something>;
    nothing(cb: (arg: Nothing) => void): this;
    map<SomethingElse>(cb: (arg: Something) => SomethingElse): Maybe<SomethingElse>;
    something: <SomethingElse>(cb: (arg: Something) => SomethingElse) => Maybe<SomethingElse>;
    reduce<SomethingElse>(cb: (arg0: SomethingElse, arg1: Something) => SomethingElse, starterThing: SomethingElse): Maybe<SomethingElse>;
    match<T, U>({ something: somethingCB, nothing: nothingCB, }: {
        something: (arg: Something) => T;
        nothing: () => U;
    }): T | U;
    get(property: keyof Something): Maybe<Something[typeof property]>;
    toEither(): Either<Something, null>;
    toBool(): Bool;
}
