import { Either } from "../Either/Either.js";
import { Maybe } from "../Maybe/Maybe.js";
export class Bool {
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
        return this.map((v) => {
            return Boolean(value) && v;
        });
    }
    or(value) {
        return this.map((v) => {
            return Boolean(value) || v;
        });
    }
    true(cb) {
        if (this.value) {
            cb(this.value);
        }
        return this;
    }
    false(cb) {
        if (!this.value) {
            cb(this.value);
        }
        return this;
    }
    match({ true: trueCB, false: falseCB, }) {
        if (!this.value) {
            return falseCB();
        }
        return trueCB();
    }
    toEither() {
        return this.match({
            true: () => {
                return Either.left(true);
            },
            false: () => {
                return Either.right(false);
            },
        });
    }
    toMaybe() {
        return this.match({
            true: () => {
                return Maybe.of(true);
            },
            false: () => {
                return Maybe.nothing();
            },
        });
    }
}
//# sourceMappingURL=Bool.js.map