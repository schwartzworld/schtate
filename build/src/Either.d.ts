export declare class Either<L, R> {
  private value;
  private whichSide;
  private constructor();
  private static of;
  static isEither(val: unknown): val is Either<unknown, unknown>;
  static fromFunction<L, R>(cb: () => Either<L, R>): Either<L, R>;
  static left<L, R>(value: L): Either<L, R>;
  static right<L, R>(value: R): Either<L, R>;
  private isRight;
  private isLeft;
  left<X>(cb: (arg: L) => X | R): Either<X, R>;
  right<Y>(cb: (arg: R) => L | Y): Either<L, Y>;
  map<T, U>({
    left: leftCb,
    right: rightCb,
  }: {
    left: (arg: L) => T;
    right: (arg: R) => U;
  }): Either<T, U>;
  match<T, U>({
    left: leftCb,
    right: rightCb,
  }: {
    left: (arg: L) => T;
    right: (arg: R) => U;
  }): T | U;
}
