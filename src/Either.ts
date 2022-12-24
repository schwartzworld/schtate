export class Either<L, R> {
  private value: L | R;
  private whichSide: "right" | "left";

  private constructor(value: L | R, whichSide: "right" | "left") {
    this.value = value;
    this.whichSide = whichSide;
  }

  private static of<L, R>(
    val: L | R,
    whichSide: "right" | "left"
  ): Either<L, R> {
    return new Either<L, R>(val, whichSide);
  }

  static isEither(val: unknown): val is Either<unknown, unknown> {
    return val instanceof Either;
  }

  static fromFunction<L, R>(cb: () => Either<L, R>) {
    return cb();
  }

  static left<L, R>(value: L) {
    return Either.of<L, R>(value, "left");
  }

  static right<L, R>(value: R) {
    return Either.of<L, R>(value, "right");
  }

  private isLeft(value: L | R): value is L {
    return this.whichSide === "left";
  }

  left<X>(cb: (arg: L) => X | R): Either<X, R> {
    return this.map<X, R>({
      left: (value) => {
        return cb(value) as X;
      },
      right: () => {
        return this.value as R;
      },
    });
  }

  right<Y>(cb: (arg: R) => L | Y): Either<L, Y> {
    return this.map<L, Y>({
      left: (value) => {
        return this.value as L;
      },
      right: (value) => {
        return cb(value) as Y;
      },
    });
  }

  map<T, U>({
    left: leftCb,
    right: rightCb,
  }: {
    left: (arg: L) => T;
    right: (arg: R) => U;
  }) {
    if (this.isLeft(this.value)) {
      return Either.left<T, U>(leftCb(this.value));
    }
    return Either.right<T, U>(rightCb(this.value));
  }

  match<T, U>({
    left: leftCb,
    right: rightCb,
  }: {
    left: (arg: L) => T;
    right: (arg: R) => U;
  }) {
    if (this.isLeft(this.value)) {
      return leftCb(this.value);
    }
    return rightCb(this.value);
  }
}
