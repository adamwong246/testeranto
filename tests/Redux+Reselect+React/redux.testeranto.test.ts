import {
  ActionCreatorWithNonInferrablePayload,
  ActionCreatorWithoutPayload,
  Reducer,
  Slice,
} from "@reduxjs/toolkit";

import { createStore, Store, AnyAction, PreloadedState } from "redux";
import {
  BaseCheck,
  BaseFeature,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  Testeranto,
} from "../../index";
import { ITestImplementation, ITestSpecification, ITTestShape } from "../../src/testShapes";
import { IStoreState } from "./app";

type ITestResource = never;

type IWhenShape = [
  (
    | ActionCreatorWithNonInferrablePayload<string>
    | ActionCreatorWithoutPayload<string>
  ),
  (object | string)?
];
type IThenShape = any;

type IZ<IS> = Store<IS, AnyAction>;

type IInput = Reducer<IStoreState, AnyAction>;

type ISelection<I> = I;
type IState<I> = I;
type IStore<I> = I;
type ISubject<I> = I;

export class ReduxTesteranto<
  IStoreShape,
  ITestShape extends ITTestShape
> extends Testeranto<
  ITestShape,
  IState<IStoreShape>,
  ISelection<IStoreShape>,
  IStore<IStoreShape>,
  ISubject<IStoreShape>,
  IWhenShape,
  IThenShape,
  ITestResource,
  IInput
> {
  constructor(
    testImplementation: ITestImplementation<
      IState<IStoreShape>,
      ISelection<IStoreShape>,
      IWhenShape,
      IThenShape,
      ITestShape
    >,
    testSpecification: ITestSpecification<ITestShape>,
    thing: IInput
  ) {
    super(
      testImplementation,
      /* @ts-ignore:next-line */
      testSpecification,
      thing,

      (class Suite<IStore, IState> extends BaseSuite<IInput, IStore, IState, IState, IThenShape> { }),

      class Given<
        IStore,
        IState
      > extends BaseGiven<IStore, IStore, IState, IThenShape> {
        constructor(
          name: string,
          features: BaseFeature[],
          whens: BaseWhen<IStore, IState, IWhenShape>[],
          thens: BaseThen<IState, IStore, IWhenShape>[],
          initialValues: PreloadedState<any>
        ) {
          super(name, features, whens, thens);
          this.initialValues = initialValues;
        }

        initialValues: PreloadedState<any>;

        givenThat(subject) {
          return createStore<any, any, any, any>(subject, this.initialValues);
        }

      },

      class When<IStore> extends BaseWhen<
        IStore,
        IStoreShape,
        IWhenShape
      > {
        payload?: any;

        constructor(name: string, actioner: (...any) => any, payload?: any) {
          super(name, (store) => {
            const a = actioner();
            return a[0](a[1]);
          });
          this.payload = payload;
        }

        andWhen(store, actioner) {
          return store.dispatch(actioner(store));
        }

      },


      class Then<
        IStore extends IZ<IState>,
        IState
      > extends BaseThen<IState, IStore, IThenShape> {
        butThen(store: IStore):Promise<IState> {
          return new Promise((res) => res(store.getState()));
        }
      },

      class Check<IState> extends BaseCheck<
        IZ<IState>,
        IZ<IState>,
        IState,
        IThenShape
      > {
        initialValues: PreloadedState<any>;

        constructor(
          name: string,
          features: BaseFeature[],
          checkCallback: (a, b) => any,
          whens,
          thens,
          initialValues: any,
        ) {
          super(name, features, checkCallback, whens, thens);
          this.initialValues = initialValues;
        }

        checkThat(reducer) {
          return createStore<any, any, any, any>(reducer, this.initialValues);
        }
      }

    );
  }
}
