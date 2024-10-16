import {
  ActionCreatorWithNonInferrablePayload,
  ActionCreatorWithoutPayload,
  PreloadedState,
  Reducer,
} from "@reduxjs/toolkit";
import { createStore, Store, AnyAction } from "redux";

import Testeranto from "testeranto/src/Node";
import { IPartialInterface, ITestInterface } from "testeranto/src/Types";
import {
  ITestImplementation, ITestSpecification, IBaseTest,
} from "testeranto/src/Types";

type t = (
  | ActionCreatorWithNonInferrablePayload<string>
  | ActionCreatorWithoutPayload<string>
)

type tt = (t: (
  | ActionCreatorWithNonInferrablePayload<string>
  | ActionCreatorWithoutPayload<string>
)) => any;

export type WhenShape = [
  tt,
  t
];
export type ThenShape = number;

export const ReduxTesteranto = <
  IStoreShape,
  ITestShape extends IBaseTest,
>(
  testInput: Reducer<IStoreShape, AnyAction>,
  testSpecifications: ITestSpecification<ITestShape>,
  testImplementations: ITestImplementation<ITestShape, {
    Whens: {
      [K in keyof ITestShape["whens"]]: (
        ...Iw: ITestShape["whens"][K]
      ) => WhenShape;
    }
  }>
  // testImplementations: Modify<ITestImplementation<
  //   IStoreShape,
  //   IStoreShape,
  //   WhenShape,
  //   ThenShape,
  //   ITestShape
  // >, {
  //   Whens: {
  //     [K in keyof ITestShape["whens"]]: (
  //       ...Iw: ITestShape["whens"][K]
  //     ) => WhenShape;
  //   }
  // }>,
) => {
  const testInterface: IPartialInterface<ITestShape> = {
    beforeEach: function (
      subject,
      initializer,
      art,
      tr,
      initialValues

    ) {
      return createStore<IStoreShape, any, any, any>(subject, initializer()(initialValues))
    },
    andWhen: async function (
      store,
      whenCB,
    ) {
      const a = whenCB;
      store.dispatch(a[0](a[1]));
      return store;
    },
    butThen: async function (store) {
      return store.getState();
    },
  };

  return Testeranto(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface,
  );
}