import Testeranto from "../../../Web";

import { ITTestShape } from "../../../lib";

import { IImpl, ISpec, IInput, testInterface } from "./index";

export default <
  ITestShape extends ITTestShape,
  IProps,
  IState
>(
  testImplementations: IImpl<ITestShape, IProps>,
  testSpecifications: ISpec<ITestShape>,
  testInput: IInput<IProps, IState>,
) =>
  Testeranto<
    ITestShape,
    IInput<IProps, IState>,
    any,
    any,
    any,
    any,
    any,
    any
  >(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  )