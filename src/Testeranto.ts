import { mapValues } from "lodash";
import {
  BaseGiven,
  BaseSuite,
  BaseWhen,
  BaseThen,
} from "./base/level0/AbstractClasses";
import { TesterantoBasic } from "./base/level1/TesterantoBasic";
import {
  ISimpleWhens,
  ISimpleSuites,
  ISimpleGivens,
  ISimpleThens,
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
  IThenShape
>(
  store: ISubject,
  tests: (
    s: Record<
      keyof ISS,
      (
        name: string,
        givens: BaseGiven<any, any, any>[]
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
    t: IThenShape
  ) => BaseSuite<any, any, any>[],
  CSuite,
  CGiven,
  CWhen,
  CThen
) => {
  return {
    run: (
      suites: ISimpleSuites<ISS>,
      givens: ISimpleGivens<IGS, IState>,
      whens: ISimpleWhens<IWS, IStore>,
      thens: ISimpleThens<ITS, ISelection>
    ) => {
      const classySuites = mapValues(suites as any, (suite) => {
        return (somestring, givens) => {
          return new CSuite(somestring, givens);
        };
      }) as unknown as {
        [K in keyof ISS]: (
          name: string,
          somestring: string,
          givens: BaseGiven<any, any, any>[]
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
          return (expected?: any) => {
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

      class MetaTesteranto<
        ISubject,
        IState,
        ISelection,
        SuiteExtensions,
        GivenExtensions,
        WhenExtensions,
        ThenExtensions
      > extends TesterantoBasic<
        ISubject,
        IState,
        ISelection,
        SuiteExtensions,
        GivenExtensions,
        WhenExtensions,
        ThenExtensions
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
        }
        /* @ts-ignore:next-line */
      >(store, classySuites, classyGivens, classyWhens, classyThens);
      tests(
        testerano.Suites(),
        testerano.Given(),
        testerano.When(),
        /* @ts-ignore:next-line */
        testerano.Then()
      ).forEach((suite) => {
        suite.test(store);
      });
    },
  };
};
