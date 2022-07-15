import { nothing, Nothing } from './nothing'

class Maybe<Something> {
  private value: Something | Nothing;
  private constructor(value: Something | Nothing) {
    if (value instanceof Maybe) {
      this.value = value.value;
    } else {
      this.value = value;
    }
  }

  isNothing(value: unknown): value is Nothing {
    return this.value instanceof Nothing;
  }

  static create<Something>(val: (Something | Nothing | Maybe<Something>)) {
    if (val instanceof Maybe) {
      return new Maybe<Something>(val.value);
    }
    return new Maybe<Something>(val);
  }

  map(cb: (arg: Something) => Something): Maybe<Something> {
    if (this.isNothing(this.value)) {
      return Maybe.create<Something>(nothing);
    }
    return Maybe.create(cb(this.value));
  }

  unwrap(): Something | Nothing {
    return this.value;
  }

  just(cb: (arg: Something) => void): Maybe<Something> {
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

  reduce<T>(cb: (arg0: T, arg1: Something) => T, starterThing: T){
    if (this.isNothing(this.value)) {
      return Maybe.create(nothing);
    }
    return Maybe.create(cb(starterThing, this.value));
  }
}

function coinFlip<T>(value: T): T | Nothing {
  if (Math.random() > 0.5) {
    return value;
  }
  return nothing;
}

const maybeArr = new Array(10).fill(1).map(() => Maybe.create<number>(coinFlip(Math.random()))) // 10 items could be Hello or nothing

maybeArr.forEach(m => {
  m.just(v => console.log(v + 1))
    .map(v => v * v)
    .just(v => console.log(v))
    .nothing(() => console.log('this is nothing'))
    .reduce((obj: {val?: number}, val: number) => {
      obj.val = val;
      console.log({obj})
      return obj;
    }, {})
})