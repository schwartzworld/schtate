"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maybe = void 0;
const nothing_1 = require("./nothing");
const Either_1 = require("./Either");
class Maybe {
    constructor(value) {
        this.value = Either_1.Either.fromFunction(() => {
            if (this.isNothing(value)) {
                return Either_1.Either.right(value);
            }
            return Either_1.Either.left(value);
        });
    }
    isNothing(value) {
        return value instanceof nothing_1.Nothing;
    }
    static nothing() {
        return Maybe.of(nothing_1.nothing);
    }
    static of(val) {
        if (val === null || val === undefined) {
            return Maybe.nothing();
        }
        if (Maybe.isMaybe(val)) {
            return val;
        }
        return new Maybe(val);
    }
    static fromFunction(cb) {
        const value = cb();
        return Maybe.of(value);
    }
    something(cb) {
        this.value.left((val) => cb(val));
        return this;
    }
    nothing(cb) {
        this.value.right(cb);
        return this;
    }
    map(cb) {
        return Maybe.fromFunction(() => {
            return this.value.match({
                left: (val) => {
                    return cb(val);
                },
                right: () => {
                    return nothing_1.nothing;
                },
            });
        });
    }
    reduce(cb, starterThing) {
        return Maybe.fromFunction(() => {
            return this.value.match({
                left: (val) => {
                    return cb(starterThing, val);
                },
                right: () => {
                    return nothing_1.nothing;
                },
            });
        });
    }
    match({ something: somethingCB, nothing: nothingCB, }) {
        return this.value.match({
            left: somethingCB,
            right: nothingCB,
        });
    }
}
exports.Maybe = Maybe;
Maybe.isMaybe = (arg) => {
    return arg instanceof Maybe;
};
/*

export class Maybe<Something> implements Schtate<Something> {
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
    val: Something | Nothing | Maybe<Something> | null | undefined
  ): Maybe<Something> {
    if (val === null || val === undefined) {
      return Maybe.nothing<Something>();
    }
    if (Maybe.isMaybe(val)) {
      return val as Maybe<Something>;
    }
    return new Maybe<Something>(val);
  }

  static fromFunction<Something>(cb: () => Something | null | Nothing) {
    const value = cb();
    return Maybe.of(value);
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
  ): Maybe<SomethingElse> {
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
*/
