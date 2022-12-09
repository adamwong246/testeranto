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

type IThenShape<IX> = [
  (expected: IX, actual: IX, message?: string) => void,
  IX,
  IX,
  string?
];

export type ISubjectReducerAndSelectorAnStore<ST> = {
  reducer: Reducer<ST, AnyAction>;
  selector: Selector<ST, any>;
  store: Store<ST, any>;
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
  IThenShape<unknown>,
  never,
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
      testSpecification,
      thing,

      (s, g, c) =>
        new (class Suite<
          ISubjectReducerAndSelector,
          IStore,
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
        new (class Given<IStore extends Store, ISelection> extends BaseGiven<
          ISubjectReducerAndSelector,
          IStore,
          ISelection,
          IThenShape<unknown>
        > {
          initialValues: any;

          constructor(
            name: string,
            whens: BaseWhen<IStore, ISelection, IThenShape<unknown>>[],
            thens: BaseThen<ISelection, IStore, IThenShape<unknown>>[],
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
        })(f, w, t, z),
      (s, o) =>
        new (class When extends BaseWhen<
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
        })(s, o),

      (s, o) =>
        new (class Then<ISelection> extends BaseThen<
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
        })(s, o),

      (f, g, c, cb, z?) =>
        new (class Check<IStore extends Store, ISelected> extends BaseCheck<
          ISubjectReducerAndSelector,
          IStore,
          ISelected,
          IThenShape<unknown>
        > {
          initialValues: PreloadedState<any>;

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
        })(f, g, c, cb, z)
    );
  }
}
