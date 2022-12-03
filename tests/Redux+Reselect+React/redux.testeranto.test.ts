import { createStore, Store, AnyAction, PreloadedState } from "redux";
import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  Testeranto,
} from "../../index";

export default <IState, ISS, IGS, IWS, ITS, ICS>(
  store,
  tests: (
    Suite: Record<
      keyof ISS,
      (
        name: string,
        givens: BaseGiven<
          any,
          Store<IState, AnyAction>,
          Store<IState, AnyAction>
        >[],
        checks: BaseCheck<any, any, any>[]
      ) => BaseSuite<any, Store<IState, AnyAction>, Store<IState, AnyAction>>
    >,
    Given: Record<
      keyof IGS,
      (
        featureReduxTook: string,
        whens: BaseWhen<Store<IState, AnyAction>>[],
        thens: BaseThen<Store<IState, AnyAction>>[],
        ...zxy: any //{ [ISuite in keyof IGS]: IGS[ISuite] }[]
      ) => BaseGiven<any, Store<IState, AnyAction>, Store<IState, AnyAction>>
    >,
    When: Record<keyof IWS, any>,
    Then: Record<keyof ITS, any>,

    Check: Record<
      keyof ICS,
      (
        feature: string,
        callback: (whens, thens) => any
        // ...xtraArgsForGiven: any //{ [ISuite in keyof IGS]: IGS[ISuite] }[]
      ) => BaseCheck<any, Store<IState, AnyAction>, Store<IState, AnyAction>>
    >
  ) => BaseSuite<any, Store<IState, AnyAction>, Store<IState, AnyAction>>[]
) =>
  Testeranto<
    Store<IState, AnyAction>,
    Store<IState, AnyAction>,
    IState,
    IState,
    ISS,
    IGS,
    IWS,
    ITS,
    ICS
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
        // console.log(actioner());
        // const action = actioner();
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
    class ReduxThen<
      IStore extends Store<IState, AnyAction>,
      IState
    > extends BaseThen<IState> {
      butThen(store: IStore): IState {
        return store.getState();
      }
    },

    class ReduxCheck extends BaseCheck<
      Store<IState, AnyAction>,
      Store<IState, AnyAction>,
      IState
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
    }
  );
