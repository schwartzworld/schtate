"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nothing_1 = __importStar(require("./nothing"));
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
        return this.value instanceof nothing_1.Nothing;
    }
    static create(val) {
        if (val instanceof Maybe) {
            return new Maybe(val.value);
        }
        return new Maybe(val);
    }
    static nothing() {
        return Maybe.create(nothing_1.default);
    }
    static of(value) {
        return Maybe.create(value);
    }
    something(cb) {
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
    map(cb) {
        if (this.isNothing(this.value)) {
            return Maybe.create(nothing_1.default);
        }
        return Maybe.create(cb(this.value));
    }
    reduce(cb, starterThing) {
        if (this.isNothing(this.value)) {
            return Maybe.nothing();
        }
        return Maybe.create(cb(starterThing, this.value));
    }
    filter(cb) {
        if (this.isNothing(this.value)) {
            return Maybe.create(nothing_1.default);
        }
        return Maybe.create(cb(this.value));
    }
    match({ something: somethingCB, nothing: nothingCB, }) {
        if (this.isNothing(this.value)) {
            return nothingCB();
        }
        return somethingCB(this.value);
    }
}
exports.default = Maybe;
