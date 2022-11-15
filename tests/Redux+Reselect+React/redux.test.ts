
import { Store, AnyAction, PreloadedState } from "redux";
import { BaseGiven, BaseSuite, BaseThen, BaseWhen, TesterantoBasic } from '../../index';

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
    whens: When<IStore>[],
    thens: Then<any, any>[],
    feature: string,
    initialValues: PreloadedState<any>,
  ) {
    super(name, whens, thens, feature);
    this.initialValues = initialValues;
  }

  initialValues: PreloadedState<any>;

  givenThat(subject) {
    return subject;  //createStore<any, any, any, any>(subject, this.initialValues)
  }
}

export class When<IStore> extends BaseWhen<IStore> {
  payload?: any;

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

  andWhen(store, actioner) {
    return store.dispatch(actioner());
  }

};

export class Then<
  IStore extends Store<IState, AnyAction>,
  IState,
> extends BaseThen<IState> {

  butThen(store: IStore): IState {
    return store.getState();
  }

};

export class Testeranto<
  IStore extends Store<IState, AnyAction>,
  IState,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions
> extends TesterantoBasic<
  IStore,
  IStore,
  IState,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions
> {
};
