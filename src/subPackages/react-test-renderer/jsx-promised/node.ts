import test from "../../../Node";

import {
  ITestImpl, ITestSpec, IInput, ISubject, IStore, ISelection, IThenShape, IWhenShape, InitialState, testInterface
} from "./index";

import { ITTestShape } from "../../../lib";

export default <ITestShape extends ITTestShape>(
  testImplementations: ITestImpl<ITestShape>,
  testSpecifications: ITestSpec<ITestShape>,
  testInput: IInput
) => {
  return test<
    ITestShape,
    IInput,
    ISubject,
    IStore,
    ISelection,
    IThenShape,
    IWhenShape,
    InitialState,
    any
  >(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface,
  )
};
