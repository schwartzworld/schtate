import { nothing, Nothing } from "./nothing";
import { Either } from "../Either/Either";
import { Bool } from "../Bool/Bool";
export class Maybe {
    constructor(value) {
        this.something = this.map;
        this.value = Either.fromFunction(() => {
            if (Maybe.isNothing(value)) {
                return Either.right(value);
            }
            return Either.left(value);
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
        return new Maybe(val);
    }
    static fromFunction(cb) {
        const value = cb(Maybe.of, Maybe.nothing);
        return Maybe.of(value);
    }
    nothing(cb) {
        this.value.right(cb);
        return this;
    }
    map(cb) {
        return Maybe.fromFunction(() => {
            return this.value.match({
                left: (val) => {
                    const result = cb(val);
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
            return cb(starterThing, val);
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
            return val[property];
        });
    }
    toEither() {
        return this.match({
            something: (val) => {
                return Either.left(val);
            },
            nothing: () => {
                return Either.right(null);
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