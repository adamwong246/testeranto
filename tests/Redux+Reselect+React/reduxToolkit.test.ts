
import { ActionCreatorWithoutPayload, ActionCreatorWithPayload, AnyAction, PreloadedState, Reducer, Selector, Store } from "@reduxjs/toolkit";
import { createStore } from "redux";

import { TesterantoGiven, TesterantoSuite, TesterantoThen, TesterantoWhen } from "../../index";

type IActionCreate = ActionCreatorWithoutPayload<string> | ActionCreatorWithPayload<any, string>;

export class Suite<
  ISubject extends Reducer,
  IStore extends Store,
  ISelected extends Selector
> extends TesterantoSuite<ISubject, IStore, ISelected> { }

export class Given<
  ISubject extends Reducer,
  IStore extends Store,
  ISelected extends Selector
> extends TesterantoGiven<
  ISubject,
  IStore,
  ISelected
> {
  constructor(
    name: string,
    whens: When[],
    thens: Then<any, any, any>[],
    feature: string,
    initialValues: PreloadedState<any>,
  ) {
    super(name, whens, thens, feature);
    this.initialValues = initialValues;
  }

  initialValues: PreloadedState<any>;

  given(subject) {
    return createStore<any, any, any, any>(subject, this.initialValues)
  }

}

export class When extends TesterantoWhen<any> {
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

  when(store, actioner) {
    return store.dispatch(actioner());
  }

};

export class Then<
  IState,
  ISelected,
  IStore extends Store<IState, AnyAction>
> extends TesterantoThen<ISelected> {

  selector: Selector<IState, ISelected>;

  constructor(
    name: string,
    callback: (val: ISelected) => any,
    selector: Selector<IState, ISelected>,

  ) {
    super(name, callback);
    this.selector = selector
  }

  then(store: IStore): ISelected {
    return this.selector(store.getState());
  }

};
