# Effect

The `Effect` class provides a powerful abstraction for handling asynchronous operations with built-in state management. It's designed to handle both synchronous and asynchronous operations while maintaining a consistent state interface that includes loading states, results, and error handling.

## Overview

An `Effect` represents a computation that may be synchronous or asynchronous, and maintains state about:

- Whether the computation is currently running (loading state)
- The result of the computation (if it has completed)
- Any errors that occurred during computation

## Key Features

- **State Management**: Tracks loading state and computation results
- **Immutable Updates**: Returns new instances for state changes
- **Subscription System**: Allows subscribing to state changes
- **Error Handling**: Built-in error handling through Result type
- **Type Safety**: Fully typed with TypeScript
- **Pattern Matching**: Provides pattern matching for different states

## Basic Usage

```typescript
// Create an effect
const effect = Effect.of(() => "hello world");

// Run the effect
const result = await effect.run();

// Access the state
const state = result.getState();
```

## State Management

An Effect maintains the following state:

```typescript
interface EffectState<T> {
  loading: Bool; // Whether the effect is currently running
  result: Maybe<Result<T>>; // The result of the computation, if any
}
```

## API Reference

### Creation

```typescript
// Create a new effect
Effect.of<T>(fn: () => T | Promise<T>): Effect<T>

// Create with initial state
new Effect<T>({
  fn: () => T | Promise<T>,
  result: Maybe<Result<T>>,
  loading: Bool
})
```

### Running Effects

```typescript
// Run the effect
effect.run(): Promise<Effect<T>>

// Check if effect has finished
effect.finished({
  true: () => void,
  false: () => void
})

// Check loading state
effect.loading({
  true: () => void,
  false: () => void
})
```

### State Access

```typescript
// Get current state
effect.getState(): EffectState<T>

// Get loading effect (available during run)
effect.getLoadingEffect(): Effect<T> | null

// Subscribe to state changes
effect.subscribe((state: EffectState<T>) => void): () => void
```

### Pattern Matching

```typescript
effect.match({
  data: (value: T) => R,
  error: (error: string) => R,
  loading: () => R,
  nothing: () => R
}): R
```

## Examples

### Basic Async Operation

```typescript
const effect = Effect.of(async () => {
  const response = await fetch("https://api.example.com/data");
  return response.json();
});

// Run and handle result
const result = await effect.run();
result.getState().result.match({
  something: (result) => {
    result.match({
      data: (value) => console.log("Success:", value),
      error: (error) => console.error("Error:", error),
    });
  },
  nothing: () => console.log("No result yet"),
});
```

### State Subscription

```typescript
const effect = Effect.of(() => "test");
const states: EffectState<string>[] = [];

// Subscribe to state changes
effect.subscribe((state) => states.push(state));

// Run the effect
await effect.run();

// states will contain:
// 1. Initial state (not loading, no result)
// 2. Loading state (loading, no result)
// 3. Final state (not loading, with result)
```

### Error Handling

```typescript
const effect = Effect.of(() => {
  throw new Error("Something went wrong");
});

const result = await effect.run();
result.match({
  data: () => console.log("Success"),
  error: (error) => console.error("Error:", error),
  loading: () => console.log("Loading"),
  nothing: () => console.log("Not started"),
});
```

## Best Practices

1. **Always handle errors**: Use the pattern matching API to handle all possible states
2. **Clean up subscriptions**: Store and call the unsubscribe function when no longer needed
3. **Use type parameters**: Always specify the type parameter for better type safety
4. **Prefer pattern matching**: Use the `match` API instead of direct state access when possible
5. **Handle loading states**: Consider the loading state in your UI to provide feedback to users

## Integration with Other Types

Effect works seamlessly with other types in the library:

- **Result**: Used to represent successful or failed computations
- **Maybe**: Used to represent optional results
- **Bool**: Used to represent loading state

## Notes

- Effects are immutable - running an effect returns a new instance
- The original effect's state remains unchanged after running
- Subscriptions receive all state transitions
- Effects can be nested and will be automatically flattened
