import { ITTestShape } from "../../../Types";
import Testeranto from "../../../Web";

import { IImpl, ISpec, IInput, testInterface } from "./index";

export default <
  ITestShape extends ITTestShape,
  IReactProps,
  IReactState
>(
  testImplementations: IImpl<ITestShape, IReactProps, IReactState>,
  testSpecifications: ISpec<ITestShape>,
  testInput: IInput<IReactProps, IReactState>,
) =>
  Testeranto<
    ITestShape,
    IInput<IReactProps, IReactState>,
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