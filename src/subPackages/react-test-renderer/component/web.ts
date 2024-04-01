import Testeranto from "../../../Web";

import { ITTestShape } from "../../../core";

import { IImpl, ISpec, IInput, testInterface } from ".";

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