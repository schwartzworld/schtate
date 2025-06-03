import { jest, expect, describe, it } from "@jest/globals";
import { Bool } from "./Bool.js";

describe("Bool tests", () => {
  describe("build a Bool", () => {
    it("wraps a value and represents it as a boolean", () => {
      const b = Bool.of(1);
      b.map((value) => {
        expect(typeof value).toBe("boolean");
        return value;
      });
    });

    it("does not coerce 0 or other empty but truthy types", () => {
      const arr = Bool.of([]);
      arr.true((value) => {
        expect(value).toBe(true);
      });

      const zero = Bool.of(0);
      zero.true((value) => {
        expect(value).toBe(true);
      });

      const obj = Bool.of({});
      obj.true((value) => {
        expect(value).toBe(true);
      });
    });

    it("does coerce null and undefined", () => {
      const arr = Bool.of(false);
      arr.false((value) => {
        expect(value).toBe(false);
      });

      const n = Bool.of(null);
      n.false((value) => {
        expect(value).toBe(false);
      });

      const u = Bool.of(undefined);
      u.false((value) => {
        expect(value).toBe(false);
      });
    });

    it("can also create a Bool from a function", () => {
      const f = Bool.fromFn(() => false);
      f.false((value) => {
        expect(value).toBe(false);
      });
      const g = Bool.fromFn(() => "f" === "f");
      g.true((value) => {
        expect(value).toBe(true);
      });
    });

    it("has a utility method for creating a truthy Bool", () => {
      Bool.true().true((value) => {
        expect(value).toBe(true);
      });
    });

    it("has a utility method for creating a falsey Bool", () => {
      Bool.false().false((value) => {
        expect(value).toBe(false);
      });
    });
  });

  describe("working with Bools", () => {
    it("takes a callback that only runs when truthy", () => {
      expect.assertions(1);
      Bool.true()
        .true(() => {
          expect("this test will pass").toBeTruthy();
        })
        .false(() => {
          expect("this test should not run").toBeFalsy();
        });
    });

    it("takes a callback that only runs when falsy", () => {
      expect.assertions(1);
      Bool.false()
        .true(() => {
          expect("this test should not run").toBeFalsy();
        })
        .false(() => {
          expect("this test will pass").toBeTruthy();
        });
    });

    it("has a map function for compounding booleans", () => {
      expect.assertions(2);
      const trueBool = Bool.true();
      const falseBool = trueBool.map((val) => val && false);
      falseBool.false(() => {
        expect("this test will pass").toBeTruthy();
      });

      const anotherTrue = falseBool.map((val) => val || true);
      anotherTrue.true(() => {
        expect("this test should pass").toBeTruthy();
      });
    });

    it("can extract its value via pattern matching", () => {
      const shouldBeFoo = Bool.true().match({
        true: () => "foo",
        false: () => "bar",
      });
      expect(shouldBeFoo).toBe("foo");

      const shouldBeBar = Bool.false().match({
        true: () => "foo",
        false: () => "bar",
      });
      expect(shouldBeBar).toBe("bar");
    });

    it("can compound values", () => {
      expect.assertions(6);
      Bool.of(false)
        .or("something")
        .true(() => {
          expect("this to pass").toBeTruthy();
        })
        .false(() => {
          expect("this should not pass").toBe("failure");
        });

      Bool.of(false)
        .or(null)
        .true(() => {
          expect("this should not pass").toBe("failure");
        })
        .false(() => {
          expect("this to pass").toBeTruthy();
        });

      Bool.of(true)
        .or(null)
        .true(() => {
          expect("this to pass").toBeTruthy();
        })
        .false(() => {
          expect("this should not pass").toBe("failure");
        });

      Bool.of(true)
        .and(null)
        .true(() => {
          expect("this should not pass").toBe("failure");
        })
        .false(() => {
          expect("this to pass").toBeTruthy();
        });

      Bool.of(false)
        .and(true)
        .true(() => {
          expect("this should not pass").toBe("failure");
        })
        .false(() => {
          expect("this to pass").toBeTruthy();
        });

      Bool.of(true)
        .and(true)
        .true(() => {
          expect("this to pass").toBeTruthy();
        })
        .false(() => {
          expect("this should not pass").toBe("failure");
        });
    });
  });

  it("can be converted to an Either", () => {
    expect.assertions(2);
    const t = Bool.true();
    const f = Bool.false();

    t.toEither().left((val) => {
      expect(val).toBe(true);
    });

    f.toEither().right((val) => {
      expect(val).toBe(false);
    });
  });

  it("can be converted to a Maybe", () => {
    expect.assertions(2);
    const t = Bool.true();
    const f = Bool.false();

    t.toMaybe().something((val) => {
      expect(val).toBe(true);
    });

    f.toMaybe().nothing((val) => {
      expect(val.isNothing).toBe(true);
    });
  });
});
