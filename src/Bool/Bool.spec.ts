import { Bool } from "./Bool";

describe("Bool tests", () => {
  describe("build a Bool", () => {
    it("wraps a value and represents it as a boolean", () => {
      const b = Bool.of(Math.random() > 0.5);
      // @ts-ignore
      expect(typeof b.value).toBe("boolean");
    });

    it("does not coerce 0 or other empty but truthy types", () => {
      const arr = Bool.of([]);
      // @ts-ignore
      expect(arr.value).toBe(true);

      const zero = Bool.of(0);
      // @ts-ignore
      expect(zero.value).toBe(true);

      const obj = Bool.of({});
      // @ts-ignore
      expect(obj.value).toBe(true);
    });

    it("does coerce null and undefined", () => {
      const arr = Bool.of(false);
      // @ts-ignore
      expect(arr.value).toBe(false);

      const zero = Bool.of(null);
      // @ts-ignore
      expect(zero.value).toBe(false);

      const obj = Bool.of(undefined);
      // @ts-ignore
      expect(obj.value).toBe(false);
    });

    it("can also create a Bool from a function", () => {
      // @ts-ignore
      expect(Bool.fromFn(() => false).value).toBe(false);
      // @ts-ignore
      expect(Bool.fromFn(() => "f" === "f").value).toBe(true);
    });

    it("has a utility method for creating a truthy Bool", () => {
      // @ts-ignore
      expect(Bool.true().value).toBe(true);
    });

    it("has a utility method for creating a falsey Bool", () => {
      // @ts-ignore
      expect(Bool.false().value).toBe(false);
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
