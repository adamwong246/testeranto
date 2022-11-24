import { createStore, Store, AnyAction, PreloadedState } from "redux";
import {
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  Testeranto,
} from "../../index";

type ISimpleThensForRedux<IThens> = {
  [IThen in keyof IThens]: (
    /* @ts-ignore:next-line */
    ...xtras: IThens[IThen]
  ) => any;
};

export default <
  IStore extends Store<IState, AnyAction>,
  IState,
  ISS,
  IGS,
  IWS,
  ITS
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
    Then: Record<keyof ITS, any>
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
    ISimpleThensForRedux<ITS>
  >(
    store,
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
        feature: string,
        initialValues: PreloadedState<any>
      ) {
        super(name, whens, thens, feature);
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
        store.dispatch(actioner(store));
      }
    },
    class ReduxThen<
      IStore extends Store<IState, AnyAction>,
      IState
    > extends BaseThen<IState> {
      butThen(store: IStore): IState {
        return store.getState();
      }
    }
  );
