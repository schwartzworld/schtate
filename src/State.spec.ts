import { Maybe } from "./Maybe";
import { nothing } from "./nothing";
import { State } from "./State";

describe("State Monad Tests", () => {
  it("has methods that create a State", () => {
    expect.assertions(2);
    const foo = "foo";

    State.of(foo).match((val) => {
      expect(val).toBe(foo);
    });

    State.fromFunction(() => {
      return 5;
    }).match((val) => {
      expect(val).toBe(5);
    });
  });

  it("will let you map the value to a different type", () => {
    expect.assertions(4);

    const someString = "some string";
    const strState = State.of(someString);
    const arrState = strState.map((str: string) => {
      return str.split("");
    });

    arrState.match((arr: string[]) => {
      expect(arr).toHaveLength(someString.length);
      expect(arr).toBeInstanceOf(Array);
    });

    arrState
      .map<number>((arr: string[]) => {
        return arr.length;
      })
      .match((num: Number) => {
        expect(num).toBe(someString.length);
      });

    expect(State.isState(arrState)).toBe(true);
  });

  it("has a reduce method that takes a starter value", () => {
    expect.assertions(2);
    State.of(100)
      .reduce((total, val) => {
        return total + val;
      }, 100)
      .match((val) => {
        expect(val).toBe(200);
      });

    const starterArr = [1, 2, 3, 4];
    State.of(5)
      .reduce<number[]>((arr, val) => {
        return arr.concat(val);
      }, starterArr)
      .match((arr) => {
        expect(arr).toHaveLength(starterArr.length + 1);
      });
  });

  it("has a match function that returns the wrapped value", () => {
    const me = { username: "schwartz" };
    const unwrapped = State.of(me).match((user) => {
      return user;
    });
    expect(unwrapped).toBe(me);

    const numbers = [1, 2, 3];
    const second = State.of(numbers).match((numArr) => {
      return numArr[1];
    });

    expect(second).toBe(numbers[1]);
  });
});
