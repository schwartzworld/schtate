export declare class Bool<T extends boolean> {
  private value;
  constructor(value: boolean);
  static of(arg: unknown): Bool<false>;
  map<U extends boolean>(cb: (arg: boolean) => boolean): Bool<U>;
  true(cb: () => void): this;
  false(cb: () => void): this;
}
