"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testInterface = void 0;
const react_1 = __importDefault(require("react"));
exports.testInterface = {
    andWhen: async (s, whenCB) => {
        await whenCB(s());
        return new Promise((resolve, rej) => {
            resolve(react_1.default.createElement(s));
        });
    },
    butThen: async (subject, thenCB) => {
        await thenCB(subject());
        return new Promise((resolve, rej) => {
            resolve(react_1.default.createElement(subject));
        });
    },
};
// export type IWhenShape = any;
// export type IThenShape = any;
// export type InitialState = unknown;
// export type IInput = () => JSX.Element;
// export type ISelection = CElement<any, any>;
// export type IStore = CElement<any, any>;
// export type ISubject = CElement<any, any>;
// export type ITestImpl<
//   I extends Ibdd_in<
//     unknown,
//     unknown,
//     unknown,
//     unknown,
//     unknown,
//     unknown,
//     unknown
//   >,
//   O extends Ibdd_out<
//     Record<string, any>,
//     Record<string, any>,
//     Record<string, any>,
//     Record<string, any>,
//     Record<string, any>
//   >
// > = ITestImplementation<I, O>;
// export type ITestSpec<
//   I extends Ibdd_in<
//     unknown,
//     unknown,
//     unknown,
//     unknown,
//     unknown,
//     unknown,
//     unknown
//   >,
//   O extends Ibdd_out<
//     Record<string, any>,
//     Record<string, any>,
//     Record<string, any>,
//     Record<string, any>,
//     Record<string, any>
//   >
// > = ITestSpecification<I, O>;
