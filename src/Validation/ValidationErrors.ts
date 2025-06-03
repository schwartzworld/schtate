export type ValidationError = {
  field: string;
  message: string;
};

export class ValidationErrors {
  constructor(public readonly errors: ValidationError[]) {}
  isValidationErrors = true;
}

export const createValidationErrors = (errors: ValidationError[]) =>
  new ValidationErrors(errors);
