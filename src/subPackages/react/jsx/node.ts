import Testeranto from "../../../Node.js";
import { IBaseTest, IPartialInterface } from "../../../Types";

import {
  ITestImpl,
  ITestSpec,
  IInput,

  testInterface as baseInterface
} from "./index.js";

export default <ITestShape extends IBaseTest>(
  testImplementations: ITestImpl<ITestShape>,
  testSpecifications: ITestSpec<ITestShape>,
  testInput: IInput,
  testInterface: IPartialInterface<ITestShape>,
) => {
  return Testeranto<
    ITestShape
  >(
    testInput,
    testSpecifications,
    testImplementations,
    {
      ...baseInterface,
      ...testInterface
    }
  )
};
