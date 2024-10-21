import Testeranto from "testeranto/src/Node";
import {
  ITestImplementation,
  ITestSpecification,
  IBaseTest,
  IPartialInterface,
} from "testeranto/src/Types";

import {
  ActionCreatorWithNonInferrablePayload,
  ActionCreatorWithoutPayload,
  Reducer,
} from "@reduxjs/toolkit";
import { createStore, AnyAction } from "redux";

import { IStoreState } from "../src/app";
import { IAppSpecification } from "../src/app.test";

type WhenShape = [
  (
    | ActionCreatorWithNonInferrablePayload<string>
    | ActionCreatorWithoutPayload<string>
  ),
  (object | string)?
];
type ThenShape = [
  (actual: unknown, expected: unknown, message?: string) => void,
  any,
  any,
  string?
];
type Input<S, T> = {
  reducer: Reducer<any, AnyAction>;
  selector: (state: S) => T;
};

export const ReduxToolkitTesteranto = <
  IStoreShape,
  ISelectionShape,
  ITestShape extends IBaseTest
>(
  testImplementations: ITestImplementation<
    ITestShape,
    {
      givens: {
        [K in keyof IAppSpecification["givens"]]: () => (
          ...Iw: IAppSpecification["givens"][K]
        ) => IStoreState;
      };
      whens: {
        [K in keyof ITestShape["whens"]]: (
          ...Iw: ITestShape["whens"][K]
        ) => WhenShape;
      };
    }
  >,
  testSpecifications: ITestSpecification<ITestShape>,
  testInput: Input<IStoreShape, ISelectionShape>
) => {
  const testInterface: IPartialInterface<ITestShape> = {
    assertThis: (t: IStoreState) => {
      t[0](t[1], t[2], t[3]);
    },
    beforeEach: (subject, initializer, art, tr, initialValues) => {
      return createStore<IStoreShape, any, any, any>(
        subject.reducer,
        initializer()(initialValues)
      );
    },
    andWhen: async function (store, actioner, tr) {
      const a = actioner;
      store.dispatch(a[0](a[1]));
      return store;
    },
    butThen: async function (store, actioner, tr) {
      console.log("args", arguments);
      return actioner(store.getState());
    },
  };

  return Testeranto(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  );
};
