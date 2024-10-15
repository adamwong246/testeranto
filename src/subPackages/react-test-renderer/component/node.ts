import Testeranto from "../../../Node";
import { IBaseTest } from "../../../Types";

import { IImpl, ISpec, IInput, testInterface } from "./index";

export default <
  ITestShape extends IBaseTest,
  IProps,
  IState
>(
  testImplementations: IImpl<ITestShape, IProps, IState>,
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