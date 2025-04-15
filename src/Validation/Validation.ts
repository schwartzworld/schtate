import { Either } from "../Either/Either";
import { Mappable } from "../types/Mappable";
import { deepClone } from "../utils/deepClone";
import { ValidationError, ValidationErrors, createValidationErrors } from "./ValidationErrors";

export class Validation<T> implements Mappable<T> {
  private value: Either<T, ValidationErrors>;

  private constructor(value: Either<T, ValidationErrors>) {
    this.value = value;
  }

  static isValidation(val: unknown): val is Validation<unknown> {
    return val instanceof Validation;
  }

  static success<T>(value: T): Validation<T> {
    return new Validation(Either.left(deepClone(value)));
  }

  static failure<T>(errors: ValidationError[]): Validation<T> {
    return new Validation(Either.right(createValidationErrors(errors)));
  }

  static combine<T extends unknown[]>(
    validations: { [K in keyof T]: Validation<T[K]> }
  ): Validation<T> {
    const allErrors: ValidationError[] = [];
    const values: unknown[] = [];

    validations.forEach((validation) => {
      validation.match({
        success: (value) => values.push(value),
        failure: (errors) => allErrors.push(...errors),
      });
    });

    return allErrors.length === 0
      ? Validation.success(values as T)
      : Validation.failure(allErrors);
  }

  map<U>(fn: (value: T) => U): Validation<U> {
    return new Validation(
      this.value.map({
        left: (val) => fn(deepClone(val)),
        right: (errors) => errors,
      })
    );
  }

  mapError(fn: (errors: ValidationError[]) => ValidationError[]): Validation<T> {
    return new Validation(
      this.value.map({
        left: (val) => val,
        right: (errors) => createValidationErrors(fn(deepClone(errors.errors))),
      })
    );
  }

  match<U, V>(pattern: {
    success: (value: T) => U;
    failure: (errors: ValidationError[]) => V;
  }): U | V {
    return this.value.match({
      left: pattern.success,
      right: (errors) => pattern.failure(errors.errors),
    });
  }

  /**
   * Applicative functionality for combining validations
   * @param other - The validation to combine with
   * @returns A new validation that is the result of applying the function to the value
   */
  ap<U>(other: Validation<(value: T) => U>): Validation<U> {
    return this.match({
      success: (value) =>
        other.match({
          success: (fn) => Validation.success(fn(value)),
          failure: (errors) => Validation.failure(errors),
        }),
      failure: (errors) =>
        other.match({
          success: () => Validation.failure(errors),
          failure: (otherErrors) => Validation.failure([...errors, ...otherErrors]),
        }),
    });
  }

  // Helper for form validation
  static validateField<T>(
    field: string,
    value: T,
    validators: Array<(value: T) => string | null>
  ): Validation<T> {
    const errors = validators
      .map((validator) => validator(value))
      .filter((error): error is string => error !== null)
      .map((message) => ({ field, message }));

    return errors.length === 0
      ? Validation.success(value)
      : Validation.failure(errors);
  }
} 