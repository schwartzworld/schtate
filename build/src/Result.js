"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Either_1 = require("./Either");
class Result {
    constructor(value) {
        this.value = value;
    }
    static of() {
    }
    static error(message) {
        return new Result(Either_1.Either.right(message));
    }
    static data(data) {
        return new Result(Either_1.Either.left(data));
    }
    static isResult(val) {
        return val instanceof Result;
    }
    static fromFunction(cb) {
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
}
const mockFunc = () => __awaiter(void 0, void 0, void 0, function* () {
    if (Math.random() > 0.5) {
        throw new Error('Fuck you');
    }
    return "Hello";
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = Result.fromFunction(mockFunc);
});
