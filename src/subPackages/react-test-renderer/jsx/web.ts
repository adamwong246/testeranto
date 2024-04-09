import { ITTestShape } from "../../../Types";
import test from "../../../Web";

import {
  ITestImpl, ITestSpec, IInput, ISubject, IStore, ISelection, IThenShape, IWhenShape, InitialState, testInterface
} from "./index";

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
    InitialState
  >(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface,
  )
};
