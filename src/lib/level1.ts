import { mapValues } from "lodash";

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
          checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[]
        ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>;
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
    ) => BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>[],

    input: IInput,

    suiteKlasser: (
      name: string,
      givens: BaseGiven<ISubject, IStore, ISelection, IThenShape>[],
      checks: BaseCheck<ISubject, IStore, ISelection, IThenShape>[]
    ) =>
      BaseSuite<IInput, ISubject, IStore, ISelection, IThenShape>,
    givenKlasser: (n, f, w, t, z?) =>
      BaseGiven<ISubject, IStore, ISelection, IThenShape>,
    whenKlasser: (s, o) =>
      BaseWhen<IStore, ISelection, IThenShape>,
    thenKlasser: (s, o) =>
      BaseThen<IStore, ISelection, IThenShape>,
    checkKlasser: (n, f, cb, w, t) =>
      BaseCheck<ISubject, IStore, ISelection, IThenShape>,

    testResource

  ) {
    const classySuites = mapValues(
      testImplementation.Suites,
      () => (somestring, givens, checks) =>
        new suiteKlasser.prototype.constructor(somestring, givens, checks)

    );

    const classyGivens = mapValues(
      testImplementation.Givens,
      (z) =>
        (features, whens, thens, ...xtrasW) => {
          return new givenKlasser.prototype.constructor(z.name, features, whens, thens, z(...xtrasW))
        }

    );

    const classyWhens = mapValues(
      testImplementation.Whens,
      (whEn: (thing, payload?: any) => any) => (payload?: any) =>
        new whenKlasser.prototype.constructor(
          `${whEn.name}: ${payload && payload.toString()}`,
          whEn(payload)
        )
    );

    const classyThens = mapValues(
      testImplementation.Thens,
      (thEn: (klass, ...xtrasE) => void) => (expected: any, x) =>
        new thenKlasser.prototype.constructor(
          `${thEn.name}: ${expected && expected.toString()}`,
          thEn(expected)
        )
    );

    const classyChecks = mapValues(
      testImplementation.Checks,
      (z) => (somestring, features, callback) => {
        return new checkKlasser.prototype.constructor(somestring, features, callback, classyWhens, classyThens);
      }
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
      /* @ts-ignore:next-line */
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

    /* @ts-ignore:next-line */
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