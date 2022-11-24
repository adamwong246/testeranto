import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  AnyAction,
  Reducer,
  Selector,
  Store,
} from "@reduxjs/toolkit";
import { createStore } from "redux";

import {
  BaseGiven,
  BaseSuite,
  BaseThen,
  BaseWhen,
  TesterantoMetaFactory,
} from "../../index";

export type IActionCreate =
  | ActionCreatorWithoutPayload<string>
  | ActionCreatorWithPayload<any, string>;

export type ISubjectReducerAndSelector = {
  reducer: Reducer<any, AnyAction>;
  selector: Selector<any, any>;
};

export type ISubjectReducerAndSelectorAnStore = {
  reducer: Reducer<any, AnyAction>;
  selector: Selector<any, any>;
  store: Store<any, any>;
};

type ISimplerThens<IThens, Klass> = {
  [IThen in keyof IThens]: (
    // arg0: Klass,
    /* @ts-ignore:next-line */
    ...xtrasQW: IThens[IThen]?
  ) => any;
};

export default <
  IStore extends Store<any, AnyAction>,
  ISelection,
  IState,
  ISS,
  IGS,
  IWS,
  ITS
>(
  store,
  tests
) =>
  TesterantoMetaFactory<
    IStore,
    ISubjectReducerAndSelector,
    ISelection,
    IState,
    ISS,
    IGS,
    IWS,
    ITS,
    ISimplerThens<ITS, IState>
  >(
    store,
    tests,
    class Suite<
      ISubjectReducerAndSelector,
      IStore extends Store,
      ISelected
    > extends BaseSuite<ISubjectReducerAndSelector, IStore, ISelected> {},

    class Given<IStore extends Store, ISelected> extends BaseGiven<
      ISubjectReducerAndSelector,
      IStore,
      ISelected
    > {
      initialValues: any; //PreloadedState<IState>;

      constructor(
        name: string,
        whens: BaseWhen<any>[],
        thens: BaseThen<ISelected>[],
        feature: string,
        initialValues: any
      ) {
        super(name, whens, thens, feature);
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
    },
    class When extends BaseWhen<any> {
      payload?: any;

      constructor(name: string, action: IActionCreate, payload?: any) {
        const actionCreator = action[0];
        const expectation = action[1];
        super(name, (store) => actionCreator(expectation));
        this.payload = payload;
      }

      andWhen(x, actioner) {
        return x.store.dispatch(actioner());
      }
    },
    class Then<ISelected> extends BaseThen<ISelected> {
      constructor(name: string, callback: (val: ISelected) => any) {
        super(name, callback);
      }

      butThen(subject: ISubjectReducerAndSelectorAnStore): ISelected {
        return subject.selector(subject.store.getState());
      }
    }
  );

// export class ReduxToolkitTesteranto<
//   ISubjectReducerAndSelectorAnStore,
//   IState,
//   ISelection,
//   SuiteExtensions,
//   GivenExtensions,
//   WhenExtensions,
//   ThenExtensions
// > extends TesterantoBasic<
//   ISubjectReducerAndSelectorAnStore,
//   IState,
//   ISelection,
//   SuiteExtensions,
//   GivenExtensions,
//   WhenExtensions,
//   ThenExtensions
// > {}

// type ISimpleSuites<ISuites> = {
//   [ISuite in keyof ISuites]: string;
// };

// type ISimpleGivens<IGivens, Klass> = {
//   [IGiven in keyof IGivens]: (
//     /* @ts-ignore:next-line */
//     ...arg0: IGivens[IGiven]
//   ) => Klass;
// };

// type ISimpleWhens<IWhens, Klass> = {
//   [IWhen in keyof IWhens]: (
//     /* @ts-ignore:next-line */
//     ...arg0: IWhens[IWhen]
//   ) => any;
// };

// type ISimpleThens<IThens, Klass> = {
//   [IThen in keyof IThens]: (
//     arg0: Klass,
//     /* @ts-ignore:next-line */
//     ...xtrasQ: IThens[IThen]
//   ) => any;
// };

// type ISimplerThens<IThens, Klass> = {
//   [IThen in keyof IThens]: (
//     // arg0: Klass,
//     /* @ts-ignore:next-line */
//     ...xtrasQW: IThens[IThen]?
//   ) => any;
// };

// // export const ReduxToolkitTesterantoFactory = <
// //   IStore extends Store<IState, AnyAction>,
// //   IState,
// //   ISelection,
// //   ISS,
// //   IGS,
// //   IWS,
// //   ITS
// // >(
// //   store: ISubjectReducerAndSelector,
// //   tests: (
// //     s: Record<
// //       keyof ISS,
// //       (
// //         name: string,
// //         givens: Given<IStore, IState>[]
// //       ) => Suite<ISubjectReducerAndSelector, IStore, ISelection>
// //     >,
// //     g: Record<
// //       keyof IGS,
// //       (
// //         feature: string,
// //         whensFromGiven: When[],
// //         thensFromGiven: Then<ISelection>[],
// //         ...xtraArgs: any[]
// //       ) => Given<IStore, IState>
// //     >,
// //     w: ISimpleWhens<IWS, IStore>,
// //     t: ISimplerThens<ITS, IState>
// //   ) => Suite<ISubjectReducerAndSelector, IStore, ISelection>[]
// // ) => {
// //   return {
// //     run: (
// //       suites: ISimpleSuites<ISS>,
// //       givens: ISimpleGivens<IGS, IState>,
// //       whens: ISimpleWhens<IWS, IStore>,
// //       thens: ISimpleThens<ITS, ISelection>
// //     ) => {
// //       const classySuites = mapValues(suites as any, (suite) => {
// //         return (somestring, givens) => {
// //           return new Suite(somestring, givens);
// //         };
// //       }) as unknown as {
// //         [K in keyof ISS]: (
// //           name: string,
// //           somestring: string,
// //           givens: Given<IStore, IState>[]
// //         ) => Suite<ISubjectReducerAndSelector, IStore, ISelection>;
// //       };

// //       const classyGivens = mapValues(givens as any, (z) => {
// //         return (somestring, whens, thens, ...xtrasW) => {
// //           return new Given<IStore, IState>(
// //             somestring,
// //             whens,
// //             thens,
// //             somestring,
// //             z(...xtrasW)
// //           );
// //         };
// //       }) as unknown as {
// //         [K in keyof IGS]: (
// //           name: string,
// //           whens: When[],
// //           thens: Then<ISelection>[],
// //           ...xtraArgs: any[]
// //         ) => Given<IStore, IState>;
// //       };

// //       const classyWhens = mapValues(
// //         whens as any,
// //         (testHookImplementation: (payload: any) => any) => {
// //           return (payload?: any) => {
// //             return new When(
// //               `${testHookImplementation.name}: ${
// //                 payload && payload.toString()
// //               }`,
// //               testHookImplementation(payload)
// //             );
// //           };
// //         }
// //       ) as unknown as {
// //         [K in keyof IWS]: (c: IState) => When;
// //       };

// //       const classyThens = mapValues(
// //         thens as any,
// //         (thEn: (klass, ...xtrasE) => void) => {
// //           return (expected?: any) => {
// //             console.log(expected, thEn);
// //             return new Then(
// //               `${thEn.name}: ${expected && expected.toString()}`,
// //               (rectangle) => thEn(rectangle, expected)
// //             );
// //           };
// //         }
// //       ) as unknown as {
// //         [K in keyof ITS]: (
// //           selection: IState,
// //           expectation: any
// //         ) => Then<ISelection>;
// //       };

// //       const testerano = new ReduxToolkitTesteranto<
// //         ISubjectReducerAndSelector,
// //         IStore,
// //         IState,
// //         {
// //           [K in keyof ISS]: (
// //             ...any
// //           ) => Suite<ISubjectReducerAndSelector, IStore, IState>;
// //         },
// //         {
// //           [K in keyof IGS]: (
// //             feature: string,
// //             whens: When[],
// //             thens: Then<ISubjectReducerAndSelector>[]
// //           ) => Given<IStore, IState>;
// //         },
// //         {
// //           [K in keyof IWS]: (...any) => When;
// //         },
// //         {
// //           [K in keyof ITS]: (...any) => Then<ISubjectReducerAndSelector>;
// //         }
// //         /* @ts-ignore:next-line */
// //       >(store, classySuites, classyGivens, classyWhens, classyThens);

// //       tests(
// //         /* @ts-ignore:next-line */
// //         testerano.Suites(),
// //         testerano.Given(),
// //         testerano.When(),
// //         testerano.Then()
// //       ).forEach((test) => {
// //         test.test(store);
// //       });
// //     },
// //   };
// // };
