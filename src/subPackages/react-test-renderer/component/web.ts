import { IBaseTest } from "../../../Types";
import Testeranto from "../../../Web";

import { IImpl, ISpec, IInput, testInterface } from "./index";

export default <
  ITestShape extends IBaseTest,
  IProps,
  IState
>(
  testImplementations: IImpl<ITestShape, IProps>,
  testSpecifications: ISpec<ITestShape>,
  testInput: IInput<IProps, IState>,
) =>
  Testeranto<
    ITestShape
  >(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  )