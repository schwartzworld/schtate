"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Maybe_1 = __importDefault(require("./src/Maybe"));
const nothing_1 = __importDefault(require("./src/nothing"));
const exp = {
    Maybe: Maybe_1.default,
    nothing: nothing_1.default
};
exports.default = exp;
