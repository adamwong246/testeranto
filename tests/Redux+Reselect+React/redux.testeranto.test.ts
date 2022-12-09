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

type IThenShape = any;
type IWhenShape = any;
type IInput = any; //Slice<IStoreState, { setPassword: (s: IStoreState, b: any) => void; setEmail: (s: IStoreState, b: any) => void; signIn: (s: IStoreState) => void; }, string>.reducer: Reducer<IStoreState, AnyAction>;
type IZ<IS> = Store<IS, AnyAction>;
type IAction = [
  (
    | ActionCreatorWithNonInferrablePayload<string>
    | ActionCreatorWithoutPayload<string>
  ),
  (object | string)?
];

export class ReduxTesteranto<
  IStoreShape,
  ITestShape extends ITTestShape
> extends Testeranto<
  ITestShape,
  IStoreShape,
  IStoreShape,
  IStoreShape,
  IStoreShape,
  IWhenShape,
  IThenShape,
  never,
  Slice
> {
  constructor(
    testImplementation: ITestImplementation<
      IStoreShape,
      IStoreShape,
      IAction,
      IThenShape,
      ITestShape
    >,
    testSpecification: ITestSpecification<ITestShape>,
    thing: IInput
  ) {
    super(
      testImplementation,
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
            whens: BaseWhen<IStore, IState, IAction>[],
            thens: BaseThen<IState, IStore, IAction>[],
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
          IAction
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

      (f, g, c, cb, z?) => {
        return new (class Check<IState> extends BaseCheck<
          IZ<IState>,
          IZ<IState>,
          IState,
          IThenShape
        > {
          initialValues: PreloadedState<any>;

          constructor(
            feature: string,
            callback: (whens, thens) => any,
            whens,
            thens,
            initialValues: PreloadedState<any>
          ) {
            super(feature, callback, whens, thens);
            this.initialValues = initialValues;
          }

          checkThat(reducer) {
            return createStore<any, any, any, any>(reducer, this.initialValues);
          }
        })(f, g, c, cb, z);
      }
    );
  }
}
