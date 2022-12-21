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

  static fromFunction<L, R>(cb: () => Either<L, R>) {
    return cb();
  }

  static left<L, R>(value: L) {
    return Either.of<L, R>(value, "left");
  }

  static right<L, R>(value: R) {
    return Either.of<L, R>(value, "right");
  }

  private isRight(value: L | R): value is R {
    return this.whichSide === "right";
  }

  private isLeft(value: L | R): value is L {
    return this.whichSide === "left";
  }

  left<X>(cb: (arg: L) => X | R): Either<X, R> {
    const l = this.value;

    if (this.isLeft(l)) {
      return Either.left(cb(l) as X);
    }

    return Either.right(this.value as R);
  }

  right<Y>(cb: (arg: R) => L | Y): Either<L, Y> {
    const r = this.value;

    if (this.isRight(r)) {
      return Either.right(cb(r) as Y);
    }

    return Either.left(this.value as L);
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
