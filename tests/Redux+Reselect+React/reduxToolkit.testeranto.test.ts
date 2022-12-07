import {
  ActionCreatorWithNonInferrablePayload,
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  Reducer,
  Selector,
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
  Testeranto,
} from "../../index";

export type IActionCreate =
  | ActionCreatorWithoutPayload<string>
  | ActionCreatorWithPayload<any, string>;

export type ISubjectReducerAndSelector = {
  reducer: Reducer<any, AnyAction>;
  selector: Selector<any, any>;
};

type IAction = [
  (
    | ActionCreatorWithNonInferrablePayload<string>
    | ActionCreatorWithoutPayload<string>
  ),
  (object | string)?
];

export type ISubjectReducerAndSelectorAnStore = {
  reducer: Reducer<any, AnyAction>;
  selector: Selector<any, any>;
  store: Store<any, any>;
};

type IInput = { reducer: Reducer };

class Suite<
  ISubjectReducerAndSelector,
  IStore extends Store,
  ISelected
> extends BaseSuite<IInput, ISubjectReducerAndSelector, IStore, ISelected> {}

class Given<IStore extends Store, ISelected> extends BaseGiven<
  ISubjectReducerAndSelector,
  IStore,
  ISelected
> {
  initialValues: any;

  constructor(
    name: string,
    whens: BaseWhen<IStore>[],
    thens: BaseThen<ISelected, IStore>[],
    // features: BaseFeature[],
    initialValues: any
  ) {
    super(
      name,
      whens,
      thens
      // features
    );
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
}

class When extends BaseWhen<any> {
  payload?: any;

  constructor(name: string, action: IActionCreate, payload?: any) {
    const a = action(payload);
    const actionCreator = a[0];
    const expectation = a[1];
    super(name, (store) => actionCreator(expectation));
    this.payload = payload;
  }

  andWhen(subject, actioner) {
    return subject.store.dispatch(actioner());
  }
}

class Then<ISelected> extends BaseThen<ISelected, Store> {
  constructor(name: string, callback: (val: ISelected) => any) {
    super(name, callback);
  }

  butThen(subject: ISubjectReducerAndSelectorAnStore): ISelected {
    return subject.selector(subject.store.getState());
  }
}

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

type IInputshape<IStore, ISelect> = {
  reducer: Reducer;
  selector: (state: IStore) => ISelect;
};

export class ReduxToolkitTesteranto<
  IStoreShape,
  ISelection,
  IState,
  ITestShape
> extends Testeranto<
  ITestShape,
  IStoreShape,
  IStoreShape,
  IStoreShape,
  IStoreShape,
  IAction,
  never,
  IInputshape<IStoreShape, ISelection>
> {
  constructor(
    testImplementation: ITestImplementation<IStoreShape, IStoreShape, IAction>,
    testSpecification,
    thing: IInputshape<IStoreShape, ISelection>
  ) {
    super(
      testImplementation,
      testSpecification,
      thing,
      (s, g, c) => new Suite(s, g, c),
      (f, w, t, z) => new Given(f, w, t, z),
      (s, o) => new When(s, o),
      (s, o) => new Then(s, o),
      (f, g, c, cb, z?) => new Check(f, g, c, cb, z)
    );
  }
}
