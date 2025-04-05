import test from "../../../Node.js";
import { Ibdd_in, Ibdd_out } from "../../../Types.js";

import type { ITestImpl, ITestSpec } from "../jsx-promised";

import { IInput, testInterface } from "./index.js";

export default <
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
>(
  testImplementations: ITestImpl<I, O>,
  testSpecifications: ITestSpec<I, O>,
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
