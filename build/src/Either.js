"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Either = void 0;
class Either {
    constructor(value, whichSide) {
        this.value = value;
        this.whichSide = whichSide;
    }
    static of(val, whichSide) {
        return new Either(val, whichSide);
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
    isRight(value) {
        return this.whichSide === "right";
    }
    isLeft(value) {
        return this.whichSide === "left";
    }
    left(cb) {
        return this.map({
            left: (value) => {
                return cb(value);
            },
            right: () => {
                return this.value;
            }
        });
    }
    right(cb) {
        return this.map({
            left: (value) => {
                return this.value;
            },
            right: (value) => {
                return cb(value);
            }
        });
    }
    map({ left: leftCb, right: rightCb, }) {
        if (this.isLeft(this.value)) {
            return Either.left(leftCb(this.value));
        }
        return Either.right(rightCb(this.value));
    }
    match({ left: leftCb, right: rightCb, }) {
        if (this.isLeft(this.value)) {
            return leftCb(this.value);
        }
        return rightCb(this.value);
    }
}
exports.Either = Either;
