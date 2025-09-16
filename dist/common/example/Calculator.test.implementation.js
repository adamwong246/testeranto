"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ITestImplementation } from "testeranto/src/CoreTypes";
Object.defineProperty(exports, "__esModule", { value: true });
exports.implementation = void 0;
const Calculator_1 = require("./Calculator");
const chai_1 = require("chai");
exports.implementation = {
    suites: {
        Default: "Default test suite for Calculator",
    },
    givens: {
        Default: () => {
            const calc = new Calculator_1.Calculator();
            return calc;
        },
    },
    whens: {
        press: (button) => (calculator) => {
            const result = calculator.press(button);
            return result;
        },
        enter: () => (calculator) => {
            calculator.enter();
            return calculator;
        },
        memoryStore: () => (calculator) => {
            calculator.memoryStore();
            return calculator;
        },
        memoryRecall: () => (calculator) => {
            calculator.memoryRecall();
            return calculator;
        },
        memoryClear: () => (calculator) => {
            calculator.memoryClear();
            return calculator;
        },
        memoryAdd: () => (calculator) => {
            calculator.memoryAdd();
            return calculator;
        },
    },
    thens: {
        result: (expected) => (calculator) => {
            chai_1.assert.equal(calculator.getDisplay(), expected);
        },
    },
};
