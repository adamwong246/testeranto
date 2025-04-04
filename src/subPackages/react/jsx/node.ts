import Testeranto from "../../../Node.js";
import { IBaseTest, IPartialInterface } from "../../../Types";

import {
  ITestImpl,
  ITestSpec,
  IInput,
  testInterface as baseInterface,
} from "./index.js";

export default <
  ITestShape extends IBaseTest<
    IInput,
    number,
    number,
    number,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
>(
  testImplementations: ITestImpl<ITestShape>,
  testSpecifications: ITestSpec<ITestShape>,
  testInput: IInput,
  testInterface: IPartialInterface<ITestShape> = baseInterface
) => {
  return Testeranto<ITestShape>(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  );
};
