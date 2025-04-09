"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactInterfacer = void 0;
const react_1 = __importDefault(require("react"));
const reactInterfacer = (testInput) => {
    return {
        beforeEach: async () => {
            return new Promise((resolve, rej) => {
                resolve(react_1.default.createElement(testInput, {}, []));
            });
        },
        andWhen: function (s, whenCB) {
            return whenCB()(s);
        },
    };
};
exports.reactInterfacer = reactInterfacer;
