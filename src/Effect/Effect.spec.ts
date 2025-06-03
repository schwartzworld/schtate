import { Effect, EffectState } from "./Effect.js";
import { Result } from "../Result/Result.js";
import { Maybe } from "../Maybe/Maybe.js";
import { Bool } from "../Bool/Bool.js";

describe("Effect", () => {
  describe("constructor", () => {
    it("should create an effect with default state", () => {
      expect.assertions(2);
      const effect = Effect.of(() => "test");
      const state = effect.getState();

      expect(state.loading).toEqual(Bool.false());
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
        loading: Bool.true(),
      });

      const state = effect.getState();
      expect(state.loading).toEqual(Bool.true());
      expect(state.result).toBe(maybeResult);
    });
  });

  describe("subscription", () => {
    it("should notify subscribers of initial state", () => {
      expect.assertions(3);
      const effect = Effect.of(() => "test");
      const states: EffectState<string>[] = [];

      effect.subscribe((state) => states.push(state));

      expect(states).toHaveLength(1);
      expect(states[0].loading).toEqual(Bool.false());
      states[0].result.match({
        something: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(true),
      });
    });

    it("should notify subscribers of state changes", async () => {
      expect.assertions(7);
      const effect = Effect.of(() => "test");
      const states: EffectState<string>[] = [];

      effect.subscribe((state) => states.push(state));

      const runPromise = effect.run();
      const result = await runPromise;

      // Should go through all states: initial -> loading -> final
      expect(states).toHaveLength(3);

      // Initial state
      expect(states[0].loading).toEqual(Bool.false());
      states[0].result.match({
        something: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(true),
      });

      // Loading state
      expect(states[1].loading).toEqual(Bool.true());
      states[1].result.match({
        something: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(true),
      });

      // Final state
      expect(states[2].loading).toEqual(Bool.false());
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

    it("should allow unsubscribing", async () => {
      expect.assertions(1);
      const effect = Effect.of(() => "test");
      const states: any[] = [];

      const unsubscribe = effect.subscribe((state) => states.push(state));
      unsubscribe();

      const runPromise = effect.run();
      await runPromise;

      expect(states).toHaveLength(1); // Only initial state
    });
  });

  describe("run", () => {
    it("should handle synchronous functions", async () => {
      expect.assertions(9);
      const effect = Effect.of(() => "test");
      const states: EffectState<string>[] = [];

      effect.subscribe((state) => states.push(state));

      const runPromise = effect.run();
      const result = await runPromise;
      const finalState = result.getState();

      expect(finalState.loading).toEqual(Bool.false());
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
      expect(states[0].loading).toEqual(Bool.false());
      states[0].result.match({
        something: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(true),
      });

      // Loading state
      expect(states[1].loading).toEqual(Bool.true());
      states[1].result.match({
        something: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(true),
      });

      // Final state
      expect(states[2].loading).toEqual(Bool.false());
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
      expect.assertions(4);
      const effect = Effect.of(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "test";
      });

      const states: EffectState<string>[] = [];
      effect.subscribe((state) => states.push(state));

      const runPromise = effect.run();
      const result = await runPromise;
      const finalState = result.getState();

      expect(finalState.loading).toEqual(Bool.false());
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
      expect(states[2].loading).toEqual(Bool.false());
    });

    it("should handle errors", async () => {
      expect.assertions(6);
      const error = new Error("test error");
      const effect = Effect.of<string>(() => {
        throw error;
      });

      const states: EffectState<string>[] = [];
      effect.subscribe((state) => states.push(state));

      const runPromise = effect.run();
      const result = await runPromise;
      const finalState = result.getState();

      // Should have gone through loading state and back
      expect(states).toHaveLength(3);
      expect(states[0].loading).toEqual(Bool.false());
      expect(states[1].loading).toEqual(Bool.true());
      expect(states[2].loading).toEqual(Bool.false());

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

      const states: EffectState<string>[] = [];
      effect.subscribe((state) => states.push(state));

      const runPromise = effect.run();
      const result = await runPromise;
      const finalState = result.getState();

      // Should be loading immediately
      expect(states).toHaveLength(3);
      expect(states[0].loading).toEqual(Bool.false());
      expect(states[1].loading).toEqual(Bool.true());
      expect(states[2].loading).toEqual(Bool.false());

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
      const runPromise = effect.run();
      const result = await runPromise;

      // Original effect should remain unchanged
      const currentState = effect.getState();
      expect(currentState).toEqual(initialState);

      // Returned effect should be a new instance with updated state
      expect(result).not.toBe(effect);
      const resultState = result.getState();
      expect(resultState.loading).toEqual(Bool.false());
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

      const runPromise = effect.run();
      await runPromise;

      // Original effect's state should be unchanged
      const currentState = effect.getState();
      expect(currentState.loading).toEqual(originalState.loading);

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
      const runPromise = effect.run();
      const result = await runPromise;

      expect(result).not.toBe(effect);
      const resultState = result.getState();
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

    it("should let you branch based on whether the effect has run already or not", async () => {
      const effect = Effect.of(() => "test");
      let result = "";
      effect.finished({
        true: () => (result = "true"),
        false: () => (result = "false"),
      });
      expect(result).toBe("false");
      const runPromise = effect.run();
      const finishedEffect = await runPromise;
      finishedEffect.finished({
        true: () => (result = "true"),
        false: () => (result = "false"),
      });
      expect(result).toBe("true");
    });

    it("should let you branch based on loading state", async () => {
      const effect = Effect.of(() => "test");
      let result = "";

      // Initial state - not loading
      effect.loading({
        true: () => (result = "loading"),
        false: () => (result = "not loading"),
      });
      expect(result).toBe("not loading");

      // Start running - should be loading
      const runPromise = effect.run();
      const loadingEffect = effect.getLoadingEffect();
      if (!loadingEffect) {
        throw new Error("Loading effect should be available during run");
      }
      loadingEffect.loading({
        true: () => (result = "loading"),
        false: () => (result = "not loading"),
      });
      expect(result).toBe("loading");

      // After running - not loading
      const finishedEffect = await runPromise;
      finishedEffect.loading({
        true: () => (result = "loading"),
        false: () => (result = "not loading"),
      });
      expect(result).toBe("not loading");
    });
  });

  describe("of", () => {
    it("should flatten nested Effects", async () => {
      expect.assertions(2);
      const innerEffect = Effect.of(() => "test");
      const outerEffect = Effect.of(() => innerEffect);

      // Verify it's a single Effect
      expect(outerEffect).toBeInstanceOf(Effect);

      // Run it and verify the result
      const result = await outerEffect.run();
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

  describe("match", () => {
    it("handles loading state", async () => {
      const effect = Effect.of(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return "success";
      });

      // Start running the effect
      const runPromise = effect.run();

      // Get the loading effect instance
      const loadingEffect = effect.getLoadingEffect();
      if (!loadingEffect) {
        throw new Error("Loading effect should be available during run");
      }

      // Check loading state while it's running
      const loadingResult = loadingEffect.match({
        data: () => "should not be called",
        error: () => "should not be called",
        loading: () => "loading",
        nothing: () => "should not be called",
      });

      expect(loadingResult).toBe("loading");

      // Wait for effect to complete
      await runPromise;
    });

    it("handles successful data state", async () => {
      const effect = Effect.of(() => "success");
      const finishedEffect = await effect.run();

      const result = finishedEffect.match({
        data: (value) => value,
        error: () => "should not be called",
        loading: () => "should not be called",
        nothing: () => "should not be called",
      });

      expect(result).toBe("success");
    });

    it("handles error state", async () => {
      const effect = Effect.of(() => {
        throw new Error("test error");
      });
      const finishedEffect = await effect.run();

      const result = finishedEffect.match({
        data: () => "should not be called",
        error: (error) => error,
        loading: () => "should not be called",
        nothing: () => "should not be called",
      });

      expect(result).toBe("test error");
    });

    it("handles nothing state", () => {
      const effect = Effect.of(() => "success");
      // Don't run the effect, so it stays in nothing state

      const result = effect.match({
        data: () => "should not be called",
        error: () => "should not be called",
        loading: () => "should not be called",
        nothing: () => "nothing",
      });

      expect(result).toBe("nothing");
    });

    it("transitions through states correctly", async () => {
      const effect = Effect.of(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return "success";
      });

      // Check initial nothing state
      const nothingResult = effect.match({
        data: () => "should not be called",
        error: () => "should not be called",
        loading: () => "should not be called",
        nothing: () => "nothing",
      });
      expect(nothingResult).toBe("nothing");

      // Start running and check loading state
      const runPromise = effect.run();
      const loadingEffect = effect.getLoadingEffect();
      if (!loadingEffect) {
        throw new Error("Loading effect should be available during run");
      }
      const loadingResult = loadingEffect.match({
        data: () => "should not be called",
        error: () => "should not be called",
        loading: () => "loading",
        nothing: () => "should not be called",
      });
      expect(loadingResult).toBe("loading");

      // Wait for completion and check success state
      const finishedEffect = await runPromise;
      const successResult = finishedEffect.match({
        data: (value) => value,
        error: () => "should not be called",
        loading: () => "should not be called",
        nothing: () => "should not be called",
      });
      expect(successResult).toBe("success");
    });
  });
});
