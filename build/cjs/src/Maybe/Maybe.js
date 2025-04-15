"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maybe = void 0;
const nothing_js_1 = require("./nothing.js");
const Either_js_1 = require("../Either/Either.js");
const Bool_js_1 = require("../Bool/Bool.js");
const deepClone_js_1 = require("../utils/deepClone.js");
class Maybe {
    constructor(value) {
        this.something = this.map;
        this.value = Either_js_1.Either.fromFunction(() => {
            if (Maybe.isNothing(value)) {
                return Either_js_1.Either.right((0, deepClone_js_1.deepClone)(value));
            }
            return Either_js_1.Either.left((0, deepClone_js_1.deepClone)(value));
        });
    }
    static isNothing(value) {
        return value instanceof nothing_js_1.Nothing;
    }
    static nothing() {
        return Maybe.of(nothing_js_1.nothing);
    }
    static of(val) {
        if (val === null || val === undefined) {
            return Maybe.nothing();
        }
        if (Maybe.isMaybe(val)) {
            return val;
        }
        return new Maybe((0, deepClone_js_1.deepClone)(val));
    }
    static fromFunction(cb) {
        const value = cb(Maybe.of, Maybe.nothing);
        return Maybe.of((0, deepClone_js_1.deepClone)(value));
    }
    nothing(cb) {
        this.value.right(cb);
        return this;
    }
    map(cb) {
        return Maybe.fromFunction(() => {
            return this.value.match({
                left: (val) => {
                    const result = cb((0, deepClone_js_1.deepClone)(val));
                    return result;
                },
                right: () => {
                    return nothing_js_1.nothing;
                },
            });
        });
    }
    reduce(cb, starterThing) {
        return this.something((val) => {
            return cb((0, deepClone_js_1.deepClone)(starterThing), (0, deepClone_js_1.deepClone)(val));
        });
    }
    match({ something: somethingCB, nothing: nothingCB, }) {
        return this.value.match({
            left: somethingCB,
            right: nothingCB,
        });
    }
    get(property) {
        return this.map((val) => {
            return (0, deepClone_js_1.deepClone)(val[property]);
        });
    }
    toEither() {
        return this.match({
            something: (val) => {
                return Either_js_1.Either.left((0, deepClone_js_1.deepClone)(val));
            },
            nothing: () => {
                return Either_js_1.Either.right((0, deepClone_js_1.deepClone)(null));
            },
        });
    }
    toBool() {
        return this.match({
            something: () => {
                return Bool_js_1.Bool.true();
            },
            nothing: () => {
                return Bool_js_1.Bool.false();
            },
        });
    }
}
exports.Maybe = Maybe;
Maybe.isMaybe = (arg) => {
    return arg instanceof Maybe;
};
//# sourceMappingURL=Maybe.js.map