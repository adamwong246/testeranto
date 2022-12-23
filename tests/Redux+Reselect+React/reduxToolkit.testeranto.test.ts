import {
  ActionCreatorWithNonInferrablePayload,
  ActionCreatorWithoutPayload,
  Reducer,
} from "@reduxjs/toolkit";

import { createStore, Store, AnyAction } from "redux";
import { TesterantoFactory } from "../../index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/testShapes";

type TestResource = never;
type WhenShape = [
  (
    | ActionCreatorWithNonInferrablePayload<string>
    | ActionCreatorWithoutPayload<string>
  ),
  (object | string)?
];
type ThenShape = [(actual: unknown, expected: unknown, message?: string) => void, any, any, string?];
type Input<S, T> = {
  reducer: Reducer<any, AnyAction>,
  selector: (state: S) => T
};

export const ReduxToolkitTesteranto = <
  IStoreShape,
  ISelectionShape,
  ITestShape extends ITTestShape
>(
  testImplementations: ITestImplementation<
    IStoreShape,
    IStoreShape,
    WhenShape,
    ThenShape,
    ITestShape
  >,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Input<IStoreShape, ISelectionShape>
) =>
  TesterantoFactory<
    ITestShape,
    Input<IStoreShape, ISelectionShape>,
    Input<IStoreShape, ISelectionShape>,
    Store,
    IStoreShape,
    WhenShape,
    ThenShape,
    TestResource,
    IStoreShape
  >(
    testInput,
    testSpecifications,
    testImplementations,
    "na",
    async (input) => input,
    (subject, initialValues) =>
      createStore<IStoreShape, any, any, any>(subject.reducer, initialValues),
    (store, actioner) => {
      const a = actioner();
      return store.dispatch(a[0](a[1]));
    },
    (store) =>
      store.getState(),
    (t) => {
      t[0](t[1], t[2], t[3])
    },
    (server) => server,
    (actioner) => actioner(),
    
  )
