import {
  ActionCreatorWithNonInferrablePayload,
  ActionCreatorWithoutPayload,
  Reducer,
} from "@reduxjs/toolkit";
import { createStore, Store, AnyAction } from "redux";

import Testeranto from "testeranto/src/Node";
import { ITestImplementation, ITestSpecification, ITTestShape, Modify } from "testeranto/src/core";

export type WhenShape = [
  (
    | ActionCreatorWithNonInferrablePayload<string>
    | ActionCreatorWithoutPayload<string>
  ),
  (object | string)?
];
export type ThenShape = any;
export type Input = Reducer<any, AnyAction>;

export const ReduxTesteranto = <
  IStoreShape,
  ITestShape extends ITTestShape,
  IFeatureShape,
>(
  testInput: Input,
  testSpecifications: ITestSpecification<ITestShape>,
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
) =>
  Testeranto(
    testInput,
    testSpecifications,
    testImplementations,
    {
      beforeEach: function (
        subject: Reducer<any, AnyAction>,
        initializer: any,
        art: any,
        tr: any,
        initialValues

      ): Promise<Store<any, AnyAction>> {
        return createStore<IStoreShape, any, any, any>(subject, initializer()(initialValues))
      },
      andWhen: async function (store: Store<any, AnyAction>, actioner: any): Promise<Store<any, AnyAction>> {
        const a = actioner;
        store.dispatch(a[0](a[1]));
        return await store;
      },
      butThen: function (store: Store<any, AnyAction>): Promise<IStoreShape> {
        return store.getState();
      },
    }
  )
