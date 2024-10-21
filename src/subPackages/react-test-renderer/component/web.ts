import { IBaseTest } from "../../../Types";
import Testeranto from "../../../Web.js";

import { IImpl, ISpec, IInput, testInterface } from "./index.js";

export default <ITestShape extends IBaseTest, IProps, IState>(
  testImplementations: IImpl<ITestShape>,
  testSpecifications: ISpec<ITestShape>,
  testInput: IInput<any, any>
) =>
  Testeranto<ITestShape>(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  );
