"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
const deepClone_js_1 = require("../utils/deepClone.js");
class State {
    constructor(value) {
        this.value = value;
    }
    static of(val) {
        return new State(val);
    }
    static fromFunction(cb) {
        const value = cb();
        return State.of((0, deepClone_js_1.deepClone)(value));
    }
    map(cb) {
        return State.of(cb((0, deepClone_js_1.deepClone)(this.value)));
    }
    reduce(cb, starterThing) {
        return State.of(cb((0, deepClone_js_1.deepClone)(starterThing), (0, deepClone_js_1.deepClone)(this.value)));
    }
    match(cb) {
        return cb((0, deepClone_js_1.deepClone)(this.value));
    }
}
exports.State = State;
State.isState = (arg) => {
    return arg instanceof State;
};
//# sourceMappingURL=State.js.map