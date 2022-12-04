import {
  ActionCreatorWithNonInferrablePayload,
  ActionCreatorWithoutPayload,
} from "@reduxjs/toolkit";
import { createStore, Store, AnyAction, PreloadedState } from "redux";
import {
  BaseCheck,
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  ITestImplementation,
  TesterantoV2,
} from "../../index";

class ReduxSuite<
  IStore extends Store<IState, AnyAction>,
  IState
> extends BaseSuite<IStore, IState, IState> {}

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
}

class ReduxWhen<IStore> extends BaseWhen<IStore> {
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
}

class ReduxThen<
  IStore extends Store<IState, AnyAction>,
  IState
> extends BaseThen<IState> {
  butThen(store: IStore): IState {
    return store.getState();
  }
}

class ReduxCheck<IState> extends BaseCheck<
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

type IAction = [
  (
    | ActionCreatorWithNonInferrablePayload<string>
    | ActionCreatorWithoutPayload<string>
  ),
  (object | string)?
];

export class ReduxTesteranto<IStoreShape, ITestShape> extends TesterantoV2<
  ITestShape,
  IStoreShape,
  IStoreShape,
  IStoreShape,
  IStoreShape,
  IAction
> {
  constructor(
    testImplementation: ITestImplementation<IStoreShape, IStoreShape, IAction>,
    testSpecification,
    thing
  ) {
    super(
      testImplementation,
      testSpecification,
      thing,
      (s, g, c) => new ReduxSuite(s, g, c),
      (f, w, t, z?) => new ReduxGiven(f, w, t, z),
      (s, o) => new ReduxWhen(s, o),
      (s, o) => new ReduxThen(s, o),
      (f, g, c, cb, z?) => new ReduxCheck(f, g, c, cb, z)
    );
  }
}
