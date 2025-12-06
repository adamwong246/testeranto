// import { ITestSpecification } from "testeranto/src/CoreTypes";
import { ITestSpecification } from "../src/CoreTypes";
import { I, O } from "./Calculator.test.types";

export const specification: ITestSpecification<I, O> = (
  Suite,
  Given,
  When,
  Then
) => {
  return [
    Suite.Default("Testing Calculator operations", {
      // Basic number input
      testEmptyDisplay: Given.Default(
        ["pressing nothing, the display is empty"],
        [],
        [Then.result("")]
      ),
      testSingleDigit: Given.Default(
        ["entering a number puts it on the disply"],
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
        [
          When.press("1"),
          When.press("2"),
          When.press("3"),
          When.press("4"),
          When.press("5"),
        ],
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
        [
          When.press("2"),
          When.press("+"),
          When.press("3"),
          When.press("*"),
          When.press("4"),
        ],
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
          When.press("5"),
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
          When.enter(),
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
          When.enter(),
        ],
        [Then.result("63")]
      ),
      testSimpleMultiplication: Given.Default(
        ["simple multiplication calculation"],
        [When.press("6"), When.press("*"), When.press("7"), When.enter()],
        [Then.result("42")]
      ),
      testSimpleDivision: Given.Default(
        ["simple division calculation"],
        [
          When.press("8"),
          When.press("4"),
          When.press("/"),
          When.press("2"),
          When.enter(),
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
          When.press("4"),
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
          When.enter(),
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
          When.enter(),
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
          When.enter(),
        ],
        [Then.result("20")]
      ),

      // Error cases
      testDivisionByZero: Given.Default(
        ["division by zero shows error"],
        [When.press("5"), When.press("/"), When.press("0"), When.enter()],
        [Then.result("Error")]
      ),
      testInvalidExpression: Given.Default(
        ["invalid expression shows error"],
        [
          When.press("2"),
          When.press("+"),
          When.press("+"),
          When.press("3"),
          When.enter(),
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
          When.press("MR"),
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
          When.press("MR"),
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
          When.press("MR"),
        ],
        [Then.result("30")]
      ),
    }),
  ];
};
