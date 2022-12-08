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
  ITTestShape,
  Testeranto,
} from "../../index";

export type IActionCreate =
  | ActionCreatorWithoutPayload<string>
  | ActionCreatorWithPayload<any, string>;

export type ISubjectReducerAndSelector = {
  reducer: Reducer<any, AnyAction>;
  selector: Selector<any, any>;
};

type IWhenShape = [
  (
    | ActionCreatorWithNonInferrablePayload<string>
    | ActionCreatorWithoutPayload<string>
  ),
  (object | string)?
];

type IThenShape = [(expected, actual, message?: string) => void, any, any, string?];

export type ISubjectReducerAndSelectorAnStore = {
  reducer: Reducer<any, AnyAction>;
  selector: Selector<any, any>;
  store: Store<any, any>;
};

type IInput = { reducer: Reducer };

type IInputshape<IStore, ISelect> = {
  reducer: Reducer;
  selector: (state: IStore) => ISelect;
};

export class ReduxToolkitTesteranto<
  IStoreShape,
  ISelection,
  ITestShape extends ITTestShape
> extends Testeranto<
  ITestShape,
  IStoreShape,
  ISelection,
  IStoreShape,
  IStoreShape,
  IWhenShape,
  IThenShape,
  never,
  IInputshape<IStoreShape, ISelection>
> {
  constructor(
    testImplementation: ITestImplementation<
      IStoreShape,
      ISelection,
      IWhenShape,
      IThenShape,
      ITestShape
    >,
    testSpecification,
    thing: IInputshape<IStoreShape, ISelection>
  ) {
    super(
      testImplementation,
      testSpecification,
      thing,

      (s, g, c) =>
        new (class Suite<
          ISubjectReducerAndSelector,
          IStore extends Store,
          ISelected,
          IThenShape
        > extends BaseSuite<
          IInput,
          ISubjectReducerAndSelector,
          IStore,
          ISelected,
          IThenShape
        > {
          test(t: IThenShape): void {
            t[0](t[1], t[2], t[3]);
          }
        })(s, g, c),

      (f, w, t, z) =>
        new (class Given<IStore extends Store, ISelected> extends BaseGiven<
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
        })(f, w, t, z),
      (s, o) =>
        new (class When extends BaseWhen<any> {
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
        })(s, o),

      (s, o) =>
        new (class Then<ISelection> extends BaseThen<ISelection, Store> {
          constructor(name: string, callback: (val: ISelection) => any) {
            super(name, callback);
          }

          butThen(subject: ISubjectReducerAndSelectorAnStore): ISelection {
            return subject.selector(subject.store.getState());
          }
        })(s, o),

      (f, g, c, cb, z?) =>
        new (class Check<IStore extends Store, ISelected> extends BaseCheck<
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
        })(f, g, c, cb, z)
    );
  }
}
