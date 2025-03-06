export class State {
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
State.isState = (arg) => {
    return arg instanceof State;
};
//# sourceMappingURL=State.js.map