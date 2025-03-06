import { deepClone } from "../utils/deepClone";
export class State {
    constructor(value) {
        this.value = value;
    }
    static of(val) {
        return new State(val);
    }
    static fromFunction(cb) {
        const value = cb();
        return State.of(deepClone(value));
    }
    map(cb) {
        return State.of(cb(deepClone(this.value)));
    }
    reduce(cb, starterThing) {
        return State.of(cb(deepClone(starterThing), deepClone(this.value)));
    }
    match(cb) {
        return cb(deepClone(this.value));
    }
}
State.isState = (arg) => {
    return arg instanceof State;
};
//# sourceMappingURL=State.js.map