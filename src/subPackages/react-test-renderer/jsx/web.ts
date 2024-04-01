import test from "../../../Web";

import { ITTestShape } from "../../../core";

import { testInterface } from "./index";

import {
  ITestImpl, ITestSpec, IInput, ISubject, IStore, ISelection, IThenShape, IWhenShape, InitialState
} from ".";

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
