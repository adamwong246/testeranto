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
    "na",
    {
      beforeAll: async (input) => input,
      beforeEach: function (subject: Reducer<any, AnyAction>, initialValues: any, testResource: never): Promise<Store<any, AnyAction>> {
        return createStore<IStoreShape, any, any, any>(subject, initialValues)
      },
      andWhen: function (store: Store<any, AnyAction>, actioner: any, testResource: never): Promise<IStoreShape> {
        const a = actioner();
        return store.dispatch(a[0](a[1]));
      },
      butThen: function (store: Store<any, AnyAction>, callback: any, testResource: never): Promise<IStoreShape> {
        return store.getState();
      },
      assertioner: function (t: any) {
        return t;
      },
      teardown: function (store: Store<any, AnyAction>, ndx: number): unknown {
        return store;
      },
      actionHandler: function (b: (...any: any[]) => any) {
        return b();
      }
    }
  )
