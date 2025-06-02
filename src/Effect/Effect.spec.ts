import { Effect } from "./Effect";

describe("Effect", () => {
  test("blag", async () => {
    expect.assertions(2);
    const example = async () => {
      const E = Effect.of(() => "hello world");
      return E.run();
    };

    const result = await example();
    expect(result).toBeInstanceOf(Effect);
    // @ts-expect-error I know it's private
    result.result.something((val) => {
      val.data((value) => {
        expect(value).toBe("hello world");
      });
      // this one shouldn't run
      val.error((error) => {
        expect(error).toBe("Test failure, baby");
      });
    });
  });
});
