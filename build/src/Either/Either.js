"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Either = void 0;
const State_1 = require("../State/State");
class Either {
    constructor(value, whichSide) {
        this.value = value;
        this.whichSide = whichSide;
    }
    static of(val, whichSide) {
        if (State_1.State.isState(val)) {
            return new Either(val, whichSide);
        }
        return new Either(State_1.State.of(val), whichSide);
    }
    static isEither(val) {
        return val instanceof Either;
    }
    static fromFunction(cb) {
        return cb();
    }
    static left(value) {
        return Either.of(value, "left");
    }
    static right(value) {
        return Either.of(value, "right");
    }
    isLeft(value) {
        return this.whichSide === "left";
    }
    left(cb) {
        return this.map({
            left: (value) => {
                return cb(value);
            },
            right: (v) => v,
        });
    }
    right(cb) {
        return this.map({
            left: (l) => {
                return l;
            },
            right: (value) => {
                return cb(value);
            },
        });
    }
    map({ left: leftCb, right: rightCb, }) {
        if (this.isLeft(this.value)) {
            const mappedValue = this.value.map((val) => {
                return leftCb(val);
            });
            return Either.left(mappedValue);
        }
        const mappedValue = this.value.map((val) => {
            return rightCb(val);
        });
        return Either.right(mappedValue);
    }
    match({ left: leftCb, right: rightCb, }) {
        if (this.isLeft(this.value)) {
            return this.value.match(leftCb);
        }
        return this.value.match((r) => {
            return rightCb(r);
        });
    }
}
exports.Either = Either;
