export interface Reduceable<T> {
  reduce: <U>(cb: (accumulator: U, value: T) => U, starter: U) => Reduceable<U>;
}
