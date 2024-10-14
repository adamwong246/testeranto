"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Node_1 = __importDefault(require("../Node"));
exports.default = (testInput, testSpecifications, testImplementations) => {
    return (0, Node_1.default)(testInput, testSpecifications, testImplementations, {
        beforeAll(x) {
            process.parentPort.postMessage(`/dist/web/src/ClassicalComponent/test.html`);
            return x;
        },
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
