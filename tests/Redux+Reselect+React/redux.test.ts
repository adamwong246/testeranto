
import { Store, AnyAction, PreloadedState } from "redux";
import { BaseGiven, BaseSuite, BaseThen, BaseWhen } from '../../index';

export class Suite<
  IStore extends Store<IState, AnyAction>,
  IState,
> extends BaseSuite<IStore, IStore, IState> {
}

export class Given<
  IStore extends Store<IState, AnyAction>,
  IState,
> extends BaseGiven<
  IStore,
  IStore,
  IState
> {
  constructor(
    name: string,
    whens: When[],
    thens: Then<any, any>[],
    feature: string,
    initialValues: PreloadedState<any>,
  ) {
    super(name, whens, thens, feature);
    this.initialValues = initialValues;
  }

  initialValues: PreloadedState<any>;

  given(subject) {
    // console.log(subject, this.initialValues)
    return subject;  //createStore<any, any, any, any>(subject, this.initialValues)
  }
}

export class When extends BaseWhen<any> {
  payload: any;

  constructor(
    name: string,
    actioner: any,
    payload?: any
  ) {
    super(
      name,
      (store) => actioner(payload)
    );
    this.payload = payload;
  }

  when(store, actioner) {
    return store.dispatch(actioner());
  }

};

export class Then<
  IStore extends Store<IState, AnyAction>,
  IState,
> extends BaseThen<IState> {

  then(store: IStore): IState {
    return store.getState();
  }

};
