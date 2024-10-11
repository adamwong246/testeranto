import Testeranto from "../../../Node";
import { IBaseTest } from "../../../Types";

import {
  ITestImpl,
  ITestSpec,
  IInput,
  IStore,
  ISelection,
  testInterface
} from "./index";

export default <ITestShape extends IBaseTest>(
  testImplementations: ITestImpl<ITestShape>,
  testSpecifications: ITestSpec<ITestShape>,
  testInput: IInput,
  testInterface2 = testInterface,
) => {
  return Testeranto<
    ITestShape
  >(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface2(testInput),
  )
};
