import test from "../../../Node.js";
import { IBaseTest } from "../../../Types";

import type { ITestImpl, ITestSpec } from "../jsx-promised";

import { IInput, testInterface } from "./index.js";

export default <ITestShape extends IBaseTest>(
  testImplementations: ITestImpl<ITestShape>,
  testSpecifications: ITestSpec<ITestShape>,
  testInput: IInput,
  testInterface2 = testInterface
) => {
  return test<ITestShape>(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface2
  );
};
