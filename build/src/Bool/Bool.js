"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bool = void 0;
const Either_1 = require("../Either/Either");
const Maybe_1 = require("../Maybe/Maybe");
class Bool {
    constructor(value) {
        this.value = value;
    }
    static of(arg) {
        if (arg === false || arg === undefined || arg === null) {
            return Bool.false();
        }
        return Bool.true();
    }
    static fromFn(cb) {
        return Bool.of(cb());
    }
    static false() {
        return new Bool(false);
    }
    static true() {
        return new Bool(true);
    }
    map(cb) {
        const v = cb(this.value);
        return Bool.of(v);
    }
    and(value) {
        return this.map((v) => {
            return Boolean(value) && v;
        });
    }
    or(value) {
        return this.map((v) => {
            return Boolean(value) || v;
        });
    }
    true(cb) {
        if (this.value) {
            cb();
        }
        return this;
    }
    false(cb) {
        if (!this.value) {
            cb();
        }
        return this;
    }
    match({ true: trueCB, false: falseCB, }) {
        if (!this.value) {
            return falseCB();
        }
        return trueCB();
    }
    toEither() {
        return this.match({
            true: () => {
                return Either_1.Either.left(true);
            },
            false: () => {
                return Either_1.Either.right(false);
            },
        });
    }
    toMaybe() {
        return this.match({
            true: () => {
                return Maybe_1.Maybe.of(true);
            },
            false: () => {
                return Maybe_1.Maybe.nothing();
            },
        });
    }
}
exports.Bool = Bool;
