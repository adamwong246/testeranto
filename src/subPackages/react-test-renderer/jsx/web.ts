import test from "../../../Web";
import { ITTestShape } from "../../../lib";

import {
  ITestImpl, ITestSpec, IInput, ISubject, IStore, ISelection, IThenShape, IWhenShape, InitialState, testInterface
} from "./index";

export default <ITestShape extends ITTestShape>(
  testImplementations: ITestImpl<ITestShape>,
  testSpecifications: ITestSpec<ITestShape>,
  testInput: IInput,
  testInterface2 = testInterface,
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
    testInterface2,
  )
};
