import { State } from "../State/State.js";
import { Maybe } from "../Maybe/Maybe.js";
import { deepClone } from "../utils/deepClone.js";

export class Either<L, R> {
  private value: State<L | R>;
  private whichSide: "right" | "left";

  private constructor(value: State<L | R>, whichSide: "right" | "left") {
    this.value = value;
    this.whichSide = whichSide;
  }

  private static of<L, R>(
    val: L | R | State<L> | State<R>,
    whichSide: "right" | "left"
  ): Either<L, R> {
    if (State.isState(val)) {
      return new Either<L, R>(deepClone(val), whichSide);
    }
    return new Either<L, R>(State.of(deepClone(val) as L | R), whichSide);
  }

  static isEither(val: unknown): val is Either<unknown, unknown> {
    return val instanceof Either;
  }

  static fromFunction<L, R>(
    cb: (left: typeof Either.left, right: typeof Either.right) => Either<L, R>
  ) {
    return cb(Either.left, Either.right);
  }

  static left<L, R>(value: L | State<L>) {
    return Either.of<L, R>(deepClone(value), "left");
  }

  static right<L, R>(value: R | State<R>) {
    return Either.of<L, R>(deepClone(value), "right");
  }

  private isLeft(value: State<L | R>): value is State<L> {
    if (this.whichSide === "right") return false;
    return this.whichSide === "left";
  }

  left<X>(cb: (arg: L) => X | R): Either<X, R> {
    return this.map<X, R>({
      left: (value) => {
        return cb(deepClone(value)) as X;
      },
      right: (v) => deepClone(v),
    });
  }

  right<Y>(cb: (arg: R) => L | Y): Either<L, Y> {
    return this.map<L, Y>({
      left: (l) => {
        return deepClone(l);
      },
      right: (value) => {
        return cb(deepClone(value)) as Y;
      },
    });
  }

  map<T, U>({
    left: leftCb,
    right: rightCb,
  }: {
    left: (arg: L) => T;
    right: (arg: R) => U;
  }): Either<T, U> {
    if (this.isLeft(this.value)) {
      const mappedValue: State<T> = this.value.map((val: L): T => {
        return leftCb(deepClone(val));
      });
      return Either.left(mappedValue);
    }
    const mappedValue: State<U> = this.value.map((val): U => {
      return rightCb(deepClone(val) as R);
    });
    return Either.right(mappedValue);
  }

  match<T, U>({
    left: leftCb,
    right: rightCb,
  }: {
    left: (arg: L) => T;
    right: (arg: R) => U;
  }) {
    if (this.isLeft(this.value)) {
      return this.value.match(leftCb);
    }
    return this.value.match((r) => {
      return rightCb(deepClone(r) as R);
    });
  }

  get(property: keyof (L & R)) {
    return this.match({
      left: (left) => {
        const l = left[property as keyof L];
        return Maybe.of<typeof l>(deepClone(l));
      },
      right: (right) => {
        const r = right[property as keyof R];
        return Maybe.of<typeof r>(deepClone(r));
      },
    });
  }
}
