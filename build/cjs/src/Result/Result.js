"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
const Either_js_1 = require("../Either/Either.js");
const Maybe_js_1 = require("../Maybe/Maybe.js");
const deepClone_js_1 = require("../utils/deepClone.js");
class Result {
    constructor(value) {
        this.map = ({ data: dataCb, error: errorCb, }) => {
            return new Result(this.value.map({
                left: (value) => {
                    return dataCb((0, deepClone_js_1.deepClone)(value));
                },
                right: (err) => {
                    return errorCb(err);
                },
            }));
        };
        this.get = (args) => (0, deepClone_js_1.deepClone)(this.value.get(args));
        this.value = value;
    }
    static error(message) {
        return new Result(Either_js_1.Either.right(message));
    }
    static data(data) {
        return new Result(Either_js_1.Either.left(data));
    }
    static isResult(val) {
        return val instanceof Result;
    }
    static async of(cb) {
        try {
            const value = (0, deepClone_js_1.deepClone)(await cb());
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
        return res.data((d) => Maybe_js_1.Maybe.of(d));
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
            return cb((0, deepClone_js_1.deepClone)(starterThing), (0, deepClone_js_1.deepClone)(val));
        });
    }
    match({ data: dataCB, error: errorCb, }) {
        return this.value.match({
            left: dataCB,
            right: errorCb,
        });
    }
}
exports.Result = Result;
//# sourceMappingURL=Result.js.map