/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ITestImplementation } from "testeranto/src/CoreTypes";

import { I, O, M } from "./Calculator.test.types";
import { Calculator } from "./Calculator";
import { ITestImplementation } from "../src/CoreTypes";
import { assert } from "chai";

export const implementation: ITestImplementation<I, O, M> = {
  suites: {
    Default: { description: "Default test suite for Calculator" },
  },

  givens: {
    Default: () => {
      const calc = new Calculator();
      return calc;
    },
  },

  whens: {
    press: (button: string) => (calculator: Calculator) => {
      const result = calculator.press(button);

      return result;
    },
    enter: () => (calculator: Calculator) => {
      calculator.enter();
      return calculator;
    },
    memoryStore: () => (calculator: Calculator) => {
      calculator.memoryStore();
      return calculator;
    },
    memoryRecall: () => (calculator: Calculator) => {
      calculator.memoryRecall();
      return calculator;
    },
    memoryClear: () => (calculator: Calculator) => {
      calculator.memoryClear();
      return calculator;
    },
    memoryAdd: () => (calculator: Calculator) => {
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
