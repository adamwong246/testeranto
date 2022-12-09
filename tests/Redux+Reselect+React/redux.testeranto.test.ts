import {
  ActionCreatorWithNonInferrablePayload,
  ActionCreatorWithoutPayload,
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
  ITestImplementation,
  ITestSpecification,
  ITTestShape,
  Testeranto,
} from "../../index";

type IInput = any;
type IZ<IS> = Store<IS, AnyAction>;
type IThenShape = any;

type IWhenShape = [
  (
    | ActionCreatorWithNonInferrablePayload<string>
    | ActionCreatorWithoutPayload<string>
  ),
  (object | string)?
];

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
  never,
  Slice
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

      (f, g, z?) => {
        return new (class Suite<
          IStore extends IStoreShape,
          IState
        > extends BaseSuite<IInput, IStore, IState, IState, IThenShape> {})(
          f,
          g,
          z
        );
      },

      (n, f, w, t, z?) => {
        return new (class Given<
          IStore extends IZ<IState>,
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
        })(n, f, w, t, z);
      },

      (s, o) => {
        return new (class When<IStore> extends BaseWhen<
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
        })(s, o);
      },

      (s, o) => {
        return new (class Then<
          IStore extends IZ<IState>,
          IState
        > extends BaseThen<IState, IStore, IThenShape> {
          butThen(store: IStore): IState {
            return store.getState();
          }
        })(s, o);
      },

      (n: string, f: BaseFeature[], cb, w, t, z?) => {
        console.log("mark4", n, f, cb, w, t, z)
        return new (class Check<IState> extends BaseCheck<
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
        })(n, f, cb, w, t, z);
      }
    );
  }
}
