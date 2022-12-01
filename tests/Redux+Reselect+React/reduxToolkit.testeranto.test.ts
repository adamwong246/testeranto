import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  AnyAction,
  Reducer,
  Selector,
  Store,
} from "@reduxjs/toolkit";
import { createStore } from "redux";

import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  Testeranto,
} from "../../index";
import { ITypeDeTuple } from "../../src/shared";

export type IActionCreate =
  | ActionCreatorWithoutPayload<string>
  | ActionCreatorWithPayload<any, string>;

export type ISubjectReducerAndSelector = {
  reducer: Reducer<any, AnyAction>;
  selector: Selector<any, any>;
};

export type ISubjectReducerAndSelectorAnStore = {
  reducer: Reducer<any, AnyAction>;
  selector: Selector<any, any>;
  store: Store<any, any>;
};

type ISimplerThens<IThens, Klass> = {
  [IThen in keyof IThens]: (
    // arg0: Klass,
    /* @ts-ignore:next-line */
    ...xtrasQW: IThens[IThen]?
  ) => any;
};

export default <
  IStore extends Store<any, AnyAction>,
  ISelection,
  IState,
  ISS,
  IGS,
  IWS,
  ITS,
  ICheckExtensions
>(
  store,
  tests: (
    Suite: Record<
      keyof ISS,
      (
        name: string,
        givens: BaseGiven<any, IStore, IStore>[]
      ) => BaseSuite<any, IStore, IStore>
    >,
    Given: Record<
      keyof IGS,
      (
        featureReduxTook: string,
        whens: BaseWhen<IStore>[],
        thens: BaseThen<IStore>[],
        ...xtraArgsForGiven: any //{ [ISuite in keyof IGS]: IGS[ISuite] }[]
      ) => BaseGiven<any, IStore, IStore>
    >,
    When: Record<keyof IWS, any>,
    Then: Record<keyof ITS, any>,

    Check: Record<
      keyof ICheckExtensions,
      (
        feature: string,
        callback: (whens, thens) => any
        // ...xtraArgsForGiven: any //{ [ISuite in keyof IGS]: IGS[ISuite] }[]
      ) => BaseCheck<any, IStore, IStore>
    >
  ) => BaseSuite<any, IStore, IStore>[]
) =>
  Testeranto<
    IStore,
    ISubjectReducerAndSelector,
    ISelection,
    IState,
    ISS,
    IGS,
    IWS,
    ITS,
    // ISimplerThens<ITS, IState>,
    ICheckExtensions
  >(
    store,

    /* @ts-ignore:next-line */
    tests,

    class Suite<
      ISubjectReducerAndSelector,
      IStore extends Store,
      ISelected
    > extends BaseSuite<ISubjectReducerAndSelector, IStore, ISelected> {},

    class Given<IStore extends Store, ISelected> extends BaseGiven<
      ISubjectReducerAndSelector,
      IStore,
      ISelected
    > {
      initialValues: any; //PreloadedState<IState>;

      constructor(
        name: string,
        whens: BaseWhen<any>[],
        thens: BaseThen<ISelected>[],
        feature: string,
        initialValues: any
      ) {
        super(name, whens, thens);
        this.initialValues = initialValues;
      }

      /* @ts-ignore:next-line */
      givenThat(
        subject: ISubjectReducerAndSelector
      ): ISubjectReducerAndSelectorAnStore {
        const store = createStore<Reducer<any, AnyAction>, any, any, any>(
          subject.reducer,
          this.initialValues
        );

        return {
          ...subject,
          store,
        };
      }
    },

    class When extends BaseWhen<any> {
      payload?: any;

      constructor(name: string, action: IActionCreate, payload?: any) {
        const actionCreator = action[0];
        const expectation = action[1];
        super(name, (store) => actionCreator(expectation));
        this.payload = payload;
      }

      andWhen(x, actioner) {
        return x.store.dispatch(actioner());
      }
    },
    class Then<ISelected> extends BaseThen<ISelected> {
      constructor(name: string, callback: (val: ISelected) => any) {
        super(name, callback);
      }

      butThen(subject: ISubjectReducerAndSelectorAnStore): ISelected {
        return subject.selector(subject.store.getState());
      }
    },
    ///////////////////////////////////////////
    class Check<IStore extends Store, ISelected> extends BaseCheck<
      ISubjectReducerAndSelector,
      IStore,
      ISelected
    > {
      initialValues: any; //PreloadedState<IState>;

      constructor(
        feature: string,
        callback: (whens, thens) => any,
        whens,
        thens,
        initialValues: any
      ) {
        super(feature, callback, whens, thens);
        this.initialValues = initialValues;
      }

      /* @ts-ignore:next-line */
      checkThat(
        subject: ISubjectReducerAndSelector
      ): ISubjectReducerAndSelectorAnStore {
        const store = createStore<Reducer<any, AnyAction>, any, any, any>(
          subject.reducer,
          this.initialValues
        );

        return {
          ...subject,
          store,
        };
      }
    }
  );
