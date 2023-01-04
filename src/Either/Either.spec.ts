import { Either } from "./Either";
import {Maybe} from "../Maybe/Maybe";

describe("Either Monad Tests", () => {
  it("can create a Left or Right either", () => {
    const left: Either<string, number> = Either.left("Hello");
    expect(left).toBeInstanceOf(Either);

    const right: Either<string, number> = Either.right(1);
    expect(right).toBeInstanceOf(Either);

    const fromFn: Either<true, false> = Either.fromFunction(() => {
      const bool = Math.random() > 0.5;
      return bool ? Either.left(bool) : Either.right(bool);
    });
    expect(fromFn).toBeInstanceOf(Either);
  });

  it("can validate if something is an Either", () => {
    expect(Either.isEither(1)).toBe(false);
    expect(Either.isEither("a")).toBe(false);
    expect(Either.isEither({ foo: "bar" })).toBe(false);
    expect(Either.isEither([1, 2, 3])).toBe(false);

    expect(Either.isEither(Either.left(5))).toBe(true);
    expect(Either.isEither(Either.right("a"))).toBe(true);
    expect(
      Either.isEither(
        Either.fromFunction<{foo: 'bar'}, number[]>(() =>
          Math.random() > 0.5
            ? Either.left({ foo: "bar" })
            : Either.right([1, 2, 3])
        )
      )
    ).toBe(true);
  });

  test("leftward eithers can map the left side while skipping the right", () => {
    const left: Either<string, number> = Either.left("Hello");

    const toArr: Either<string[], number> = left
      .left((value) => {
        expect(value).toBe("Hello");
        return value.split("");
      })
      .right((arg) => {
        expect(arg).toBe("This should not run");
        return arg * 2;
      });

    toArr.match({
      left: (value: string[]) => {
        expect(value).toBeInstanceOf(Array);
      },
      right: (value: number) => {
        // won't run
        expect(2).toBe("This should not run");
      },
    });
  });

  test("rightward eithers can map the right side while skipping the left", () => {
    const right: Either<string, number> = Either.right(1000);

    const mapped = right
      .right((val) => {
        expect(val).toBe(1000);
        return String(1000);
      })
      .left((val: string) => {
        expect(val).toBe("This should not run");
        return val + val;
      });

    mapped.match({
      left: (value: string) => {
        expect(value).toBe("This should not run");
      },
      right: (value: string) => {
        expect(value).toBe("1000");
      },
    });
  });

  it("can map values using the map method", () => {
    // left
    const l = Either.left<string, number>("Hello");
    const mappedL: Either<string[], number> = l.map({
      left: (str) => {
        return str.split("");
      },
      right: (num) => {
        expect(num).toBe("This should not run");
        return num;
      },
    });
    mappedL.match({
      left: (arr) => {
        expect(arr).toHaveLength(5);
      },
      right: (num) => {
        expect(num).toBe("This should not run");
      },
    });

    // right
    const r = Either.right<string, number>(100);
    const mappedR: Either<string, string[]> = r.map({
      left: (str) => {
        expect(str).toBe("This should not run");
        return str;
      },
      right: (num) => {
        return new Array(num).fill("f");
      },
    });
    mappedR.match({
      left: (str) => {
        expect(str).toBe("This should not run");
      },
      right: (arr) => {
        expect(arr).toHaveLength(100);
      },
    });
  });

  it("can unwrap using the match function", () => {
    const Me = { name: "schwartz", age: 40 };
    const Irving = { name: "irving", age: 75 };
    const meEither = Either.fromFunction<typeof Me, typeof Irving>(() => {
      return true ? Either.left(Me) : Either.right(Irving);
    });

    const myAge: number | void = meEither.match({
      left: (person) => {
        return person.age;
      },
      right: (person) => {
        expect(person).toBe("This should not run");
        return;
      },
    });
    expect(myAge).not.toBeNull();
    expect(myAge).toBe(Me.age);

    const irvingEither = Either.fromFunction<typeof Me, typeof Irving>(() => {
      return false ? Either.left(Me) : Either.right(Irving);
    });

    const irvAge: number | void = irvingEither.match<void, number>({
      left: (person) => {
        expect(person).toBe("This should not run");
        return;
      },
      right: (person) => {
        return person.age;
      },
    });

    expect(irvAge).not.toBeNull();
    expect(irvAge).toBe(Irving.age);
  });
  describe('has a getter function that returns a maybe', () => {
    test('rightward', () => {
      expect.assertions(2);
      const rrr = Either.fromFunction<{name: string}, {foo: string}>((left, right) => {
        return right({foo: 'bar'});
      });
      const foo = rrr.get('foo');

      foo.nothing((val) => {
        expect(val).toBe('this was never called')
      });
      foo.something((val) => {
        expect(val).toBe('bar')
      });

      const name = rrr.get('name');
      name.nothing(() => {
        expect('this').toBe('this');
      });
      name.something((val) => {
        expect(val).toBe('not called');
      })
    })
    test('leftward', () => {
      expect.assertions(2);
      const lll = Either.fromFunction<{name: string}, {foo: string}>((left, right) => {
        return left({name: 'roseanne'});
      });
      const foo = lll.get('foo');

      foo.nothing((val) => {
        expect('passed').toBe('passed')
      });
      foo.something((val) => {
        expect(val).toBe('this was never called')
      });

      const name = lll.get('name');
      name.something((val) => {
        expect(val).toBe('roseanne');
      });
      name.nothing((val) => {
        expect(val).toBe('not called');
      })
    })
  })
});
