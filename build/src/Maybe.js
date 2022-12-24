"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maybe = void 0;
const nothing_1 = require("./nothing");
const Either_1 = require("./Either");
class Maybe {
    constructor(value) {
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
        const value = cb();
        return Maybe.of(value);
    }
    something(cb) {
        this.value.left((val) => cb(val));
        return this;
    }
    nothing(cb) {
        this.value.right(cb);
        return this;
    }
    map(cb) {
        return Maybe.fromFunction(() => {
            return this.value.match({
                left: (val) => {
                    return cb(val);
                },
                right: () => {
                    return nothing_1.nothing;
                },
            });
        });
    }
    reduce(cb, starterThing) {
        return Maybe.fromFunction(() => {
            return this.value.match({
                left: (val) => {
                    return cb(starterThing, val);
                },
                right: () => {
                    return nothing_1.nothing;
                },
            });
        });
    }
    match({ something: somethingCB, nothing: nothingCB, }) {
        return this.value.match({
            left: somethingCB,
            right: nothingCB,
        });
    }
}
exports.Maybe = Maybe;
Maybe.isMaybe = (arg) => {
    return arg instanceof Maybe;
};
