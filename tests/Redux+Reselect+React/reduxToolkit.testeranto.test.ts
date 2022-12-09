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
  ITestSpecification,
  ITTestShape,
  Testeranto,
} from "../../index";

type ISubjectReducerAndSelector = {
  reducer: Reducer<any, AnyAction>;
  selector: Selector<any, any>;
};
type ISubjectReducerAndSelectorAnStore<ST> = {
  reducer: Reducer<ST, AnyAction>;
  selector: Selector<ST, any>;
  store: Store<ST, any>;
};

type ITestResource = never;
type IWhenShape = [
  (
    | ActionCreatorWithNonInferrablePayload<string>
    | ActionCreatorWithoutPayload<string>
  ),
  (object | string)?
];
type IThenShape<IX> = [
  (expected: IX, actual: IX, message?: string) => void,
  IX,
  IX,
  string?
];
type IInputshape<IStore, ISelect> = {
  reducer: Reducer;
  selector: (state: IStore) => ISelect;
};
type IState<IX> = IX;
type IStore<IX> = IX;
type ISubject<IX> = IX;

export type IActionCreate =
  | ActionCreatorWithoutPayload<string>
  | ActionCreatorWithPayload<any, string>;

export class ReduxToolkitTesteranto<
  IStoreShape,
  ISelection,
  ITestShape extends ITTestShape
> extends Testeranto<
  ITestShape,
  IState<IStoreShape>,
  ISelection,
  IStore<IStoreShape>,
  ISubject<IStoreShape>,
  IWhenShape,
  IThenShape<unknown>,
  ITestResource,
  IInputshape<IStoreShape, ISelection>
> {
  constructor(
    testImplementation: ITestImplementation<
      IStoreShape,
      ISelection,
      IWhenShape,
      IThenShape<unknown>,
      ITestShape
    >,
    testSpecification: ITestSpecification<ITestShape>,
    thing: IInputshape<IStoreShape, ISelection>
  ) {
    super(
      testImplementation,
      /* @ts-ignore:next-line */
      testSpecification,
      thing,

      class Suite<
        ISubjectReducerAndSelector,
        IStore extends Store,
        ISelected,
        IThenShape
      > extends BaseSuite<
        IInputshape<IStoreShape, ISelection>,
        ISubjectReducerAndSelector,
        IStore,
        ISelected,
        IThenShape
      > {
        test(t: IThenShape): void {
          t[0](t[1], t[2], t[3]);
        }
      },

      class Given<IStore extends Store, ISelection> extends BaseGiven<
        ISubjectReducerAndSelector,
        IStore,
        ISelection,
        IThenShape<unknown>
      > {
        initialValues: any;

        constructor(
          name: string,
          features: BaseFeature[],
          whens: BaseWhen<IStore, ISelection, IThenShape<unknown>>[],
          thens: BaseThen<ISelection, IStore, IThenShape<unknown>>[],
          initialValues: any
        ) {
          super(name, features, whens, thens);
          this.initialValues = initialValues;
        }

        /* @ts-ignore:next-line */
        givenThat(
          subject: ISubjectReducerAndSelector
        ): ISubjectReducerAndSelectorAnStore<IStore> {
          const store = createStore<Reducer<any, AnyAction>, any, any, any>(
            subject.reducer,
            this.initialValues
          );

          return {
            ...subject,
            store,
          };
        }
      },

      class When extends BaseWhen<
        Store,
        ISelection,
        IThenShape<unknown>
      > {
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
      },

      class Then<ISelection> extends BaseThen<
        ISelection,
        Store,
        IThenShape<unknown>
      > {
        constructor(
          name: string,
          callback: (val: ISelection) => IThenShape<unknown>
        ) {
          super(name, callback);
        }

        butThen(
          subject: ISubjectReducerAndSelectorAnStore<IStoreShape>
        ): ISelection {
          return subject.selector(subject.store.getState());
        }
      },

      class Check<IStore extends Store, ISelected> extends BaseCheck<
        ISubjectReducerAndSelector,
        IStore,
        ISelected,
        IThenShape<unknown>
      > {
        initialValues: PreloadedState<any>;

        constructor(
          name: string,
          features: BaseFeature[],
          callback: (whens, thens) => any,
          whens,
          thens,
          z,
        ) {
          super(name, features, callback, whens, thens);
          this.initialValues = z;
        }

        /* @ts-ignore:next-line */
        checkThat(
          subject: ISubjectReducerAndSelector
        ): ISubjectReducerAndSelectorAnStore<IStore> {
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
    );
  }
}
