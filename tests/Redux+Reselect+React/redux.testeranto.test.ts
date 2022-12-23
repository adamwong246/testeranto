import {
  ActionCreatorWithNonInferrablePayload,
  ActionCreatorWithoutPayload,
  Reducer,
} from "@reduxjs/toolkit";

import { createStore, Store, AnyAction, PreloadedState } from "redux";
import { TesterantoFactory} from "../../index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/testShapes";

type TestResource = never;
type WhenShape = [
  (
    | ActionCreatorWithNonInferrablePayload<string>
    | ActionCreatorWithoutPayload<string>
  ),
  (object | string)?
];
type ThenShape = any;
type Input = Reducer<any, AnyAction>;

export const ReduxTesteranto = <
  IStoreShape,
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
  testInput: Input
) =>
  TesterantoFactory<
    ITestShape,
    Input,
    Reducer,
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
    async (input) => input,
    (reducerSubject, initialValues) =>
      createStore<IStoreShape, any, any, any>(reducerSubject, initialValues),
    (store, actioner) => {
      const a = actioner();
      return store.dispatch(a[0](a[1]));
    },
    async (store) =>
      store.getState(),
    (t) => t,
    (server) => server,
    (actioner) => actioner(),
    "na"
  )
