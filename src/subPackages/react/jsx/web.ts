import {
  IBaseTest,
  IPartialInterface,
  IPartialWebInterface,
} from "../../../Types";
import Testeranto from "../../../Web.js";

import {
  ITestImpl,
  ITestSpec,
  IInput,
  testInterface as baseInterface,
} from "./index.js";

export default <ITestShape extends IBaseTest>(
  testImplementations: ITestImpl<ITestShape>,
  testSpecifications: ITestSpec<ITestShape>,
  testInput: IInput,
  testInterface: IPartialWebInterface<ITestShape>
) => {
  return Testeranto<ITestShape>(
    testInput,
    testSpecifications,
    testImplementations,
    {
      ...baseInterface,
      ...testInterface,
    }
  );
};
