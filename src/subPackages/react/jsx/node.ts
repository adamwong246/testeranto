import Testeranto from "../../../Node";

import { ITTestShape } from "../../../core";

import {
  ITestImpl, ITestSpec, IInput, ISubject, IStore, ISelection, IThenShape, IWhenShape, InitialState, testInterface
} from ".";

export default <ITestShape extends ITTestShape>(
  testImplementations: ITestImpl<ITestShape>,
  testSpecifications: ITestSpec<ITestShape>,
  testInput: IInput
) => {
  return Testeranto<
    ITestShape,
    IInput,
    ISubject,
    IStore,
    ISelection,
    IThenShape,
    IWhenShape,
    InitialState
  >(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface(testInput),
  )
};
