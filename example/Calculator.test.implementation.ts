/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ITestImplementation } from "testeranto/src/CoreTypes";
import { I, O, M } from "./Calculator.test.types";
import { Calculator } from "./Calculator";
import { ITestImplementation } from "../src/CoreTypes";
import { assert } from "chai";

export const implementation: ITestImplementation<I, O, M> = {
  suites: {
    Default: "Default test suite for Calculator",
  },

  givens: {
    Default: () => {
      const calc = new Calculator();
      console.log(
        "[IMPLEMENTATION] Default given, display:",
        calc.getDisplay()
      );
      return calc;
    },
  },

  whens: {
    press: (button: string) => (calculator: Calculator) => {
      console.log("[IMPLEMENTATION] press called with button:", button);
      console.log(
        "[IMPLEMENTATION] calculator before press:",
        calculator.getDisplay()
      );

      const result = calculator.press(button);
      console.log(
        "[IMPLEMENTATION] calculator after press:",
        result.getDisplay()
      );

      return result;
    },
    enter: () => (calculator: Calculator) => {
      console.log("[IMPLEMENTATION] enter called");
      console.log(
        "[IMPLEMENTATION] calculator before enter:",
        calculator.getDisplay()
      );
      calculator.enter();
      console.log(
        "[IMPLEMENTATION] calculator after enter:",
        calculator.getDisplay()
      );
      return calculator;
    },
    // Memory operations
    memoryStore: () => (calculator: Calculator) => {
      console.log("[IMPLEMENTATION] memoryStore called");
      calculator.memoryStore();
      return calculator;
    },
    memoryRecall: () => (calculator: Calculator) => {
      console.log("[IMPLEMENTATION] memoryRecall called");
      calculator.memoryRecall();
      return calculator;
    },
    memoryClear: () => (calculator: Calculator) => {
      console.log("[IMPLEMENTATION] memoryClear called");
      calculator.memoryClear();
      return calculator;
    },
    memoryAdd: () => (calculator: Calculator) => {
      console.log("[IMPLEMENTATION] memoryAdd called");
      calculator.memoryAdd();
      return calculator;
    },
  },

  thens: {
    result: (expected: string) => (calculator: Calculator) => {
      assert.equal(calculator.getDisplay(), expected);
    },
  },
};
