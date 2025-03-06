import { State } from "../State/State";
import { Maybe } from "../Maybe/Maybe";
export declare class Either<L, R> {
    private value;
    private whichSide;
    private constructor();
    private static of;
    static isEither(val: unknown): val is Either<unknown, unknown>;
    static fromFunction<L, R>(cb: (left: typeof Either.left, right: typeof Either.right) => Either<L, R>): Either<L, R>;
    static left<L, R>(value: L | State<L>): Either<L, R>;
    static right<L, R>(value: R | State<R>): Either<L, R>;
    private isLeft;
    left<X>(cb: (arg: L) => X | R): Either<X, R>;
    right<Y>(cb: (arg: R) => L | Y): Either<L, Y>;
    map<T, U>({ left: leftCb, right: rightCb, }: {
        left: (arg: L) => T;
        right: (arg: R) => U;
    }): Either<T, U>;
    match<T, U>({ left: leftCb, right: rightCb, }: {
        left: (arg: L) => T;
        right: (arg: R) => U;
    }): T | U;
    get(property: keyof (L & R)): Maybe<L[keyof L]> | Maybe<R[keyof R]>;
}
//# sourceMappingURL=Either.d.ts.map