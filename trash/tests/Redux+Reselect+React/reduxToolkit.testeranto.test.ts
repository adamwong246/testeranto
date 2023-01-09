import {
  ActionCreatorWithNonInferrablePayload,
  ActionCreatorWithoutPayload,
  Reducer,
} from "@reduxjs/toolkit";

import { createStore, Store, AnyAction } from "redux";
import { Testeranto } from "../../src/index";
import { ITestImplementation, ITestSpecification, ITTestShape, Modify } from "../../src/types";

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
  testInput: Input<IStoreShape, ISelectionShape>
) =>
  Testeranto<
    ITestShape,
    Input<IStoreShape, ISelectionShape>,
    Input<IStoreShape, ISelectionShape>,
    Store,
    IStoreShape,
    WhenShape,
    ThenShape,
    IStoreShape
  >(
    testInput,
    testSpecifications,
    testImplementations,
    { ports: 0 },
    {
      beforeEach: (subject: Input<IStoreShape, ISelectionShape>, initialValues: any): Promise<Store<any, AnyAction>> =>
        createStore<IStoreShape, any, any, any>(subject.reducer, initialValues),
      andWhen: function (store: Store<any, AnyAction>, actioner): Promise<IStoreShape> {
        const a = actioner();
        return store.dispatch(a[0](a[1]));
      },
      butThen: function (store: Store<any, AnyAction>): Promise<IStoreShape> {
        return store.getState();
      },
      assertioner: function (t: ThenShape) {
        return t[0](t[1], t[2], t[3]);
      }
    }
  )
