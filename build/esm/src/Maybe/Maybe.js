import { nothing, Nothing } from "./nothing";
import { Either } from "../Either/Either";
import { Bool } from "../Bool/Bool";
import { deepClone } from "../utils/deepClone";
export class Maybe {
    constructor(value) {
        this.something = this.map;
        this.value = Either.fromFunction(() => {
            if (Maybe.isNothing(value)) {
                return Either.right(deepClone(value));
            }
            return Either.left(deepClone(value));
        });
    }
    static isNothing(value) {
        return value instanceof Nothing;
    }
    static nothing() {
        return Maybe.of(nothing);
    }
    static of(val) {
        if (val === null || val === undefined) {
            return Maybe.nothing();
        }
        if (Maybe.isMaybe(val)) {
            return val;
        }
        return new Maybe(deepClone(val));
    }
    static fromFunction(cb) {
        const value = cb(Maybe.of, Maybe.nothing);
        return Maybe.of(deepClone(value));
    }
    nothing(cb) {
        this.value.right(cb);
        return this;
    }
    map(cb) {
        return Maybe.fromFunction(() => {
            return this.value.match({
                left: (val) => {
                    const result = cb(deepClone(val));
                    return result;
                },
                right: () => {
                    return nothing;
                },
            });
        });
    }
    reduce(cb, starterThing) {
        return this.something((val) => {
            return cb(deepClone(starterThing), deepClone(val));
        });
    }
    match({ something: somethingCB, nothing: nothingCB, }) {
        return this.value.match({
            left: somethingCB,
            right: nothingCB,
        });
    }
    get(property) {
        return this.map((val) => {
            return deepClone(val[property]);
        });
    }
    toEither() {
        return this.match({
            something: (val) => {
                return Either.left(deepClone(val));
            },
            nothing: () => {
                return Either.right(deepClone(null));
            },
        });
    }
    toBool() {
        return this.match({
            something: () => {
                return Bool.true();
            },
            nothing: () => {
                return Bool.false();
            },
        });
    }
}
Maybe.isMaybe = (arg) => {
    return arg instanceof Maybe;
};
//# sourceMappingURL=Maybe.js.map