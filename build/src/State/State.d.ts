import { Schtate } from "../types/Schtate";
export declare class State<Something> implements Schtate<Something> {
  private value;
  private constructor();
  static isState: (arg: unknown) => arg is State<unknown>;
  static of<Something>(val: Something): State<Something>;
  static fromFunction<Something>(cb: () => Something): State<Something>;
  map<SomethingElse>(
    cb: (arg: Something) => SomethingElse
  ): State<SomethingElse>;
  reduce<SomethingElse>(
    cb: (arg0: SomethingElse, arg1: Something) => SomethingElse,
    starterThing: SomethingElse
  ): State<SomethingElse>;
  match<T>(cb: (arg: Something) => T): T;
}
