import { nothing, Nothing } from "./nothing";
import { Schtate } from "../types/Schtate";
import { Either } from "../Either/Either";

export class Maybe<Something> implements Schtate<Something> {
  private value: Either<Something, Nothing>;

  private constructor(value: Something | Nothing) {
    this.value = Either.fromFunction<Something, Nothing>(() => {
      if (Maybe.isNothing(value)) {
        return Either.right<Something, Nothing>(value);
      }
      return Either.left<Something, Nothing>(value);
    });
  }

  private static isNothing(value: unknown): value is Nothing {
    return value instanceof Nothing;
  }

  static isMaybe = (arg: unknown): arg is Maybe<unknown> => {
    return arg instanceof Maybe;
  };

  static nothing<T>() {
    return Maybe.of<T>(nothing);
  }

  static of<Something>(
    val: Something | Nothing | Maybe<Something> | null | undefined
  ): Maybe<Something> {
    if (val === null || val === undefined) {
      return Maybe.nothing<Something>();
    }
    if (Maybe.isMaybe(val)) {
      return val as Maybe<Something>;
    }
    return new Maybe<Something>(val as Something);
  }

  static fromFunction<Something>(cb: () => Something | null | Nothing) {
    const value = cb();
    return Maybe.of(value);
  }

  nothing(cb: (arg: Nothing) => void) {
    this.value.right(cb);
    return this;
  }

  map<SomethingElse>(
    cb: (arg: Something) => SomethingElse
  ): Maybe<SomethingElse> {
    return Maybe.fromFunction<SomethingElse>(() => {
      return this.value.match({
        left: (val) => {
          const result: SomethingElse = cb(val);
          return result;
        },
        right: () => {
          return nothing;
        },
      });
    });
  }

  something = this.map;

  reduce<SomethingElse>(
    cb: (arg0: SomethingElse, arg1: Something) => SomethingElse,
    starterThing: SomethingElse
  ): Maybe<SomethingElse> {
    return this.something((val) => {
      return cb(starterThing, val);
    });
  }

  match<T, U>({
    something: somethingCB,
    nothing: nothingCB,
  }: {
    something: (arg: Something) => T;
    nothing: () => U;
  }) {
    return this.value.match({
      left: somethingCB,
      right: nothingCB,
    });
  }
}
