import { Either } from "../Either/Either.js";
import { Maybe } from "../Maybe/Maybe.js";

export class Bool {
  private value: boolean;
  constructor(value: boolean) {
    this.value = value;
  }

  static of(arg: unknown) {
    if (arg === false || arg === undefined || arg === null) {
      return Bool.false();
    }
    return Bool.true();
  }

  static fromFn(cb: () => boolean | undefined | null) {
    return Bool.of(cb());
  }

  static false() {
    return new Bool(false);
  }

  static true() {
    return new Bool(true);
  }

  map(cb: (arg: boolean) => boolean): Bool {
    const v = cb(this.value);
    return Bool.of(v);
  }

  and(value: unknown) {
    return this.map((v) => {
      return Boolean(value) && v;
    });
  }
  or(value: unknown) {
    return this.map((v) => {
      return Boolean(value) || v;
    });
  }

  true(cb: (arg: boolean) => void) {
    if (this.value) {
      cb(this.value);
    }
    return this;
  }

  false(cb: (arg: boolean) => void) {
    if (!this.value) {
      cb(this.value);
    }
    return this;
  }

  match<T, U>({
    true: trueCB,
    false: falseCB,
  }: {
    true: () => T;
    false: () => U;
  }) {
    if (!this.value) {
      return falseCB();
    }
    return trueCB();
  }

  toEither(): Either<true, false> {
    return this.match({
      true: () => {
        return Either.left(true);
      },
      false: () => {
        return Either.right(false);
      },
    });
  }

  toMaybe(): Maybe<boolean> {
    return this.match({
      true: () => {
        return Maybe.of<boolean>(true);
      },
      false: () => {
        return Maybe.nothing<boolean>();
      },
    });
  }
}
