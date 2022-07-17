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
      expect(value).toBe(value);
    });
    Maybe.nothing().something((val) => {
      // This one will never fire
      expect(value).toBe("a different value");
    });
  });

  it("takes a nothing callback that will only fire if the maybe is nothing", () => {
    expect.assertions(1);

    const value = "something";
    Maybe.of(value).nothing((val) => {
      // This one will never fire
      expect(value).toBe("fail me please");
    });
    Maybe.nothing().nothing((value) => {
      expect(value).toBe(nothing);
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
        expect(val).toBe(nothing);
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
        expect(val).toBe(nothing);
      });
  });

  it("has a match function that returns the wrapped value", () => {
    const me = { username: "schwartz" };
    const unwrapped = Maybe.of(me).match({
      something: (v) => v,
      nothing: () => null,
    });
    expect(unwrapped).toBe(me);

    const nothingStr = "nothing";
    const unwrappedNothing = Maybe.nothing().match({
      something: (v) => null,
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
});
