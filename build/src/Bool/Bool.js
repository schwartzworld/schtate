"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bool = void 0;
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
        return this.map(v => {
            return Boolean(value) && v;
        });
    }
    or(value) {
        return this.map(v => {
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
}
exports.Bool = Bool;
