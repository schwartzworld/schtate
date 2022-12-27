import { Result } from "./Result";
import { Maybe } from "../Maybe/Maybe";

describe("Result tests", () => {
  it("should create a Result from an async function", async () => {
    expect.assertions(1);

    const res: Result<number> = await Result.fromFunction(() => Math.random());
    res.data((num) => {
      expect(typeof num).toBe("number");
    });
  });

  it("should catch errors and wrap them as a result", async () => {
    expect.assertions(1);

    const err = "This Failed";
    const res: Result<number> = await Result.fromFunction(() => {
      throw new Error(err);
    });
    res.error((e) => {
      expect(e).toBe(new Error(err).toString());
    });
  });

  it("should allow you to map over a valid result", () => {
    expect.assertions(2);

    const res = Result.data(Math.random());
    const doubled: Result<number> = res.data((num) => num * 2);
    doubled
      .data((num) => {
        expect(typeof num).toBe("number");
        return Maybe.of(num > 0.5 ? String(num) : null);
      })
      .error((e) => {
        expect(e).toBe("This test should not run.");
      })
      .data((maybe) => {
        expect(Maybe.isMaybe(maybe)).toBeTruthy();
        return maybe.map((something) => something.length);
      });
  });

  it("should allow you to apply a callback to errors", () => {
    expect.assertions(2);

    const message = "This didn't work!";
    const anotherMsg = "Yes it did!";
    const err = Result.error(message);
    err
      .error((e) => {
        expect(e).toBe(message);
        return anotherMsg;
      })
      .data((d) => {
        expect(d).toBe("This should not have been called");
      })
      .error((e) => {
        expect(e).toBe(anotherMsg);
      });
  });

  it("can identify a fellow Result", () => {
    expect(Result.isResult(Result.data(5))).toBeTruthy();
    expect(Result.isResult(Result.error("oh no"))).toBeTruthy();
    expect(Result.isResult("Not a result")).toBeFalsy();
  });

  it("has a map function", () => {
    const n = 100;
    const res = Result.data<number>(n);
    const mapped = res.map({
      data: (num) => num * 2,
      error: (e) => e,
    });
    mapped
      .error(() => {
        expect("this should not run").toBe(1);
      })
      .data((num) => {
        expect(num).toBe(n * 2);
      });

    const msg = "oh no";
    const err = Result.error<number>(msg);
    const errMapped = err.map({
      data: (num) => num * 2,
      error: (e) => {
        return e + e;
      },
    });
    errMapped
      .data((num) => {
        expect("this should not run").toBe(1);
      })
      .error((e) => {
        expect(e).toBe(msg + msg);
      });
  });

  it("can be reduced", () => {
    const res = Result.data<string>("Hello");
    const reduced = res.reduce((total, str) => {
      return total + str.length;
    }, 100);
    reduced
      .error(() => {
        expect("this should not run").toBe(1);
      })
      .data((num) => {
        expect(num).toBe(105);
      });
  });

  it("can be unwrapped with match", () => {
    const n = 100;
    const res = Result.data<number>(n);
    const unwrapped = res.match({
      data: (val) => val * 2,
      error: (e) => e,
    });
    expect(unwrapped).toBe(n * 2);

    const err = Result.error<number>("Fool");
    const unwrappedErr = err.match({
      data: (val) => val * 2,
      error: (e) => e,
    });
    expect(unwrappedErr).toBe("Fool");
  });
});
