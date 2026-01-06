import {
  defaultTestResourceRequirement
} from "../chunk-GONGMDWG.mjs";

// src/lib/tiposkripto/Tiposkripto.ts
var tpskrt;
if (true) {
  tpskrt = await import("../Node-E7AT2MVY.mjs");
} else if (false) {
  tpskrt = await null;
} else {
  throw `Unknown ENV ${"node"}`;
}
var Tiposkripto_default = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement, testResourceConfiguration) => {
  return (await tpskrt.default)(
    input,
    testSpecification,
    testImplementation,
    testResourceRequirement,
    testAdapter,
    testResourceConfiguration
  );
};

// example/Calculator.ts
var Calculator = class {
  constructor() {
    this.display = "";
    this.values = {};
    this.id = Math.random();
  }
  // Add a unique ID to track instances
  // press(button: string): Calculator {
  //   this.display = this.display + button;
  //   return this;
  // }
  enter() {
    try {
      const result = eval(this.display);
      this.display = result.toString();
    } catch (error) {
      this.display = "Error";
      throw error;
    }
  }
  memoryStore() {
    this.setValue("memory", parseFloat(this.display) || 0);
    this.clear();
  }
  memoryRecall() {
    const memoryValue = this.getValue("meemory") || 0;
    this.display = memoryValue.toString();
  }
  memoryClear() {
    this.setValue("memory", 0);
  }
  memoryAdd() {
    const currentValue = parseFloat(this.display) || 0;
    const memoryValue = this.getValue("memory") || 0;
    this.setValue("memory", memoryValue + currentValue);
    this.clear();
  }
  handleSpecialButton(button) {
    switch (button) {
      case "C":
        this.clear();
        return true;
      case "MS":
        this.memoryStore();
        return true;
      case "MR":
        this.memoryRecall();
        return true;
      case "MC":
        this.memoryClear();
        return true;
      case "M+":
        this.memoryAdd();
        return true;
      default:
        return false;
    }
  }
  press(button) {
    if (this.handleSpecialButton(button)) {
      return this;
    }
    this.display = this.display + button;
    return this;
  }
  getDisplay() {
    return this.display;
  }
  clear() {
    this.display = "";
  }
  // Keep these methods for backward compatibility if needed
  add(a, b) {
    return a + b;
  }
  subtract(a, b) {
    return a - b;
  }
  multiply(a, b) {
    return a * b;
  }
  divide(a, b) {
    if (b === 0) {
      throw new Error("Cannot divide by zero");
    }
    return a / b;
  }
  setValue(identifier, value) {
    this.values[identifier] = value;
  }
  getValue(identifier) {
    return this.values[identifier] ?? null;
  }
};

// example/Calculator.test.adapter.ts
var adapter = {
  beforeAll: async (input, testResource, pm) => {
    return input;
  },
  beforeEach: async (subject, initializer, testResource, initialValues, pm) => {
    const result2 = await initializer();
    return result2;
  },
  andWhen: async (store, whenCB, testResource, pm) => {
    const transform = whenCB;
    const result2 = transform(store);
    return result2;
  },
  butThen: async (store, thenCB, testResource, pm) => {
    thenCB(store);
    const display = store.getDisplay();
    return display;
  },
  afterEach: async (store, key, pm) => {
    return store;
  },
  afterAll: async (store, pm) => {
    return store;
  },
  assertThis: (actual) => {
    return actual;
  }
};

// example/Calculator.test.implementation.ts
import { assert } from "chai";
var implementation = {
  suites: {
    Default: { description: "Default test suite for Calculator" }
  },
  givens: {
    Default: () => {
      const calc = new Calculator();
      return calc;
    }
  },
  whens: {
    press: (button) => (calculator) => {
      const result2 = calculator.press(button);
      return result2;
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
    }
  },
  thens: {
    result: (expected) => (calculator) => {
      assert.equal(calculator.getDisplay(), expected);
    }
  }
};

// example/Calculator.test.specification.ts
var specification = (Suite, Given, When, Then) => {
  return [
    Suite.Default("Testing Calculator operations", {
      // Basic number input
      testEmptyDisplay: Given.Default(
        ["pressing nothing, the display is empty"],
        [],
        [Then.result("")]
      ),
      testSingleDigit: Given.Default(
        ["entering a number puts it on the display"],
        [When.press("2")],
        [Then.result("2")]
      ),
      testMultipleDigits: Given.Default(
        ["entering multiple digits concatenates them"],
        [When.press("2"), When.press("2")],
        [Then.result("22")]
      ),
      testLargeNumber: Given.Default(
        ["entering a large number works correctly"],
        [When.press("1"), When.press("2"), When.press("3"), When.press("4"), When.press("5")],
        [Then.result("12345")]
      ),
      // Basic operations
      testAdditionExpression: Given.Default(
        ["addition expression is displayed correctly"],
        [When.press("2"), When.press("+"), When.press("3")],
        [Then.result("2+3")]
      ),
      testIncompleteAddition: Given.Default(
        ["incomplete addition expression is displayed correctly"],
        [When.press("2"), When.press("+")],
        [Then.result("2+")]
      ),
      testSubtractionExpression: Given.Default(
        ["subtraction expression is displayed correctly"],
        [When.press("7"), When.press("-"), When.press("3")],
        [Then.result("7-3")]
      ),
      testMultiplicationExpression: Given.Default(
        ["multiplication expression is displayed correctly"],
        [When.press("4"), When.press("*"), When.press("5")],
        [Then.result("4*5")]
      ),
      testDivisionExpression: Given.Default(
        ["division expression is displayed correctly"],
        [When.press("8"), When.press("/"), When.press("2")],
        [Then.result("8/2")]
      ),
      // Complex expressions
      testMixedOperations: Given.Default(
        ["mixed operations are displayed correctly"],
        [When.press("2"), When.press("+"), When.press("3"), When.press("*"), When.press("4")],
        [Then.result("2+3*4")]
      ),
      testLongExpression: Given.Default(
        ["long complex expression is displayed correctly"],
        [
          When.press("1"),
          When.press("+"),
          When.press("2"),
          When.press("*"),
          When.press("3"),
          When.press("-"),
          When.press("4"),
          When.press("/"),
          When.press("5")
        ],
        [Then.result("1+2*3-4/5")]
      ),
      // Calculation tests
      testSimpleAddition: Given.Default(
        ["simple addition calculation"],
        [
          When.press("2"),
          When.press("3"),
          When.press("+"),
          When.press("4"),
          When.press("5"),
          When.enter()
        ],
        [Then.result("68")]
      ),
      testSimpleSubtraction: Given.Default(
        ["simple subtraction calculation"],
        [
          When.press("9"),
          When.press("5"),
          When.press("-"),
          When.press("3"),
          When.press("2"),
          When.enter()
        ],
        [Then.result("63")]
      ),
      testSimpleMultiplication: Given.Default(
        ["simple multiplication calculation"],
        [
          When.press("6"),
          When.press("*"),
          When.press("7"),
          When.enter()
        ],
        [Then.result("42")]
      ),
      testSimpleDivision: Given.Default(
        ["simple division calculation"],
        [
          When.press("8"),
          When.press("4"),
          When.press("/"),
          When.press("2"),
          When.enter()
        ],
        [Then.result("42")]
      ),
      // Edge cases
      testClearOperation: Given.Default(
        ["clear operation resets the display"],
        [
          When.press("1"),
          When.press("2"),
          When.press("3"),
          When.press("C"),
          When.press("4")
        ],
        [Then.result("4")]
      ),
      testStartingWithOperator: Given.Default(
        ["starting with operator should work"],
        [When.press("+"), When.press("5")],
        [Then.result("+5")]
      ),
      testMultipleOperators: Given.Default(
        ["multiple operators in sequence"],
        [When.press("5"), When.press("+"), When.press("-"), When.press("3")],
        [Then.result("5+-3")]
      ),
      // Decimal numbers
      testDecimalInput: Given.Default(
        ["decimal number input"],
        [When.press("3"), When.press("."), When.press("1"), When.press("4")],
        [Then.result("3.14")]
      ),
      testDecimalCalculation: Given.Default(
        ["decimal calculation"],
        [
          When.press("3"),
          When.press("."),
          When.press("1"),
          When.press("+"),
          When.press("1"),
          When.press("."),
          When.press("8"),
          When.press("6"),
          When.enter()
        ],
        [Then.result("4.96")]
      ),
      // Complex calculations
      testOrderOfOperations: Given.Default(
        ["order of operations is respected"],
        [
          When.press("2"),
          When.press("+"),
          When.press("3"),
          When.press("*"),
          When.press("4"),
          When.enter()
        ],
        [Then.result("14")]
      ),
      testParenthesesExpression: Given.Default(
        ["parentheses in expression"],
        [
          When.press("("),
          When.press("2"),
          When.press("+"),
          When.press("3"),
          When.press(")"),
          When.press("*"),
          When.press("4"),
          When.enter()
        ],
        [Then.result("20")]
      ),
      // Error cases
      testDivisionByZero: Given.Default(
        ["division by zero shows error"],
        [
          When.press("5"),
          When.press("/"),
          When.press("0"),
          When.enter()
        ],
        [Then.result("Error")]
      ),
      testInvalidExpression: Given.Default(
        ["invalid expression shows error"],
        [
          When.press("2"),
          When.press("+"),
          When.press("+"),
          When.press("3"),
          When.enter()
        ],
        [Then.result("Error")]
      ),
      // Memory functions
      testMemoryStoreRecall: Given.Default(
        ["memory store and recall"],
        [
          When.press("1"),
          When.press("2"),
          When.press("3"),
          When.press("MS"),
          When.press("C"),
          When.press("MR")
        ],
        [Then.result("123")]
      ),
      testMemoryClear: Given.Default(
        ["memory clear"],
        [
          When.press("4"),
          When.press("5"),
          When.press("6"),
          When.press("MS"),
          When.press("MC"),
          When.press("MR")
        ],
        [Then.result("0")]
      ),
      testMemoryAddition: Given.Default(
        ["memory addition"],
        [
          When.press("1"),
          When.press("0"),
          When.press("M+"),
          When.press("2"),
          When.press("0"),
          When.press("M+"),
          When.press("MR")
        ],
        [Then.result("30")]
      )
    })
  ];
};

// example/Calculator.test.ts
var Calculator_test_default = Tiposkripto_default(
  Calculator,
  specification,
  implementation,
  adapter,
  { ports: 1e3 }
  // new TsAnalyzer()
);
export {
  Calculator_test_default as default
};
