import { State } from "../State/State.js";
import { Maybe } from "../Maybe/Maybe.js";
import { deepClone } from "../utils/deepClone.js";
export class Either {
    constructor(value, whichSide) {
        this.value = value;
        this.whichSide = whichSide;
    }
    static of(val, whichSide) {
        if (State.isState(val)) {
            return new Either(deepClone(val), whichSide);
        }
        return new Either(State.of(deepClone(val)), whichSide);
    }
    static isEither(val) {
        return val instanceof Either;
    }
    static fromFunction(cb) {
        return cb(Either.left, Either.right);
    }
    static left(value) {
        return Either.of(deepClone(value), "left");
    }
    static right(value) {
        return Either.of(deepClone(value), "right");
    }
    isLeft(value) {
        if (this.whichSide === "right")
            return false;
        return this.whichSide === "left";
    }
    left(cb) {
        return this.map({
            left: (value) => {
                return cb(deepClone(value));
            },
            right: (v) => deepClone(v),
        });
    }
    right(cb) {
        return this.map({
            left: (l) => {
                return deepClone(l);
            },
            right: (value) => {
                return cb(deepClone(value));
            },
        });
    }
    map({ left: leftCb, right: rightCb, }) {
        if (this.isLeft(this.value)) {
            const mappedValue = this.value.map((val) => {
                return leftCb(deepClone(val));
            });
            return Either.left(mappedValue);
        }
        const mappedValue = this.value.map((val) => {
            return rightCb(deepClone(val));
        });
        return Either.right(mappedValue);
    }
    match({ left: leftCb, right: rightCb, }) {
        if (this.isLeft(this.value)) {
            return this.value.match(leftCb);
        }
        return this.value.match((r) => {
            return rightCb(deepClone(r));
        });
    }
    get(property) {
        return this.match({
            left: (left) => {
                const l = left[property];
                return Maybe.of(deepClone(l));
            },
            right: (right) => {
                const r = right[property];
                return Maybe.of(deepClone(r));
            },
        });
    }
}
//# sourceMappingURL=Either.js.map