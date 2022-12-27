"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
class State {
    constructor(value) {
        this.value = value;
    }
    static of(val) {
        return new State(val);
    }
    static fromFunction(cb) {
        const value = cb();
        return State.of(value);
    }
    map(cb) {
        return State.of(cb(this.value));
    }
    reduce(cb, starterThing) {
        return State.of(cb(starterThing, this.value));
    }
    match(cb) {
        return cb(this.value);
    }
}
exports.State = State;
State.isState = (arg) => {
    return arg instanceof State;
};
