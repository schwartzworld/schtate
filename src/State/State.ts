import { Schtate } from "../types/Schtate";
import { deepClone } from "../utils/deepClone";

export class State<Something> implements Schtate<Something> {
  private value: Something;

  private constructor(value: Something) {
    this.value = value;
  }

  static isState = (arg: unknown): arg is State<unknown> => {
    return arg instanceof State;
  };

  static of<Something>(val: Something): State<Something> {
    return new State<Something>(val);
  }

  static fromFunction<Something>(cb: () => Something) {
    const value = cb();
    return State.of(deepClone(value));
  }

  map<SomethingElse>(
    cb: (arg: Something) => SomethingElse
  ): State<SomethingElse> {
    return State.of(cb(deepClone(this.value)));
  }

  reduce<SomethingElse>(
    cb: (arg0: SomethingElse, arg1: Something) => SomethingElse,
    starterThing: SomethingElse
  ): State<SomethingElse> {
    return State.of(cb(deepClone(starterThing), deepClone(this.value)));
  }

  match<T>(cb: (arg: Something) => T) {
    return cb(deepClone(this.value));
  }
}
