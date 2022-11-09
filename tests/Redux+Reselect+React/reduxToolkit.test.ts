
import { ActionCreatorWithoutPayload, ActionCreatorWithPayload, AnyAction, Reducer, Selector, Store } from "@reduxjs/toolkit";
import { createStore } from "redux";

import { BaseGiven, BaseSuite, BaseThen, BaseWhen } from "../../index";

type IActionCreate = ActionCreatorWithoutPayload<string> | ActionCreatorWithPayload<any, string>;

type ISubjectReducerAndSelector = {
  reducer: Reducer<any, AnyAction>,
  selector: Selector<any, any>
};

type ISubjectReducerAndSelectorAnStore = {
  reducer: Reducer<any, AnyAction>,
  selector: Selector<any, any>,
  store: Store<any, any>
};

export class Suite<
  ISubjectReducerAndSelector,
  IStore extends Store,
  ISelected extends Selector
> extends BaseSuite<ISubjectReducerAndSelector, IStore, ISelected> { }

export class Given<
  IStore extends Store,
  ISelected,
> extends BaseGiven<
  ISubjectReducerAndSelector,
  IStore,
  ISelected
> {

  initialValues: any; //PreloadedState<IState>;

  constructor(
    name: string,
    whens: When[],
    thens: Then<ISelected>[],
    feature: string,
    initialValues: any,
  ) {
    super(name, whens, thens, feature);
    this.initialValues = initialValues;
  }

  given
    (subject: ISubjectReducerAndSelector):
    any {
    const store = createStore<
      Reducer<any, AnyAction>,
      any, any, any
    >(subject.reducer, this.initialValues);

    return {
      ...subject,
      store
    };
  }

}

export class When extends BaseWhen<any> {
  payload: any;

  constructor(
    name: string,
    action: IActionCreate,
    payload?: any
  ) {
    super(
      name,
      (store) => action(payload)
    );
    this.payload = payload;
  }

  when(x, actioner) {
    return x.store.dispatch(actioner());
  }

};

export class Then<
  ISelected,
> extends BaseThen<ISelected> {
  constructor(
    name: string,
    callback: (val: ISelected) => any,
  ) {
    super(name, callback);
  }

  then(subject: ISubjectReducerAndSelectorAnStore): ISelected {
    return subject.selector(subject.store.getState());
  }

};
