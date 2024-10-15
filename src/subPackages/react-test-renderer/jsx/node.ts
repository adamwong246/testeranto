import test from "../../../Node";
import { IBaseTest } from "../../../Types";
import { ITestImpl, ITestSpec } from "../jsx-promised";

import {
  IInput,
  testInterface
} from "./index";

export default <ITestShape extends IBaseTest>(
  testImplementations: ITestImpl<ITestShape>,
  testSpecifications: ITestSpec<ITestShape>,
  testInput: IInput,
  testInterface2 = testInterface,
) => {
  return test<
    ITestShape
  >(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface2,
  )
};
