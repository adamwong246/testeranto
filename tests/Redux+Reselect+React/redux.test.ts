
import { createStore, Store, AnyAction, PreloadedState } from "redux";
import { TesterantoGiven, TesterantoSuite, TesterantoThen, TesterantoWhen } from '../../index';


export class Suite<
  IStore extends Store<IState, AnyAction>,
  IState,
> extends TesterantoSuite<IStore, IStore, IState> {
}

export class Given<
  IStore extends Store<IState, AnyAction>,
  IState,
> extends TesterantoGiven<
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


export class When extends TesterantoWhen<any> {
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
> extends TesterantoThen<IState> {

  then(store: IStore): IState {
    return store.getState();
  }

};


// export class Given<
//   IState,
//   IStore extends Store<IState, AnyAction>
// > {
//   // name: string;
//   // whens: When<IState, IStore>[];
//   // thens: Then<IState>[];
//   // initialValues: PreloadedState<IState>;
//   // feature: string;
//   // constructor(
//   //   name: string,
//   //   whens: When<IState, IStore>[],
//   //   thens: Then<IState>[],
//   //   initialValues: PreloadedState<IState>,
//   //   feature: string
//   // ) {
//   //   this.name = name;
//   //   this.whens = whens;
//   //   this.thens = thens;
//   //   this.initialValues = initialValues;
//   //   this.feature = feature;
//   // }

//   // run(reducer: (s, a) => any) {
//   //   console.log(`\n - ${this.feature} - \n\nGiven: ${this.name}`)
//   //   const store = createStore<IState, any, any, any>(reducer, this.initialValues);

//   //   this.whens.forEach((when) => {
//   //     when.run(store);
//   //   });

//   //   this.thens.forEach((then) => {
//   //     then.run(store);
//   //   });
//   // }
// }

// export class When<
//   IState,
//   IStore extends Store<IState, AnyAction>
// > {
//   name: string;
//   actionCreator: (x: any) => any;
//   payload: object;
//   constructor(
//     name: string,
//     actionCreator: (x) => any,
//     payload: any = {}
//   ) {
//     this.name = name;
//     this.actionCreator = actionCreator;
//     this.payload = payload;
//   }

//   run(store: IStore) {
//     console.log(" When:", this.name);
//     const action: AnyAction = this.actionCreator(this.payload);
//     store.dispatch(action);
//   }
// };

// export class Then<
//   IState,
// > {
//   name: string;
//   callback: (storeState: IState) => void;

//   constructor(
//     name: string,
//     callback: (val: IState) => void
//   ) {
//     this.name = name;
//     this.callback = callback;
//   }

//   run(store: Store<IState, AnyAction>) {
//     console.log(" Then:", this.name)
//     this.callback(store.getState())
//   }
// };
