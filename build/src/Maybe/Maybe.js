"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maybe = void 0;
const nothing_1 = require("./nothing");
const Either_1 = require("../Either/Either");
class Maybe {
    constructor(value) {
        this.something = this.map;
        this.value = Either_1.Either.fromFunction(() => {
            if (Maybe.isNothing(value)) {
                return Either_1.Either.right(value);
            }
            return Either_1.Either.left(value);
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
        return new Maybe(val);
    }
    static fromFunction(cb) {
        const value = cb(Maybe.of, Maybe.nothing);
        return Maybe.of(value);
    }
    nothing(cb) {
        this.value.right(cb);
        return this;
    }
    map(cb) {
        return Maybe.fromFunction(() => {
            return this.value.match({
                left: (val) => {
                    const result = cb(val);
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
            return cb(starterThing, val);
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
            return val[property];
        });
    }
}
exports.Maybe = Maybe;
Maybe.isMaybe = (arg) => {
    return arg instanceof Maybe;
};
