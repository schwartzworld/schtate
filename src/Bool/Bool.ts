import { nothing, Nothing } from "../Maybe/nothing";
import { Schtate } from "../types/Schtate";

export class Bool<T extends boolean> {
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

  static fromFn(cb: () => false | undefined | null) {
    return Bool.of(cb());
  }

  static false() {
    return new Bool<false>(false);
  }

  static true() {
    return new Bool<true>(true);
  }

  map<U extends boolean>(cb: (arg: boolean) => boolean): Bool<U> {
    const v = cb(this.value);
    return Bool.of(v);
  }

  true(cb: () => void) {
    if (this.value) {
      cb();
    }
    return this;
  }

  false(cb: () => void) {
    if (!this.value) {
      cb();
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
}
