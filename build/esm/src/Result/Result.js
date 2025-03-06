import { Either } from "../Either/Either";
import { Maybe } from "../Maybe/Maybe";
import { deepClone } from "../utils/deepClone";
export class Result {
    constructor(value) {
        this.map = ({ data: dataCb, error: errorCb, }) => {
            return new Result(this.value.map({
                left: (value) => {
                    return dataCb(deepClone(value));
                },
                right: (err) => {
                    return errorCb(err);
                },
            }));
        };
        this.get = (args) => deepClone(this.value.get(args));
        this.value = value;
    }
    static error(message) {
        return new Result(Either.right(message));
    }
    static data(data) {
        return new Result(Either.left(data));
    }
    static isResult(val) {
        return val instanceof Result;
    }
    static async of(cb) {
        try {
            const value = deepClone(await cb());
            return Result.data(value);
        }
        catch (e) {
            return Result.error(String(e));
        }
    }
    static async fromFunction(cb) {
        return cb(Result.data, Result.error);
    }
    static async ofMaybe(cb) {
        const res = await Result.of(cb);
        return res.data((d) => Maybe.of(d));
    }
    data(cb) {
        return this.map({
            data: cb,
            error: (e) => e,
        });
    }
    error(cb) {
        return this.map({
            data: (d) => d,
            error: (err) => {
                var _a;
                return (_a = cb(err)) !== null && _a !== void 0 ? _a : err;
            },
        });
    }
    reduce(cb, starterThing) {
        return this.data((val) => {
            return cb(deepClone(starterThing), deepClone(val));
        });
    }
    match({ data: dataCB, error: errorCb, }) {
        return this.value.match({
            left: dataCB,
            right: errorCb,
        });
    }
}
//# sourceMappingURL=Result.js.map