"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Node_js_1 = __importDefault(require("../../../Node.js"));
exports.default = (testImplementations, testSpecifications, testInput) => {
    return (0, Node_js_1.default)(testInput, testSpecifications, testImplementations, {
        beforeEach: async () => {
            return new Promise((resolve, rej) => {
                resolve(react_1.default.createElement(testInput, {}, []));
            });
        },
        andWhen: function (s, whenCB) {
            return whenCB()(s);
        },
    });
};
