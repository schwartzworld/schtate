# Validation

The `Validation` type is a powerful monad for handling validation scenarios where you need to accumulate multiple errors rather than failing on the first error. This is particularly useful for form validation, data validation, and other scenarios where you want to show all validation errors at once.

## Features

- Accumulates multiple validation errors
- Type-safe error handling with heterogeneous validation types
- Applicative functor support for combining validations
- Built on top of the `Either` monad
- Immutable data structures

## Basic Usage

```typescript
import { Validation } from './Validation';

// Simple field validation
const nameValidation = Validation.validateField(
  "name",
  "John",
  [
    value => value.length < 2 ? "Name must be at least 2 characters" : null,
    value => value.length > 50 ? "Name must be at most 50 characters" : null,
  ]
);

// Pattern matching on the result
nameValidation.match({
  success: value => console.log(`Valid name: ${value}`),
  failure: errors => console.log(`Validation errors: ${errors.map(e => e.message).join(", ")}`)
});
```

## Combining Multiple Validations

The `Validation` type shines when you need to validate multiple fields and collect all errors. It supports type-safe combinations of different validation types using tuples:

```typescript
// Validations of different types
const nameValidation = Validation.validateField<string>(
  "name",
  "John",
  [value => value.length < 2 ? "Name too short" : null]
);

const ageValidation = Validation.validateField<number>(
  "age",
  25,
  [value => value < 18 ? "Must be at least 18" : null]
);

// Combine with type-safe tuple
const combined = Validation.combine<[string, number]>([nameValidation, ageValidation]);

// Type-safe access to values
combined.match({
  success: ([name, age]) => console.log(`Valid form: ${name} (${age} years old)`),
  failure: errors => console.log(`Form errors: ${errors.map(e => `${e.field}: ${e.message}`).join(", ")}`)
});
```

## Type System

### Validation Types

The `Validation<T>` type is generic over its success type. The error type is always `ValidationError[]`. When combining validations, you can specify the exact types you expect:

```typescript
// Single type validation
const nameValidation: Validation<string>;
const ageValidation: Validation<number>;

// Combined validation with tuple type
const combined: Validation<[string, number]>;

// Object validation
type User = {
  name: string;
  age: number;
};

const userValidation: Validation<User>;
```

### Combining Heterogeneous Types

The `combine` method uses TypeScript's tuple types to maintain type safety when combining validations of different types:

```typescript
static combine<T extends unknown[]>(
  validations: { [K in keyof T]: Validation<T[K]> }
): Validation<T>
```

This allows you to:
- Combine validations of different types
- Maintain type information for each validation
- Access combined values with proper typing
- Get compile-time errors for type mismatches

## Applicative Validation

The `Validation` type supports applicative functor operations, allowing you to combine validations in a more functional way:

```typescript
// Validation that holds a function
const fnValidation = Validation.success((name: string) => name.toUpperCase());
const nameValidation = Validation.success("john");

// Apply the function to the value, collecting any errors along the way
const result = nameValidation.ap(fnValidation);

// Type-safe result handling
result.match({
  success: value => console.log(value), // Type is string
  failure: errors => console.log(errors) // Type is ValidationError[]
});
```

## API Reference

### Static Methods

- `success<T>(value: T): Validation<T>` - Creates a successful validation
- `failure<T>(errors: ValidationError[]): Validation<T>` - Creates a failed validation
- `combine<T extends unknown[]>(validations: { [K in keyof T]: Validation<T[K]> }): Validation<T>` - Combines multiple validations with type safety
- `validateField<T>(field: string, value: T, validators: Array<(value: T) => string | null>): Validation<T>` - Validates a single field with multiple validators

### Instance Methods

- `map<U>(fn: (value: T) => U): Validation<U>` - Transforms the success value
- `mapError(fn: (errors: ValidationError[]) => ValidationError[]): Validation<T>` - Transforms validation errors
- `match<U, V>({ success, failure })` - Pattern matches on the validation result
- `ap<U>(other: Validation<(value: T) => U>): Validation<U>` - Applies a function in a validation context

### Types

```typescript
type ValidationError = {
  field: string;
  message: string;
};
```

## Examples

### Form Validation with Type Safety

```typescript
// Define your form shape
type LoginForm = {
  email: string;
  password: string;
};

// Create strongly-typed validators
const validateEmail = (email: string) => 
  !email.includes("@") ? "Invalid email format" : null;

const validatePassword = (password: string) => 
  password.length < 8 ? "Password must be at least 8 characters" : null;

// Create validations
const emailValidation = Validation.validateField("email", form.email, [validateEmail]);
const passwordValidation = Validation.validateField("password", form.password, [validatePassword]);

// Combine with proper typing
const formValidation = Validation.combine<[string, string]>([emailValidation, passwordValidation]);

// Type-safe handling
formValidation.match({
  success: ([email, password]) => login({ email, password }),
  failure: errors => displayErrors(errors)
});
```

### Data Transformation with Validation

```typescript
const parseAge = (input: string): Validation<number> => {
  const age = parseInt(input);
  return isNaN(age)
    ? Validation.failure([{ field: "age", message: "Must be a number" }])
    : age < 0
    ? Validation.failure([{ field: "age", message: "Cannot be negative" }])
    : Validation.success(age);
};

const validateAge = (age: number): Validation<number> =>
  age < 18
    ? Validation.failure([{ field: "age", message: "Must be at least 18" }])
    : Validation.success(age);

// Chain validations with type safety
parseAge("20")
  .map(age => age + 1)
  .match({
    success: age => console.log(`Valid age: ${age}`), // Type is number
    failure: errors => console.log(`Invalid age: ${errors[0].message}`)
  });
```

## Implementation Details

The `Validation` type is implemented using the `Either` monad, where:
- The left type represents the success case (`T`)
- The right type represents the validation errors (`ValidationError[]`)

This implementation ensures type safety and provides a solid foundation for handling validation scenarios in a functional way. 