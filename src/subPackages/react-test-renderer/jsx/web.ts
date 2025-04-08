import test from "../../../Web.js";

import {
  Ibdd_out,
  ITestImplementation,
  ITestSpecification,
} from "../../../Types.js";

import { I, IInput, testInterface } from "./index.js";

export default <
  II extends I,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
>(
  testImplementations: ITestImplementation<II, O>,
  testSpecifications: ITestSpecification<II, O>,
  testInput: IInput,
  testInterface2 = testInterface
) => {
  return test<I, O>(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface2
  );
};
