/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ITestImplementation } from "testeranto/src/CoreTypes";
import { Calculator } from "./Calculator";
import { assert } from "chai";
export const implementation = {
    suites: {
        Default: "Default test suite for Calculator",
    },
    givens: {
        Default: () => {
            const calc = new Calculator();
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
            assert.equal(calculator.getDisplay(), expected);
        },
    },
};
