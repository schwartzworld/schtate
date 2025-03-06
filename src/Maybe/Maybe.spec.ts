import { Maybe } from "./Maybe";
import { nothing } from "./nothing";

describe("Maybe Monad Tests", () => {
  it("has methods that create a maybe", () => {
    expect.assertions(1);
    const value = "foo";
    Maybe.of(value).something((val) => {
      expect(val).toEqual(value);
    });
  });

  it("flattens Maybe values supplied to constructor", () => {
    const wow = "wow";
    const nested = Maybe.of(Maybe.of(Maybe.of(Maybe.of(wow))));
    nested.something((val) => {
      expect(val).toBe(wow);
    });
  });

  it("has a method for knowing if something is a Maybe", () => {
    expect(Maybe.isMaybe(Maybe.nothing())).toBeTruthy();
    expect(Maybe.isMaybe(Maybe.of("cheese"))).toBeTruthy();
    expect(Maybe.isMaybe(Maybe.of({ foo: "bar" }))).toBeTruthy();

    expect(Maybe.isMaybe("not a maybe")).toBeFalsy();
    expect(Maybe.isMaybe(undefined)).toBeFalsy();
    expect(Maybe.isMaybe(Infinity)).toBeFalsy();
  });

  it("takes a something callback that will only fire if the maybe is something", () => {
    expect.assertions(1);
    const value = "something";
    Maybe.of(value).something((val) => {
      expect(val).toBe(value);
    });
    Maybe.nothing().something((val) => {
      // This one will never fire
      expect(val).toBe("a different value");
    });
  });

  it("takes a nothing callback that will only fire if the maybe is nothing", () => {
    expect.assertions(1);

    const value = "something";
    Maybe.of(value).nothing(() => {
      // This one will never fire
      expect(value).toBe("fail me please");
    });
    Maybe.nothing().nothing((value) => {
      expect(value.isNothing).toBe(true);
    });
  });

  it("will let you map the value to a different type", () => {
    expect.assertions(3);

    const someString = "some string";
    Maybe.of(someString)
      .map((str) => str.length)
      .something((val) => {
        expect(val).toBe(someString.length);
      });

    Maybe.nothing<number>()
      .map((val) => {
        return val.toString();
      })
      .nothing((val) => {
        expect(val.isNothing).toBe(true);
      });

    Maybe.of(new Date())
      .map((d) => {
        return d.toUTCString();
      })
      .map((str) => {
        return str.split("");
      })
      .map((arr) => {
        return arr.reverse();
      })
      .something((val) => {
        expect(Array.isArray(val)).toBeTruthy();
      });
  });

  it("has a reduce method that takes a starter value", () => {
    expect.assertions(3);
    Maybe.of(100)
      .reduce((total, val) => {
        return total + val;
      }, 100)
      .something((val) => {
        expect(val).toBe(200);
      });

    const starterArr = [1, 2, 3, 4];
    Maybe.of(5)
      .reduce<number[]>((arr, val) => {
        return arr.concat(val);
      }, starterArr)
      .something((arr) => {
        expect(arr).toHaveLength(starterArr.length + 1);
      });

    Maybe.nothing<number>()
      .reduce((arr, val) => {
        return arr.concat(val);
      }, starterArr)
      .nothing((val) => {
        expect(val.isNothing).toBe(true);
      });
  });

  it("has a match function that returns the wrapped value", () => {
    const me = { username: "schwartz" };
    const unwrapped = Maybe.of(me).match({
      something: (v) => v,
      nothing: () => null,
    });
    expect(unwrapped).toEqual(me);

    const nothingStr = "nothing";
    const unwrappedNothing = Maybe.nothing().match({
      something: () => null,
      nothing: () => nothingStr,
    });
    expect(unwrappedNothing).toBe(nothingStr);
  });

  it("match function can map values", () => {
    const userObj = {
      firstName: "irving",
      lastName: "schwartz",
      age: 40,
    };

    const u = Maybe.of(userObj).match({
      something: (user) => user.firstName + " " + user.lastName,
      nothing: () => null,
    });
    expect(u).toBe(`${userObj.firstName} ${userObj.lastName}`);

    const v = Maybe.nothing<typeof userObj>().match({
      something: (user) => user.firstName + " " + user.lastName,
      nothing: () => null,
    });
    expect(v).toBe(null);
  });

  it("can be created from a function", () => {
    Maybe.fromFunction(() => {
      return null;
    })
      .something(() => {
        expect("This should not run").toBe("Oops");
      })
      .nothing(() => {
        expect(1).toBe(1);
      })
      .something(() => {
        expect("This should not run").toBe("Oops");
      });

    Maybe.fromFunction(() => {
      return { foo: "bar" };
    })
      .nothing(() => {
        expect("This should not run").toBe("Oops");
      })
      .something((value) => {
        expect(value.foo).toBe("bar");
      });
  });

  type M = {
    foo: string;
    chicken: string;
  };

  const m = Maybe.of<M>({
    foo: "bar",
    chicken: "nuggets",
  });
  const n = Maybe.nothing<M>();

  it("has a getter function that returns a Maybe", () => {
    expect.assertions(2);
    m.get("chicken").something((val: string) => {
      expect(val).toBe("nuggets");
    });

    n.get("chicken").nothing((val) => {
      expect(val.isNothing).toBe(true);
    });
  });

  it("can be converted to an Either", () => {
    expect.assertions(2);
    m.toEither().left((val) => {
      expect(val.foo).toBe("bar");
    });
    n.toEither().right((val) => {
      expect(val).toBe(null);
    });
  });

  it("can be converted to a Bool", () => {
    expect.assertions(2);
    m.toBool().true(() => {
      expect("true branch is called").toBeTruthy();
    });
    n.toBool().false(() => {
      expect("false branch is called").toBeTruthy();
    });
  });
});
