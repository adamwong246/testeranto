import { mapValues } from "lodash";
import {
  BaseGiven,
  BaseSuite,
  BaseWhen,
  BaseThen,
  BaseCheck,
} from "./base/level0/AbstractClasses";
import { TesterantoBasic } from "./base/level1/TesterantoBasic";
import {
  ISimpleWhens,
  ISimpleSuites,
  ISimpleGivens,
  ITypeDeTuple,
} from "./shared";

export const Testeranto = <
  IStore,
  ISubject,
  ISelection,
  IState,
  ISS,
  IGS,
  IWS,
  ITS,
  IThenShape,
  ICheckExtensions
>(
  store: ISubject,
  tests: (
    s: Record<
      keyof ISS,
      (
        name: string,
        givens: BaseGiven<any, any, any>[],
        checks: BaseCheck<ISubject, IStore, ISelection>[]
      ) => BaseSuite<any, any, any>
    >,
    g: Record<
      keyof IGS,
      (
        feature: string,
        whensFromGiven: BaseWhen<any>[],
        thensFromGiven: BaseThen<any>[],
        ...xtraArgs: any[]
      ) => BaseGiven<any, any, any>
    >,
    w: ISimpleWhens<IWS, IStore>,
    t: IThenShape,
    check: Record<
      keyof ICheckExtensions,
      (
        feature: string,
        callback: (whens, thens) => any,
        ...xtraArgs: any[]
      ) => BaseCheck<any, any, any>
    >
  ) => BaseSuite<any, any, any>[],
  CSuite,
  CGiven,
  CWhen,
  CThen,
  CCheck: any
) => {
  return {
    thens: (ts): ITypeDeTuple<ITS, IState> => {
      return ts;
    },
    run: async (
      suites: ISimpleSuites<ISS>,
      givens: ISimpleGivens<IGS, IState>,
      whens: ISimpleWhens<IWS, IStore>,
      thens: ITypeDeTuple<ITS, ISelection>,
      checks: any //ISimpleChecks<ICheckExtensions, IState>,
    ) => {
      const classySuites = mapValues(suites as any, (suite) => {
        return (somestring, givens, checks) => {
          return new CSuite(somestring, givens, checks);
        };
      }) as unknown as {
        [K in keyof ISS]: (
          feature: string,
          givens: BaseGiven<any, any, any>[],
          checks: BaseCheck<any, any, any>[]
        ) => BaseSuite<any, any, any>;
      };

      const classyGivens = mapValues(givens as any, (z) => {
        return (somestring, whens, thens, ...xtrasW) => {
          return new CGiven(somestring, whens, thens, somestring, z(...xtrasW));
        };
      }) as unknown as {
        [K in keyof IGS]: (
          name: string,
          whens: BaseWhen<any>[],
          thens: BaseThen<ISelection>[],
          ...xtraArgs: any[]
        ) => BaseGiven<any, any, any>;
      };

      const classyWhens = mapValues(
        whens as any,
        (whEn: (thing, payload?: any) => any) => {
          return (payload?: any) => {
            return new CWhen(
              `${whEn.name}: ${payload && payload.toString()}`,
              whEn(payload)
            );
          };
        }
      ) as unknown as {
        [K in keyof IWS]: (c: IState) => BaseWhen<any>;
      };

      const classyThens = mapValues(
        thens as any,
        (thEn: (klass, ...xtrasE) => void) => {
          return (expected: any, x) => {
            // console.log("mark3 -- ", expected, x);
            return new CThen(
              `${thEn.name}: ${expected && expected.toString()}`,
              thEn(expected)
            );
          };
        }
      ) as unknown as {
        [K in keyof ITS]: (
          selection: IState,
          expectation: any
        ) => BaseThen<ISelection>;
      };

      const classyChecks = mapValues(checks as any, (z) => {
        return (somestring, callback) => {
          return new CCheck(
            somestring,
            callback,
            somestring,
            classyWhens,
            classyThens
          );
        };
      }) as unknown as {
        [K in keyof ICheckExtensions]: (
          feature: string,
          callback: (whens, thens) => any,
          ...xtraArgs: any[]
        ) => BaseCheck<any, any, any>;
      };

      class MetaTesteranto<
        ISubject,
        IState,
        ISelection,
        SuiteExtensions,
        GivenExtensions,
        WhenExtensions,
        ThenExtensions,
        ICheckExtensions
        // IThatExtensions
      > extends TesterantoBasic<
        ISubject,
        IState,
        ISelection,
        SuiteExtensions,
        GivenExtensions,
        WhenExtensions,
        ThenExtensions,
        ICheckExtensions
        // IThatExtensions
      > {}
      const testerano = new MetaTesteranto<
        ISubject,
        IStore,
        IState,
        {
          [K in keyof ISS]: (...any) => BaseSuite<ISubject, IStore, IState>;
        },
        {
          [K in keyof IGS]: (
            feature: string,
            whens: BaseWhen<any>[],
            thens: BaseThen<ISubject>[]
          ) => BaseGiven<IStore, IState, ISelection>;
        },
        {
          [K in keyof IWS]: (...any) => BaseWhen<IStore>;
        },
        {
          [K in keyof ITS]: (...any) => BaseThen<ISubject>;
        },
        {
          [K in keyof ICheckExtensions]: (
            feature: string,
            callback: (whens, thens) => any
          ) => BaseCheck<IStore, IState, ISelection>;
        }
        // {
        //   [K in keyof IThatExtensions]: (...any) => BaseThat<ISubject>;
        // }
      >(
        /* @ts-ignore:next-line */
        store,
        classySuites,
        classyGivens,
        classyWhens,
        classyThens,
        classyChecks
        // classyThats
      );
      for (const suite of tests(
        testerano.Suites(),
        testerano.Given(),
        testerano.When(),
        /* @ts-ignore:next-line */
        testerano.Then(),
        testerano.Check()
        // testerano.That()
      )) {
        return await suite.run(store);
      }
    },
  };
};
