"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maybe = void 0;
const nothing_1 = require("./nothing");
const Either_1 = require("../Either/Either");
const Bool_1 = require("../Bool/Bool");
const deepClone_1 = require("../utils/deepClone");
class Maybe {
    constructor(value) {
        this.something = this.map;
        this.value = Either_1.Either.fromFunction(() => {
            if (Maybe.isNothing(value)) {
                return Either_1.Either.right((0, deepClone_1.deepClone)(value));
            }
            return Either_1.Either.left((0, deepClone_1.deepClone)(value));
        });
    }
    static isNothing(value) {
        return value instanceof nothing_1.Nothing;
    }
    static nothing() {
        return Maybe.of(nothing_1.nothing);
    }
    static of(val) {
        if (val === null || val === undefined) {
            return Maybe.nothing();
        }
        if (Maybe.isMaybe(val)) {
            return val;
        }
        return new Maybe((0, deepClone_1.deepClone)(val));
    }
    static fromFunction(cb) {
        const value = cb(Maybe.of, Maybe.nothing);
        return Maybe.of((0, deepClone_1.deepClone)(value));
    }
    nothing(cb) {
        this.value.right(cb);
        return this;
    }
    map(cb) {
        return Maybe.fromFunction(() => {
            return this.value.match({
                left: (val) => {
                    const result = cb((0, deepClone_1.deepClone)(val));
                    return result;
                },
                right: () => {
                    return nothing_1.nothing;
                },
            });
        });
    }
    reduce(cb, starterThing) {
        return this.something((val) => {
            return cb((0, deepClone_1.deepClone)(starterThing), (0, deepClone_1.deepClone)(val));
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
            return (0, deepClone_1.deepClone)(val[property]);
        });
    }
    toEither() {
        return this.match({
            something: (val) => {
                return Either_1.Either.left((0, deepClone_1.deepClone)(val));
            },
            nothing: () => {
                return Either_1.Either.right((0, deepClone_1.deepClone)(null));
            },
        });
    }
    toBool() {
        return this.match({
            something: () => {
                return Bool_1.Bool.true();
            },
            nothing: () => {
                return Bool_1.Bool.false();
            },
        });
    }
}
exports.Maybe = Maybe;
Maybe.isMaybe = (arg) => {
    return arg instanceof Maybe;
};
//# sourceMappingURL=Maybe.js.map