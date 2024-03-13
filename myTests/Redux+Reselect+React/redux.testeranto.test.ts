import {
  ActionCreatorWithNonInferrablePayload,
  ActionCreatorWithoutPayload,
  Reducer,
} from "@reduxjs/toolkit";
import { createStore, Store, AnyAction } from "redux";

import Testeranto from "testeranto/src/core-node";
import { ITestImplementation, ITestSpecification, ITTestShape, Modify } from "testeranto/src/core";

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
  ITestShape extends ITTestShape,
  IFeatureShape,
>(
  testImplementations: Modify<ITestImplementation<
    IStoreShape,
    IStoreShape,
    WhenShape,
    ThenShape,
    ITestShape
  >, {
    Whens: {
      [K in keyof ITestShape["whens"]]: (
        ...Iw: ITestShape["whens"][K]
      ) => WhenShape;
    }

  }>,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Input

) =>
  Testeranto<
    ITestShape,
    Input,
    Reducer,
    Store,
    IStoreShape,
    WhenShape,
    ThenShape,
    IStoreShape
  // IFeatureShape
  >(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeEach: function (subject: Reducer<any, AnyAction>, initialValues: any): Promise<Store<any, AnyAction>> {
        return createStore<IStoreShape, any, any, any>(subject, initialValues)
      },
      andWhen: function (store: Store<any, AnyAction>, actioner: any): Promise<IStoreShape> {
        const a = actioner();
        return store.dispatch(a[0](a[1]));
      },
      butThen: function (store: Store<any, AnyAction>): Promise<IStoreShape> {
        return store.getState();
      },
    },
    "redux"
  )
