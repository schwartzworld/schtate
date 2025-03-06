"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Either = void 0;
const State_1 = require("../State/State");
const Maybe_1 = require("../Maybe/Maybe");
const deepClone_1 = require("../utils/deepClone");
class Either {
    constructor(value, whichSide) {
        this.value = value;
        this.whichSide = whichSide;
    }
    static of(val, whichSide) {
        if (State_1.State.isState(val)) {
            return new Either((0, deepClone_1.deepClone)(val), whichSide);
        }
        return new Either(State_1.State.of((0, deepClone_1.deepClone)(val)), whichSide);
    }
    static isEither(val) {
        return val instanceof Either;
    }
    static fromFunction(cb) {
        return cb(Either.left, Either.right);
    }
    static left(value) {
        return Either.of((0, deepClone_1.deepClone)(value), "left");
    }
    static right(value) {
        return Either.of((0, deepClone_1.deepClone)(value), "right");
    }
    isLeft(value) {
        if (this.whichSide === "right")
            return false;
        return this.whichSide === "left";
    }
    left(cb) {
        return this.map({
            left: (value) => {
                return cb((0, deepClone_1.deepClone)(value));
            },
            right: (v) => (0, deepClone_1.deepClone)(v),
        });
    }
    right(cb) {
        return this.map({
            left: (l) => {
                return (0, deepClone_1.deepClone)(l);
            },
            right: (value) => {
                return cb((0, deepClone_1.deepClone)(value));
            },
        });
    }
    map({ left: leftCb, right: rightCb, }) {
        if (this.isLeft(this.value)) {
            const mappedValue = this.value.map((val) => {
                return leftCb((0, deepClone_1.deepClone)(val));
            });
            return Either.left(mappedValue);
        }
        const mappedValue = this.value.map((val) => {
            return rightCb((0, deepClone_1.deepClone)(val));
        });
        return Either.right(mappedValue);
    }
    match({ left: leftCb, right: rightCb, }) {
        if (this.isLeft(this.value)) {
            return this.value.match(leftCb);
        }
        return this.value.match((r) => {
            return rightCb((0, deepClone_1.deepClone)(r));
        });
    }
    get(property) {
        return this.match({
            left: (left) => {
                const l = left[property];
                return Maybe_1.Maybe.of((0, deepClone_1.deepClone)(l));
            },
            right: (right) => {
                const r = right[property];
                return Maybe_1.Maybe.of((0, deepClone_1.deepClone)(r));
            },
        });
    }
}
exports.Either = Either;
//# sourceMappingURL=Either.js.map