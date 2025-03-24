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
    // beforeEach: async (subject, initializer, artificer): Promise<IStore> => {
    //   return new Promise((resolve, rej) => {
    //     resolve(React.createElement(subject));
    //   });
    // },
    andWhen: async (s, whenCB) => {
        await whenCB(s());
        return new Promise((resolve, rej) => {
            resolve(react_1.default.createElement(s));
        });
        // return whenCB(s);
    },
    butThen: async (subject, thenCB) => {
        await thenCB(subject());
        return new Promise((resolve, rej) => {
            resolve(react_1.default.createElement(subject));
        });
    },
};
