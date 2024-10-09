import {
  ActionCreatorWithNonInferrablePayload,
  ActionCreatorWithoutPayload,
  Reducer,
} from "@reduxjs/toolkit";
import { createStore, Store, AnyAction } from "redux";

import Testeranto from "testeranto/src/Node";
import { ITestImplementation, ITestSpecification, ITTestShape, Modify } from "testeranto/src/core";

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
  Testeranto(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeEach: (
        subject: any, //Reducer<any, AnyAction>,
        initializer: any,
        art: any,
        tr: any,
        initialValues
      ): Promise<Store<any, AnyAction>> => {
        return createStore<IStoreShape, any, any, any>(subject.reducer, initializer()(initialValues));
      },
      andWhen: async function (store: Store<any, AnyAction>, actioner): Promise<any> {
        const a = actioner;
        store.dispatch(a[0](a[1]));
        return await store;
      },
      butThen: function (store: Store<any, AnyAction>, assertion): Promise<IStoreShape> {
        const state = store.getState();
        const t = assertion(state);
        t[0](t[1], t[2], t[3]);
        return state
      },
    }
  )
