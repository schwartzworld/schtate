var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Either } from "../Either/Either";
import { Maybe } from "../Maybe/Maybe";
export class Result {
    constructor(value) {
        this.map = ({ data: dataCb, error: errorCb, }) => {
            return new Result(this.value.map({
                left: (value) => {
                    return dataCb(value);
                },
                right: (err) => {
                    return errorCb(err);
                },
            }));
        };
        this.get = (args) => this.value.get(args);
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
    static of(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const value = yield cb();
                return Result.data(value);
            }
            catch (e) {
                return Result.error(String(e));
            }
        });
    }
    static fromFunction(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            return cb(Result.data, Result.error);
        });
    }
    static ofMaybe(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield Result.of(cb);
            return res.data((d) => Maybe.of(d));
        });
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
            return cb(starterThing, val);
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