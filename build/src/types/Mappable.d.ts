export interface Mappable<T> {
  map: <U>(cb: (arg: T) => U) => Mappable<U>;
}
