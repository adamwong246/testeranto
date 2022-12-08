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
  ITTestShape,
  Testeranto,
} from "../../index";

type IInput = Slice;

class Suite<IStore extends Store<IState, AnyAction>, IState> extends BaseSuite<
  IInput,
  IStore,
  IState,
  IState
> {}

class Given<IStore extends Store<IState, AnyAction>, IState> extends BaseGiven<
  IStore,
  IStore,
  IState
> {
  constructor(
    name: string,
    whens: BaseWhen<IStore>[],
    thens: BaseThen<IState, IStore>[],
    initialValues: PreloadedState<any>
    // features: BaseFeature[]
  ) {
    super(
      name,
      whens,
      thens
      // features
    );
    this.initialValues = initialValues;
  }

  initialValues: PreloadedState<any>;

  givenThat(subject) {
    return createStore<any, any, any, any>(subject, this.initialValues);
  }
}

class When<IStore> extends BaseWhen<IStore> {
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

class Then<IStore extends Store<IState, AnyAction>, IState> extends BaseThen<
  IState,
  IStore
> {
  butThen(store: IStore): IState {
    return store.getState();
  }
}

class Check<IState> extends BaseCheck<
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

export class ReduxTesteranto<IStoreShape, ITestShape extends ITTestShape> extends Testeranto<
  ITestShape,
  IStoreShape,
  IStoreShape,
  IStoreShape,
  IStoreShape,
  IAction,
  any,
  Slice
> {
  constructor(
    testImplementation: ITestImplementation<
      IStoreShape,
      IStoreShape,
      IAction,
      ITestShape
    >,
    testSpecification,
    thing
  ) {
    super(
      testImplementation,
      testSpecification,
      thing,
      (s, g, c) => new Suite(s, g, c),
      (f, w, t, z?) => new Given(f, w, t, z),
      (s, o) => new When(s, o),
      (s, o) => new Then(s, o),
      (f, g, c, cb, z?) => new Check(f, g, c, cb, z)
    );
  }
}
