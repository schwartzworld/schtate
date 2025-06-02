import { Effect } from "./Effect";
import { Result } from "../Result/Result";
import { Maybe } from "../Maybe/Maybe";

describe("Effect", () => {
  describe("constructor", () => {
    it("should create an effect with default state", () => {
      expect.assertions(2);
      const effect = Effect.of(() => "test");
      const state = effect.getState();

      expect(state.loading).toBe(false);
      state.result.match({
        something: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(true),
      });
    });

    it("should create an effect with initial state", async () => {
      expect.assertions(2);
      const result = await Result.of(() => "test");
      const maybeResult = Maybe.of(result);
      const effect = new Effect({
        fn: () => "test",
        result: maybeResult,
        loading: true,
      });

      const state = effect.getState();
      expect(state.loading).toBe(true);
      expect(state.result).toBe(maybeResult);
    });
  });

  describe("subscription", () => {
    it("should notify subscribers of initial state", () => {
      expect.assertions(3);
      const effect = Effect.of(() => "test");
      const states: any[] = [];

      effect.subscribe((state) => states.push(state));

      expect(states).toHaveLength(1);
      expect(states[0].loading).toBe(false);
      states[0].result.match({
        something: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(true),
      });
    });

    it("should notify subscribers of state changes", async () => {
      expect.assertions(7);
      const effect = Effect.of(() => "test");
      const states: Array<{ loading: boolean; result: Maybe<Result<string>> }> =
        [];

      effect.subscribe((state) => states.push(state));

      await effect.run();

      // Should go through all states: initial -> loading -> final
      expect(states).toHaveLength(3);

      // Initial state
      expect(states[0].loading).toBe(false);
      states[0].result.match({
        something: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(true),
      });

      // Loading state
      expect(states[1].loading).toBe(true);
      states[1].result.match({
        something: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(true),
      });

      // Final state
      expect(states[2].loading).toBe(false);
      states[2].result.match({
        something: (result: Result<string>) => {
          result.match({
            data: (value: string) => expect(value).toBe("test"),
            error: () => expect(true).toBe(false), // Should not be called
          });
        },
        nothing: () => expect(true).toBe(false), // Should not be called
      });
    });

    it("should allow unsubscribing", () => {
      expect.assertions(1);
      const effect = Effect.of(() => "test");
      const states: any[] = [];

      const unsubscribe = effect.subscribe((state) => states.push(state));
      unsubscribe();

      effect.run();

      expect(states).toHaveLength(1); // Only initial state
    });
  });

  describe("run", () => {
    it("should handle synchronous functions", async () => {
      expect.assertions(9);
      const effect = Effect.of(() => "test");
      const states: Array<{ loading: boolean; result: Maybe<Result<string>> }> =
        [];

      effect.subscribe((state) => states.push(state));

      const result = await effect.run();
      const finalState = result.getState();

      expect(finalState.loading).toBe(false);
      finalState.result.match({
        something: (result: Result<string>) => {
          result.match({
            data: (value: string) => expect(value).toBe("test"),
            error: () => expect(true).toBe(false), // Should not be called
          });
        },
        nothing: () => expect(true).toBe(false), // Should not be called
      });

      // Should go through all states: initial -> loading -> final
      expect(states).toHaveLength(3);

      // Initial state
      expect(states[0].loading).toBe(false);
      states[0].result.match({
        something: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(true),
      });

      // Loading state
      expect(states[1].loading).toBe(true);
      states[1].result.match({
        something: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(true),
      });

      // Final state
      expect(states[2].loading).toBe(false);
      states[2].result.match({
        something: (result: Result<string>) => {
          result.match({
            data: (value: string) => expect(value).toBe("test"),
            error: () => expect(true).toBe(false), // Should not be called
          });
        },
        nothing: () => expect(true).toBe(false), // Should not be called
      });
    });

    it("should handle asynchronous functions", async () => {
      expect.assertions(7);
      const effect = Effect.of(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "test";
      });

      const states: Array<{ loading: boolean; result: Maybe<Result<string>> }> =
        [];
      effect.subscribe((state) => states.push(state));

      const runPromise = effect.run();

      // Should be loading immediately
      expect(states).toHaveLength(2);
      expect(states[0].loading).toBe(false);
      expect(states[1].loading).toBe(true);

      const result = await runPromise;
      const finalState = result.getState();

      expect(finalState.loading).toBe(false);
      finalState.result.match({
        something: (result: Result<string>) => {
          result.match({
            data: (value: string) => expect(value).toBe("test"),
            error: () => expect(true).toBe(false), // Should not be called
          });
        },
        nothing: () => expect(true).toBe(false), // Should not be called
      });

      // Should have gone through all states
      expect(states).toHaveLength(3);
      expect(states[2].loading).toBe(false);
    });

    it("should handle errors", async () => {
      expect.assertions(6);
      const error = new Error("test error");
      const effect = Effect.of<string>(() => {
        throw error;
      });

      const states: Array<{ loading: boolean; result: Maybe<Result<string>> }> =
        [];
      effect.subscribe((state) => states.push(state));

      const result = await effect.run();
      const finalState = result.getState();

      // Should have gone through loading state and back
      expect(states).toHaveLength(3);
      expect(states[0].loading).toBe(false);
      expect(states[1].loading).toBe(true);
      expect(states[2].loading).toBe(false);

      // Final state should contain the error in the Result
      states[2].result.match({
        something: (result: Result<string>) => {
          result.match({
            data: () => expect(true).toBe(false), // Should not be called
            error: (err) => expect(err).toBe(error.message),
          });
        },
        nothing: () => expect(true).toBe(false), // Should not be called
      });

      // Returned effect should have the error in its state
      finalState.result.match({
        something: (result: Result<string>) => {
          result.match({
            data: () => expect(true).toBe(false), // Should not be called
            error: (err) => expect(err).toBe(error.message),
          });
        },
        nothing: () => expect(true).toBe(false), // Should not be called
      });
    });

    it("should handle async errors", async () => {
      expect.assertions(6);
      const error = new Error("test error");
      const effect = Effect.of<string>(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        throw error;
      });

      const states: Array<{ loading: boolean; result: Maybe<Result<string>> }> =
        [];
      effect.subscribe((state) => states.push(state));

      const result = await effect.run();
      const finalState = result.getState();

      // Should be loading immediately
      expect(states).toHaveLength(3);
      expect(states[0].loading).toBe(false);
      expect(states[1].loading).toBe(true);
      expect(states[2].loading).toBe(false);

      // Final state should contain the error in the Result
      states[2].result.match({
        something: (result: Result<string>) => {
          result.match({
            data: () => expect(true).toBe(false), // Should not be called
            error: (err) => expect(err).toBe(error.message),
          });
        },
        nothing: () => expect(true).toBe(false), // Should not be called
      });

      // Returned effect should have the error in its state
      finalState.result.match({
        something: (result: Result<string>) => {
          result.match({
            data: () => expect(true).toBe(false), // Should not be called
            error: (err) => expect(err).toBe(error.message),
          });
        },
        nothing: () => expect(true).toBe(false), // Should not be called
      });
    });
  });

  describe("immutability", () => {
    it("should update original effect state during run but return new instance", async () => {
      expect.assertions(4);
      const effect = Effect.of(() => "test");
      const initialState = effect.getState();

      // Run the effect
      const result = await effect.run();

      // Original effect should remain unchanged
      const currentState = effect.getState();
      expect(currentState).toEqual(initialState);

      // Returned effect should be a new instance with updated state
      expect(result).not.toBe(effect);
      const resultState = result.getState();
      expect(resultState.loading).toBe(false);
      resultState.result.match({
        something: (result: Result<string>) => {
          result.match({
            data: (value: string) => expect(value).toBe("test"),
            error: () => expect(true).toBe(false), // Should not be called
          });
        },
        nothing: () => expect(true).toBe(false), // Should not be called
      });
    });

    it("should not mutate original effect when running", async () => {
      expect.assertions(2);
      const effect = Effect.of(() => "test");
      const originalState = effect.getState();

      await effect.run();

      // Original effect's state should be unchanged
      const currentState = effect.getState();
      expect(currentState.loading).toBe(originalState.loading);

      // Compare Maybe states semantically
      currentState.result.match({
        something: (currentResult: Result<string>) => {
          originalState.result.match({
            something: (originalResult: Result<string>) => {
              // Both should be something
              currentResult.match({
                data: (currentValue: string) => {
                  originalResult.match({
                    data: (originalValue: string) => {
                      expect(currentValue).toBe(originalValue);
                    },
                    error: () => expect(true).toBe(false), // Should not be called
                  });
                },
                error: () => expect(true).toBe(false), // Should not be called
              });
            },
            nothing: () => expect(true).toBe(false), // Should not be called
          });
        },
        nothing: () => {
          originalState.result.match({
            something: () => expect(true).toBe(false), // Should not be called
            nothing: () => expect(true).toBe(true), // Both should be nothing
          });
        },
      });
    });

    it("should return new effect instance after running", async () => {
      expect.assertions(2);
      const effect = Effect.of(() => "test");
      const result = await effect.run();

      expect(result).not.toBe(effect);
      result.getState().result.match({
        something: (result: Result<string>) => {
          result.match({
            data: (value: string) => expect(value).toBe("test"),
            error: () => expect(true).toBe(false), // Should not be called
          });
        },
        nothing: () => expect(true).toBe(false), // Should not be called
      });
    });
  });
});
