import { Schtate } from "../types/Schtate";
import { Maybe } from "../Maybe/Maybe";

export class State<Something> implements Schtate<Something> {
  private value: Something;

  private constructor(value: Something) {
    this.value = value;
  }

  static isState = (arg: any): arg is State<any> => {
    return arg instanceof State;
  };

  static of<Something>(val: Something): State<Something> {
    return new State<Something>(val);
  }

  static fromFunction<Something>(cb: () => Something) {
    const value = cb();
    return State.of(value);
  }

  map<SomethingElse>(
    cb: (arg: Something) => SomethingElse
  ): State<SomethingElse> {
    return State.of(cb(this.value));
  }

  reduce<SomethingElse>(
    cb: (arg0: SomethingElse, arg1: Something) => SomethingElse,
    starterThing: SomethingElse
  ): State<SomethingElse> {
    return State.of(cb(starterThing, this.value));
  }

  match<T>(cb: (arg: Something) => T) {
    return cb(this.value);
  }
}
