import nothing, { Nothing } from './nothing'

class Maybe<Something> {
  private value: Something | Nothing;

  private constructor(value: Something | Nothing) {
    if (value instanceof Maybe) {
      this.value = value.value;
    } else {
      this.value = value;
    }
  }

  private isNothing(value: unknown): value is Nothing {
    return this.value instanceof Nothing;
  }

  static create<Something>(val: (Something | Nothing | Maybe<Something>)) {
    if (val instanceof Maybe) {
      return new Maybe<Something>(val.value);
    }
    return new Maybe<Something>(val);
  }

  something(cb: (arg: Something) => void): Maybe<Something> {
    if (!this.isNothing(this.value)) {
      cb(this.value);
    }
    return Maybe.create<Something>(this.value);
  }
  
  nothing(cb: (arg: Nothing) => void) {
    if (this.isNothing(this.value)) {
      cb(this.value);
    }
    return Maybe.create<Something>(this.value);
  }


  map(cb: (arg: Something) => Something): Maybe<Something> {
    if (this.isNothing(this.value)) {
      return Maybe.create<Something>(nothing);
    }
    return Maybe.create(cb(this.value));
  }

  reduce<T>(cb: (arg0: T, arg1: Something) => T, starterThing: T){
    if (this.isNothing(this.value)) {
      return Maybe.create(nothing);
    }
    return Maybe.create(cb(starterThing, this.value));
  }
}