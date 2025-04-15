/**
 * Creates a deep clone of a value while preserving prototype chains and class instances.
 * Handles primitive values, plain objects, arrays, dates, and class instances.
 */
export const deepClone = (val) => {
    if (val === null || typeof val !== "object") {
        return val;
    }
    // Handle Date objects
    if (val instanceof Date) {
        return new Date(val.getTime());
    }
    // Handle Array objects
    if (Array.isArray(val)) {
        return val.map(item => deepClone(item));
    }
    // Handle class instances by getting their constructor
    const prototype = Object.getPrototypeOf(val);
    const constructor = prototype === null || prototype === void 0 ? void 0 : prototype.constructor;
    if (constructor && constructor !== Object) {
        const clonedInstance = new constructor();
        const entries = Object.entries(val);
        Object.assign(clonedInstance, Object.fromEntries(entries.map(([key, value]) => [key, deepClone(value)])));
        return clonedInstance;
    }
    // Handle plain objects
    const clonedObj = Object.create(prototype);
    const entries = Object.entries(val);
    for (const [key, value] of entries) {
        clonedObj[key] = deepClone(value);
    }
    return clonedObj;
};
//# sourceMappingURL=deepClone.js.map