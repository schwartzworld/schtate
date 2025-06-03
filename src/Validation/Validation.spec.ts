import { jest, expect, describe, it } from "@jest/globals";
import { Validation } from "./Validation.js";

describe("Validation", () => {
  describe("single field validation", () => {
    it("should validate a single field successfully", () => {
      const nameValidation = Validation.validateField("name", "John", [
        (value) =>
          value.length < 2 ? "Name must be at least 2 characters" : null,
        (value) =>
          value.length > 50 ? "Name must be at most 50 characters" : null,
      ]);

      nameValidation.match({
        success: (value) => expect(value).toBe("John"),
        failure: () => fail("Should not have failed"),
      });
    });

    it("should collect all validation errors for a field", () => {
      const nameValidation = Validation.validateField("name", "", [
        (value) =>
          value.length < 2 ? "Name must be at least 2 characters" : null,
        (value) => (/[0-9]/.test(value) ? "Name cannot contain numbers" : null),
      ]);

      nameValidation.match({
        success: () => fail("Should not have succeeded"),
        failure: (errors) => {
          expect(errors).toHaveLength(1);
          expect(errors[0]).toEqual({
            field: "name",
            message: "Name must be at least 2 characters",
          });
        },
      });
    });
  });

  describe("combining validations", () => {
    type FormData = {
      name: string;
      age: number;
    };

    it("should combine multiple successful validations", () => {
      const nameValidation = Validation.validateField<string>("name", "John", [
        (value) =>
          value.length < 2 ? "Name must be at least 2 characters" : null,
      ]);

      const ageValidation = Validation.validateField<number>("age", 25, [
        (value) => (value < 18 ? "Must be at least 18 years old" : null),
      ]);

      const combined = Validation.combine<[string, number]>([
        nameValidation,
        ageValidation,
      ]);

      combined.match({
        success: ([name, age]) => {
          expect(name).toBe("John");
          expect(age).toBe(25);
        },
        failure: () => fail("Should not have failed"),
      });
    });

    it("should collect all errors when combining validations", () => {
      const nameValidation = Validation.validateField<string>("name", "", [
        (value) =>
          value.length < 2 ? "Name must be at least 2 characters" : null,
      ]);

      const ageValidation = Validation.validateField<number>("age", 15, [
        (value) => (value < 18 ? "Must be at least 18 years old" : null),
      ]);

      const combined = Validation.combine<[string, number]>([
        nameValidation,
        ageValidation,
      ]);

      combined.match({
        success: () => fail("Should not have succeeded"),
        failure: (errors) => {
          expect(errors).toHaveLength(2);
          expect(errors).toContainEqual({
            field: "name",
            message: "Name must be at least 2 characters",
          });
          expect(errors).toContainEqual({
            field: "age",
            message: "Must be at least 18 years old",
          });
        },
      });
    });
  });

  describe("applicative validation", () => {
    it("should apply a function to a successful validation", () => {
      const nameValidation = Validation.success("John");
      const fnValidation = Validation.success<(name: string) => string>(
        (name) => name.toUpperCase()
      );

      const result = nameValidation.ap(fnValidation);

      result.match({
        success: (value) => expect(value).toBe("JOHN"),
        failure: () => fail("Should not have failed"),
      });
    });

    it("should combine errors when applying to failed validations", () => {
      const nameValidation = Validation.failure<string>([
        { field: "name", message: "Name is required" },
      ]);
      const fnValidation = Validation.failure<(name: string) => string>([
        { field: "transform", message: "Invalid transformation" },
      ]);

      const result = nameValidation.ap(fnValidation);

      result.match({
        success: () => fail("Should not have succeeded"),
        failure: (errors) => {
          expect(errors).toHaveLength(2);
          expect(errors).toContainEqual({
            field: "name",
            message: "Name is required",
          });
          expect(errors).toContainEqual({
            field: "transform",
            message: "Invalid transformation",
          });
        },
      });
    });
  });
});
