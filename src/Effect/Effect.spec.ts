import { Effect } from "./Effect.js";
import { Result } from "../Result/Result.js";
import { Maybe } from "../Maybe/Maybe.js";
import { Bool } from "../Bool/Bool.js";

describe("Effect", () => {
  describe("constructor", () => {
    it("should create an effect with default state", () => {
      expect.assertions(2);
      const effect = Effect.of(() => "test");

      effect.loading({
        true: () => expect(true).toBe(false), // Should not be called
        false: () => expect(true).toBe(true),
      });

      effect.match({
        data: () => expect(true).toBe(false), // Should not be called
        error: () => expect(true).toBe(false), // Should not be called
        loading: () => expect(true).toBe(false), // Should not be called
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

      effect.loading({
        true: () => expect(true).toBe(true),
        false: () => expect(true).toBe(false), // Should not be called
      });

      effect.match({
        data: () => expect(true).toBe(false), // Should not be called
        error: () => expect(true).toBe(false), // Should not be called
        loading: () => expect(true).toBe(true), // Should be called since loading is true
        nothing: () => expect(true).toBe(false), // Should not be called
      });
    });
  });

  describe("subscription", () => {
    it("should notify subscribers of initial state", () => {
      expect.assertions(2);
      const effect = Effect.of(() => "test");
      let loadingState = false;
      let matchState = "";

      effect.subscribe((state) => {
        state.loading.match({
          true: () => (loadingState = true),
          false: () => (loadingState = false),
        });
        state.result.match({
          something: () => (matchState = "something"),
          nothing: () => (matchState = "nothing"),
        });
      });

      expect(loadingState).toBe(false);
      expect(matchState).toBe("nothing");
    });

    it("should notify subscribers of state changes", async () => {
      expect.assertions(8);
      const effect = Effect.of(() => "test");
      const states: { loading: boolean; matchState: string }[] = [];

      effect.subscribe((state) => {
        let loadingState = false;
        let matchState = "";
        state.loading.match({
          true: () => (loadingState = true),
          false: () => (loadingState = false),
        });
        state.result.match({
          something: (result) => {
            result.match({
              data: () => (matchState = "data"),
              error: () => (matchState = "error"),
            });
          },
          nothing: () => (matchState = "nothing"),
        });
        states.push({ loading: loadingState, matchState });
      });

      const runPromise = effect.run();
      const result = await runPromise;

      // Should go through all states: initial -> loading -> final
      expect(states).toHaveLength(3);

      // Initial state
      expect(states[0].loading).toBe(false);
      expect(states[0].matchState).toBe("nothing");

      // Loading state
      expect(states[1].loading).toBe(true);
      expect(states[1].matchState).toBe("nothing");

      // Final state
      expect(states[2].loading).toBe(false);
      expect(states[2].matchState).toBe("data");

      // Verify final effect state
      result.match({
        data: (value) => expect(value).toBe("test"),
        error: () => expect(true).toBe(false), // Should not be called
        loading: () => expect(true).toBe(false), // Should not be called
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
      expect.assertions(8);
      const effect = Effect.of(() => "test");
      const states: { loading: boolean; matchState: string }[] = [];

      effect.subscribe((state) => {
        let loadingState = false;
        let matchState = "";
        state.loading.match({
          true: () => (loadingState = true),
          false: () => (loadingState = false),
        });
        state.result.match({
          something: (result) => {
            result.match({
              data: () => (matchState = "data"),
              error: () => (matchState = "error"),
            });
          },
          nothing: () => (matchState = "nothing"),
        });
        states.push({ loading: loadingState, matchState });
      });

      const runPromise = effect.run();
      const result = await runPromise;

      // Should go through all states: initial -> loading -> final
      expect(states).toHaveLength(3);

      // Initial state
      expect(states[0].loading).toBe(false);
      expect(states[0].matchState).toBe("nothing");

      // Loading state
      expect(states[1].loading).toBe(true);
      expect(states[1].matchState).toBe("nothing");

      // Final state
      expect(states[2].loading).toBe(false);
      expect(states[2].matchState).toBe("data");

      // Verify final effect state
      result.match({
        data: (value) => expect(value).toBe("test"),
        error: () => expect(true).toBe(false), // Should not be called
        loading: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(false), // Should not be called
      });
    });

    it("should handle asynchronous functions", async () => {
      expect.assertions(3);
      const effect = Effect.of(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "test";
      });

      const states: { loading: boolean; matchState: string }[] = [];
      effect.subscribe((state) => {
        let loadingState = false;
        let matchState = "";
        state.loading.match({
          true: () => (loadingState = true),
          false: () => (loadingState = false),
        });
        state.result.match({
          something: (result) => {
            result.match({
              data: () => (matchState = "data"),
              error: () => (matchState = "error"),
            });
          },
          nothing: () => (matchState = "nothing"),
        });
        states.push({ loading: loadingState, matchState });
      });

      const runPromise = effect.run();
      const result = await runPromise;

      // Should go through all states: initial -> loading -> final
      expect(states).toHaveLength(3);
      expect(states[2].loading).toBe(false);

      // Verify final effect state
      result.match({
        data: (value) => expect(value).toBe("test"),
        error: () => expect(true).toBe(false), // Should not be called
        loading: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(false), // Should not be called
      });
    });

    it("should handle errors", async () => {
      expect.assertions(5);
      const error = new Error("test error");
      const effect = Effect.of<string>(() => {
        throw error;
      });

      const states: { loading: boolean; matchState: string }[] = [];
      effect.subscribe((state) => {
        let loadingState = false;
        let matchState = "";
        state.loading.match({
          true: () => (loadingState = true),
          false: () => (loadingState = false),
        });
        state.result.match({
          something: (result) => {
            result.match({
              data: () => (matchState = "data"),
              error: () => (matchState = "error"),
            });
          },
          nothing: () => (matchState = "nothing"),
        });
        states.push({ loading: loadingState, matchState });
      });

      const runPromise = effect.run();
      const result = await runPromise;

      // Should go through all states: initial -> loading -> final
      expect(states).toHaveLength(3);
      expect(states[0].loading).toBe(false);
      expect(states[1].loading).toBe(true);
      expect(states[2].loading).toBe(false);

      // Verify final effect state
      result.match({
        data: () => expect(true).toBe(false), // Should not be called
        error: (err) => expect(err).toBe(error.message),
        loading: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(false), // Should not be called
      });
    });

    it("should handle async errors", async () => {
      expect.assertions(5);
      const error = new Error("test error");
      const effect = Effect.of<string>(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        throw error;
      });

      const states: { loading: boolean; matchState: string }[] = [];
      effect.subscribe((state) => {
        let loadingState = false;
        let matchState = "";
        state.loading.match({
          true: () => (loadingState = true),
          false: () => (loadingState = false),
        });
        state.result.match({
          something: (result) => {
            result.match({
              data: () => (matchState = "data"),
              error: () => (matchState = "error"),
            });
          },
          nothing: () => (matchState = "nothing"),
        });
        states.push({ loading: loadingState, matchState });
      });

      const runPromise = effect.run();
      const result = await runPromise;

      // Should go through all states: initial -> loading -> final
      expect(states).toHaveLength(3);
      expect(states[0].loading).toBe(false);
      expect(states[1].loading).toBe(true);
      expect(states[2].loading).toBe(false);

      // Verify final effect state
      result.match({
        data: () => expect(true).toBe(false), // Should not be called
        error: (err) => expect(err).toBe(error.message),
        loading: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(false), // Should not be called
      });
    });
  });

  describe("immutability", () => {
    it("should update original effect state during run but return new instance", async () => {
      expect.assertions(4);
      const effect = Effect.of(() => "test");
      let initialLoading = false;
      let initialMatchState = "";

      effect.loading({
        true: () => (initialLoading = true),
        false: () => (initialLoading = false),
      });
      effect.match({
        data: () => (initialMatchState = "data"),
        error: () => (initialMatchState = "error"),
        loading: () => (initialMatchState = "loading"),
        nothing: () => (initialMatchState = "nothing"),
      });

      // Run the effect
      const runPromise = effect.run();
      const result = await runPromise;

      // Original effect should remain unchanged
      let currentLoading = false;
      let currentMatchState = "";
      effect.loading({
        true: () => (currentLoading = true),
        false: () => (currentLoading = false),
      });
      effect.match({
        data: () => (currentMatchState = "data"),
        error: () => (currentMatchState = "error"),
        loading: () => (currentMatchState = "loading"),
        nothing: () => (currentMatchState = "nothing"),
      });

      expect(currentLoading).toBe(initialLoading);
      expect(currentMatchState).toBe(initialMatchState);

      // Returned effect should be a new instance with updated state
      expect(result).not.toBe(effect);
      result.match({
        data: (value) => expect(value).toBe("test"),
        error: () => expect(true).toBe(false), // Should not be called
        loading: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(false), // Should not be called
      });
    });

    it("should not mutate original effect when running", async () => {
      expect.assertions(2);
      const effect = Effect.of(() => "test");
      let initialLoading = false;
      let initialMatchState = "";

      effect.loading({
        true: () => (initialLoading = true),
        false: () => (initialLoading = false),
      });
      effect.match({
        data: () => (initialMatchState = "data"),
        error: () => (initialMatchState = "error"),
        loading: () => (initialMatchState = "loading"),
        nothing: () => (initialMatchState = "nothing"),
      });

      const runPromise = effect.run();
      await runPromise;

      // Original effect's state should be unchanged
      let currentLoading = false;
      let currentMatchState = "";
      effect.loading({
        true: () => (currentLoading = true),
        false: () => (currentLoading = false),
      });
      effect.match({
        data: () => (currentMatchState = "data"),
        error: () => (currentMatchState = "error"),
        loading: () => (currentMatchState = "loading"),
        nothing: () => (currentMatchState = "nothing"),
      });

      expect(currentLoading).toBe(initialLoading);
      expect(currentMatchState).toBe(initialMatchState);
    });

    it("should return new effect instance after running", async () => {
      expect.assertions(2);
      const effect = Effect.of(() => "test");
      const runPromise = effect.run();
      const result = await runPromise;

      expect(result).not.toBe(effect);
      result.match({
        data: (value) => expect(value).toBe("test"),
        error: () => expect(true).toBe(false), // Should not be called
        loading: () => expect(true).toBe(false), // Should not be called
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
      const effect = Effect.of(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "test";
      });
      let result = "";

      // Initial state - not loading
      effect.loading({
        true: () => (result = "loading"),
        false: () => (result = "not loading"),
      });
      expect(result).toBe("not loading");

      // Track state changes BEFORE starting the effect
      const states: { loading: boolean }[] = [];
      effect.subscribe((state) => {
        state.loading.match({
          true: () => states.push({ loading: true }),
          false: () => states.push({ loading: false }),
        });
      });

      // Now start running the effect
      const runPromise = effect.run();

      // Wait for the effect to complete
      await runPromise;

      // Verify state transitions
      expect(states).toHaveLength(3); // initial -> loading -> final
      expect(states[0].loading).toBe(false); // initial state
      expect(states[1].loading).toBe(true); // loading state
      expect(states[2].loading).toBe(false); // final state

      // Verify final state
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
      result.match({
        data: (value) => expect(value).toBe("test"),
        error: () => expect(true).toBe(false), // Should not be called
        loading: () => expect(true).toBe(false), // Should not be called
        nothing: () => expect(true).toBe(false), // Should not be called
      });
    });
  });

  describe("match", () => {
    it("handles loading state", async () => {
      // Create an effect that's already in a loading state
      const effect = new Effect<string>({
        fn: async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return "success";
        },
        result: Maybe.nothing<Result<string>>(),
        loading: Bool.true(),
      });

      // Verify it's in loading state
      const loadingResult = effect.match({
        data: () => "should not be called",
        error: () => "should not be called",
        loading: () => "loading",
        nothing: () => "should not be called",
      });

      expect(loadingResult).toBe("loading");

      // Run the effect to completion to clean up
      await effect.run();
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
      // Create an effect that's already in a loading state
      const effect = new Effect<string>({
        fn: async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return "success";
        },
        result: Maybe.nothing<Result<string>>(),
        loading: Bool.true(),
      });

      // Check loading state
      const loadingResult = effect.match({
        data: () => "should not be called",
        error: () => "should not be called",
        loading: () => "loading",
        nothing: () => "should not be called",
      });
      expect(loadingResult).toBe("loading");

      // Run the effect to completion
      const finishedEffect = await effect.run();

      // Check success state
      const successResult = finishedEffect.match({
        data: (value) => value,
        error: () => "should not be called",
        loading: () => "should not be called",
        nothing: () => "should not be called",
      });
      expect(successResult).toBe("success");

      // Create a new effect to check nothing state
      const newEffect = Effect.of(() => "test");
      const nothingResult = newEffect.match({
        data: () => "should not be called",
        error: () => "should not be called",
        loading: () => "should not be called",
        nothing: () => "nothing",
      });
      expect(nothingResult).toBe("nothing");
    });
  });
});
