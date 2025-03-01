"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testInterface = void 0;
const react_1 = __importDefault(require("react"));
exports.testInterface = {
    // beforeAll: async (proto, testResource, artificer, pm): Promise<IStore> => {
    //   return React.createElement(proto);
    //   // return new Promise((resolve, rej) => {
    //   //   resolve(x());
    //   // });
    // },
    beforeEach: async (subject, initializer, artificer) => {
        return new Promise((resolve, rej) => {
            const x = react_1.default.createElement(subject);
            console.log("react-element", x);
            resolve(x);
        });
    },
    andWhen: function (s, whenCB) {
        return whenCB(s);
    },
};
