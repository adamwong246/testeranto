"use strict";
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
            console.log("[IMPLEMENTATION] Default given, display:", calc.getDisplay());
            return calc;
        },
    },
    whens: {
        press: (button) => (calculator) => {
            console.log("[IMPLEMENTATION] press called with button:", button);
            console.log("[IMPLEMENTATION] calculator before press:", calculator.getDisplay());
            const result = calculator.press(button);
            console.log("[IMPLEMENTATION] calculator after press:", result.getDisplay());
            return result;
        },
        enter: () => (calculator) => {
            console.log("[IMPLEMENTATION] enter called");
            console.log("[IMPLEMENTATION] calculator before enter:", calculator.getDisplay());
            calculator.enter();
            console.log("[IMPLEMENTATION] calculator after enter:", calculator.getDisplay());
            return calculator;
        },
        // Memory operations
        memoryStore: () => (calculator) => {
            console.log("[IMPLEMENTATION] memoryStore called");
            calculator.memoryStore();
            return calculator;
        },
        memoryRecall: () => (calculator) => {
            console.log("[IMPLEMENTATION] memoryRecall called");
            calculator.memoryRecall();
            return calculator;
        },
        memoryClear: () => (calculator) => {
            console.log("[IMPLEMENTATION] memoryClear called");
            calculator.memoryClear();
            return calculator;
        },
        memoryAdd: () => (calculator) => {
            console.log("[IMPLEMENTATION] memoryAdd called");
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
