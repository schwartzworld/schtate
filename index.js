"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nothing_ts_1 = require("./nothing.ts");
class Maybe {
    constructor(value) {
        if (value instanceof Maybe) {
            this.value = value.value;
        }
        else {
            this.value = value;
        }
    }
    isNothing(value) {
        return this.value instanceof nothing_ts_1.Nothing;
    }
    static create(val) {
        if (val instanceof Maybe) {
            return new Maybe(val.value);
        }
        return new Maybe(val);
    }
    map(cb) {
        if (this.isNothing(this.value)) {
            return Maybe.create(nothing_ts_1.nothing);
        }
        return Maybe.create(cb(this.value));
    }
    unwrap() {
        return this.value;
    }
    just(cb) {
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
    reduce(cb, starterThing) {
        if (this.isNothing(this.value)) {
            return Maybe.create(nothing_ts_1.nothing);
        }
        return Maybe.create(cb(starterThing, this.value));
    }
}
function coinFlip(value) {
    if (Math.random() > 0.5) {
        return value;
    }
    return nothing_ts_1.nothing;
}
const maybeArr = new Array(10).fill(1).map(() => Maybe.create(coinFlip(Math.random()))); // 10 items could be Hello or nothing
maybeArr.forEach(m => {
    m.just(v => console.log(v + 1))
        .map(v => v * v)
        .just(v => console.log(v))
        .nothing(() => console.log('this is nothing'))
        .reduce((obj, val) => {
        obj.val = val;
        console.log({ obj });
        return obj;
    }, {});
});
