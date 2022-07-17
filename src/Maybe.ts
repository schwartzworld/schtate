import { nothing, Nothing } from "./nothing";

export class Maybe<Something> {
  private value: Something | Nothing;

  private constructor(value: Something | Nothing) {
    this.value = value;
  }

  private isNothing(value: unknown): value is Nothing {
    return this.value instanceof Nothing;
  }

  static isMaybe = (arg: unknown): arg is Maybe<unknown> => {
    return arg instanceof Maybe;
  };

  static of<Something>(
    val: Something | Nothing | Maybe<Something>
  ): Maybe<Something> {
    if (Maybe.isMaybe(val)) {
      return new Maybe<Something>(val.value);
    }
    return new Maybe<Something>(val);
  }

  static nothing<T>() {
    return Maybe.of<T>(nothing);
  }

  something(cb: (arg: Something) => void): Maybe<Something> {
    if (!this.isNothing(this.value)) {
      cb(this.value);
    }
    return Maybe.of<Something>(this.value);
  }

  nothing(cb: (arg: Nothing) => void) {
    if (this.isNothing(this.value)) {
      cb(this.value);
    }
    return Maybe.of<Something>(this.value);
  }

  map<SomethingElse>(
    cb: (arg: Something) => SomethingElse
  ): Maybe<SomethingElse> {
    if (this.isNothing(this.value)) {
      return Maybe.of<SomethingElse>(nothing);
    }
    return Maybe.of(cb(this.value));
  }

  reduce<SomethingElse>(
    cb: (arg0: SomethingElse, arg1: Something) => SomethingElse,
    starterThing: SomethingElse
  ) {
    if (this.isNothing(this.value)) {
      return Maybe.nothing();
    }
    return Maybe.of(cb(starterThing, this.value));
  }

  match<T, U>({
    something: somethingCB,
    nothing: nothingCB,
  }: {
    something: (arg: Something) => T;
    nothing: () => U;
  }) {
    if (this.isNothing(this.value)) {
      return nothingCB();
    }
    return somethingCB(this.value);
  }
}
