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
    {
      beforeAll: async (input: Input<IStoreShape, ISelectionShape>): Promise<Input<IStoreShape, ISelectionShape>> =>
        input,

      beforeEach:  (subject: Input<IStoreShape, ISelectionShape>, initialValues: any, testResource: never): Promise<Store<any, AnyAction>> =>
        createStore<IStoreShape, any, any, any>(subject.reducer, initialValues),

      andWhen: function (store: Store<any, AnyAction>, actioner: any, testResource: never): Promise<IStoreShape> {
        const a = actioner();
        return store.dispatch(a[0](a[1]));
      },
      butThen: function (store: Store<any, AnyAction>, callback: any, testResource: never): Promise<IStoreShape> {
        return store.getState();
      },
      assertioner: function (t: ThenShape) {
        return t[0](t[1], t[2], t[3]);
      },
      teardown: function (store: Store<any, AnyAction>, ndx: number): unknown {
        return store
      },
      actionHandler: function (b: (...any: any[]) => any) {
        return b();
      }
    }    
  )
