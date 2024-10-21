import Testeranto from "../../../Node.js";
import type { IBaseTest } from "../../../Types";

import { IImpl, ISpec, IInput, testInterface } from "./index.js";

export default <ITestShape extends IBaseTest, IProps, IState>(
  testImplementations: IImpl<ITestShape>,
  testSpecifications: ISpec<ITestShape>,
  testInput: IInput<IProps, IState>
) =>
  Testeranto<ITestShape>(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  );
