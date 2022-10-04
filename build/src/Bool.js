"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bool = void 0;
class Bool {
  constructor(value) {
    this.value = value;
  }
  static of(arg) {
    if (arg === false || arg === undefined || arg === null) {
      return new Bool(false);
    }
    return new Bool(true);
  }
  map(cb) {
    const v = cb(this.value);
    return Bool.of(v);
  }
  true(cb) {
    if (this.value) {
      cb();
    }
    return this;
  }
  false(cb) {
    if (!this.value) {
      cb();
    }
    return this;
  }
}
exports.Bool = Bool;
const f = Bool.of(Math.random() > 0.4);
const g = f.map((val) => val && Math.random() > 0.5);
g.true(() => console.log("oh yeah!")).false(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log("oh no!");
  })
);
