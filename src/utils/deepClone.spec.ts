import { deepClone } from "./deepClone";

describe("deepClone", () => {
  class TestPerson {
    constructor(public name: string) {}
    greet() {
      return `Hello, ${this.name}!`;
    }
  }

  it("should handle primitive values", () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone("test")).toBe("test");
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  it("should handle Date objects", () => {
    const date = new Date("2024-03-06");
    const cloned = deepClone(date);

    expect(cloned).toBeInstanceOf(Date);
    expect(cloned.getTime()).toBe(date.getTime());
    expect(cloned).not.toBe(date); // Should be a different instance
  });

  it("should handle Arrays and preserve their contents", () => {
    const array = [1, { name: "test" }, new Date("2024-03-06")];
    const cloned = deepClone(array);

    expect(cloned).toBeInstanceOf(Array);
    expect(cloned).toEqual(array);
    expect(cloned).not.toBe(array);
    expect(cloned[1]).not.toBe(array[1]); // Nested objects should be cloned
  });

  it("should preserve class instances and their prototype chain", () => {
    const original = new TestPerson("Alice");
    const cloned = deepClone(original);

    expect(cloned instanceof TestPerson).toBe(true);
    expect(cloned.greet()).toBe("Hello, Alice!");
    expect(Object.getPrototypeOf(cloned)).toBe(TestPerson.prototype);
    expect(cloned).not.toBe(original);
  });

  it("should handle nested objects and preserve their structure", () => {
    const original = {
      name: "test",
      nested: {
        date: new Date("2024-03-06"),
        person: new TestPerson("Bob"),
        array: [1, 2, { x: 3 }],
      },
    };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.nested).not.toBe(original.nested);
    expect(cloned.nested.person instanceof TestPerson).toBe(true);
    expect(cloned.nested.date instanceof Date).toBe(true);
  });
});
