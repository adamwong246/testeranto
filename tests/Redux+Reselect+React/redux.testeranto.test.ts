import { createStore, Store, AnyAction, PreloadedState } from "redux";
import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  Testeranto,
} from "../../index";

export default <
  IStore extends Store<IState, AnyAction>,
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
        givens: BaseGiven<any, IStore, IStore>[],
        checks: BaseCheck<any, any, any>[]
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
    IStore,
    IState,
    IStore,
    ISS,
    IGS,
    IWS,
    ITS,
    ICheckExtensions
  >(
    store,
    /* @ts-ignore:next-line */
    tests,
    class ReduxSuite<
      IStore extends Store<IState, AnyAction>,
      IState
    > extends BaseSuite<IStore, IState, IState> {},

    class ReduxGiven<
      IStore extends Store<IState, AnyAction>,
      IState
    > extends BaseGiven<IStore, IStore, IState> {
      constructor(
        name: string,
        whens: BaseWhen<IStore>[],
        thens: BaseThen<any>[],
        initialValues: PreloadedState<any>
      ) {
        super(name, whens, thens);
        this.initialValues = initialValues;
      }

      initialValues: PreloadedState<any>;

      givenThat(subject) {
        return createStore<any, any, any, any>(subject, this.initialValues);
      }
    },

    class ReduxWhen<IStore> extends BaseWhen<IStore> {
      payload?: any;

      constructor(name: string, actioner: (...any) => any, payload?: any) {
        super(name, (store) => actioner[0](actioner[1]));
        this.payload = payload;
      }

      andWhen(store, actioner) {
        return store.dispatch(actioner(store));
      }
    },
    class ReduxThen<
      IStore extends Store<IState, AnyAction>,
      IState
    > extends BaseThen<IState> {
      butThen(store: IStore): IState {
        return store.getState();
      }
    },

    class ReduxCheck extends BaseCheck<IStore, IStore, IState> {
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
    }
  );
