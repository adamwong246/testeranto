import { BaseGiven, BaseCheck, BaseSuite, BaseFeature, BaseWhen, BaseThen } from "../BaseClasses";
import { ITTestShape, ITestImplementation, ITestJob } from "../types";

import { TesterantoLevelZero } from "./level0";

export abstract class TesterantoLevelOne<
  ITestShape extends ITTestShape,
  IInitialState,
  ISelection,
  IStore,
  ISubject,
  IWhenShape,
  IThenShape,
  IInput
> {
  constructor(
    testImplementation: ITestImplementation<
      IInitialState,
      ISelection,
      IWhenShape,
      IThenShape,
      ITestShape
    >,

    testSpecification: (
      Suite: {
        [K in keyof ITestShape["suites"]]: (
          feature: string,
          givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[],
          checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[]
        ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape>;
      },
      Given: {
        [K in keyof ITestShape["givens"]]: (
          name: string,
          features: BaseFeature[],
          whens: BaseWhen<IStore, ISelection, IThenShape>[],
          thens: BaseThen<ISelection, IStore, IThenShape>[],
          ...a: ITestShape["givens"][K]
        ) => BaseGiven<ISubject, IStore, ISelection, IThenShape>;
      },
      When: {
        [K in keyof ITestShape["whens"]]: (
          ...a: ITestShape["whens"][K]
        ) => BaseWhen<IStore, ISelection, IThenShape>;
      },
      Then: {
        [K in keyof ITestShape["thens"]]: (
          ...a: ITestShape["thens"][K]
        ) => BaseThen<ISelection, IStore, IThenShape>;
      },
      Check: {
        [K in keyof ITestShape["checks"]]: (
          name: string,
          features: BaseFeature[],
          cbz: (...any) => Promise<void>
        ) => any;
      }
    ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape>[],

    input: IInput,

    suiteKlasser: (
      name: string,
      givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[],
      checks: BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>[]
    ) =>
      BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape, ITestShape>,
    givenKlasser: (n, f, w, t, z?) =>
      BaseGiven<ISubject, IStore, ISelection, IThenShape>,
    whenKlasser: (s, o) =>
      BaseWhen<IStore, ISelection, IThenShape>,
    thenKlasser: (s, o) =>
      BaseThen<IStore, ISelection, IThenShape>,
    checkKlasser: (n, f, cb, w, t) =>
      BaseCheck<ISubject, IStore, ISelection, IThenShape, ITestShape>,

    testResource

  ) {
    const classySuites = Object.entries(testImplementation.Suites)
      .reduce((a, [key]) => {
        a[key] = (somestring, givens, checks) => {
          return new suiteKlasser.prototype.constructor(somestring, givens, checks);
        };
        return a;
      }, {}
      );

    const classyGivens = Object.entries(testImplementation.Givens)
      .reduce((a, [key, z]) => {
        a[key] = (features, whens, thens, ...xtrasW) => {
          return new givenKlasser.prototype.constructor(z.name, features, whens, thens, z(...xtrasW))
        };
        return a;
      }, {}
      );

    const classyWhens = Object.entries(testImplementation.Whens)
      .reduce((a, [key, whEn]) => {
        a[key] = (payload?: any) => {
          return new whenKlasser.prototype.constructor(
            `${whEn.name}: ${payload && payload.toString()}`,
            whEn(payload)
          )
        };
        return a;
      }, {}
      );

    const classyThens = Object.entries(testImplementation.Thens)
      .reduce((a, [key, thEn]) => {
        a[key] = (expected: any, x) => {
          return new thenKlasser.prototype.constructor(
            `${thEn.name}: ${expected && expected.toString()}`,
            thEn(expected)
          );
        };
        return a;
      }, {}
      );

    const classyChecks = Object.entries(testImplementation.Checks)
      .reduce((a, [key, z]) => {
        a[key] = (somestring, features, callback) => {
          return new checkKlasser.prototype.constructor(somestring, features, callback, classyWhens, classyThens);
        };
        return a;
      }, {}
      );


    const classyTesteranto = new (class <
      IInput,
      ISubject,
      IStore,
      ISelection,
      SuiteExtensions,
      GivenExtensions,
      WhenExtensions,
      ThenExtensions,
      ICheckExtensions,
      IThenShape
    > extends TesterantoLevelZero<
      IInput,
      ISubject,
      IStore,
      ISelection,
      SuiteExtensions,
      GivenExtensions,
      WhenExtensions,
      ThenExtensions,
      ICheckExtensions,
      IThenShape
    > { })(
      input,
      classySuites,
      classyGivens,
      classyWhens,
      classyThens,
      classyChecks
    );

    const suites = testSpecification(
      /* @ts-ignore:next-line */
      classyTesteranto.Suites(),
      classyTesteranto.Given(),
      classyTesteranto.When(),
      classyTesteranto.Then(),
      classyTesteranto.Check()
    );

    const toReturn: ITestJob[] = suites.map((suite) => {
      return {
        test: suite,
        testResource,

        toObj: () => {
          return suite.toObj()
        },

        runner: async (allocatedPorts: number[]) => {
          return suite.run(input, { ports: allocatedPorts });
        },

      };
    });

    return toReturn;
  }
}