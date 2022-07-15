"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maybe = void 0;
const nothing_1 = require("./nothing");
class Maybe {
    constructor(value) {
        this.value = value;
    }
    isNothing(value) {
        return this.value instanceof nothing_1.Nothing;
    }
    static create(val) {
        if (Maybe.isMaybe(val)) {
            return new Maybe(val.value);
        }
        return new Maybe(val);
    }
    static nothing() {
        return Maybe.create(nothing_1.nothing);
    }
    static of(value) {
        return Maybe.create(value);
    }
    something(cb) {
        if (!this.isNothing(this.value)) {
            cb(this.value);
        }
        return Maybe.create(this.value);
    }
    nothing(cb) {
        if (this.isNothing(this.value)) {
            cb(this.value);
        }
        return Maybe.create(this.value);
    }
    map(cb) {
        if (this.isNothing(this.value)) {
            return Maybe.create(nothing_1.nothing);
        }
        return Maybe.create(cb(this.value));
    }
    reduce(cb, starterThing) {
        if (this.isNothing(this.value)) {
            return Maybe.nothing();
        }
        return Maybe.create(cb(starterThing, this.value));
    }
    filter(cb) {
        if (this.isNothing(this.value)) {
            return Maybe.create(nothing_1.nothing);
        }
        return Maybe.create(cb(this.value));
    }
    match({ something: somethingCB, nothing: nothingCB, }) {
        if (this.isNothing(this.value)) {
            return nothingCB();
        }
        return somethingCB(this.value);
    }
}
exports.Maybe = Maybe;
Maybe.isMaybe = (arg) => {
    return arg instanceof Maybe;
};
