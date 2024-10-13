import { ITestCheckCallback, ILogWriter } from ".";
import { IBaseTest, ITestImplementation } from "../Types";
import { IGivens, BaseCheck, BaseSuite, BaseWhen, BaseThen, BaseGiven } from "./abstractBase";
import { BaseBuilder } from "./basebuilder";

export abstract class ClassBuilder<
  ITestShape extends IBaseTest
> extends BaseBuilder<
  ITestShape,
  any,
  any,
  any,
  any,
  any

> {

  constructor(
    testImplementation: ITestImplementation<
      ITestShape,
      any
    >,

    testSpecification: (
      Suite: {
        [K in keyof ITestShape["suites"]]: (
          feature: string,
          givens: IGivens<
            ITestShape
          >,
          checks: BaseCheck<
            ITestShape
          >[]
        ) => BaseSuite<
          ITestShape
        >;
      },
      Given: {
        [K in keyof ITestShape["givens"]]: (
          features: string[],
          whens: BaseWhen<
            ITestShape
          >[],
          thens: BaseThen<
            ITestShape
          >[],
          ...a: ITestShape["givens"][K]
        ) => BaseGiven<
          ITestShape
        >;
      },
      When: {
        [K in keyof ITestShape["whens"]]: (
          ...a: ITestShape["whens"][K]
        ) => BaseWhen<
          ITestShape
        >;
      },
      Then: {
        [K in keyof ITestShape["thens"]]: (
          ...a: ITestShape["thens"][K]
        ) => BaseThen<
          ITestShape
        >;
      },
      Check: ITestCheckCallback<ITestShape>,
      logWriter: ILogWriter
    ) => BaseSuite<
      ITestShape
    >[],

    input: ITestShape['iinput'],

    suiteKlasser: (
      name: string,
      index: number,
      givens: IGivens<
        ITestShape
      >,
      checks: BaseCheck<
        ITestShape
      >[]
    ) => BaseSuite<
      ITestShape
    >,
    givenKlasser: (
      name,
      features,
      whens,
      thens,
      givenCB
    ) => BaseGiven<
      ITestShape
    >,
    whenKlasser: (s, o) => BaseWhen<
      ITestShape
    >,
    thenKlasser: (s, o) => BaseThen<
      ITestShape
    >,
    checkKlasser: (
      n,
      f,
      cb,
      w,
      t
    ) => BaseCheck<
      ITestShape
    >,

    testResourceRequirement,
    logWriter: ILogWriter
  ) {
    const classySuites = Object.entries(testImplementation.suites).reduce(
      (a, [key], index) => {
        a[key] = (somestring, givens, checks) => {
          return new suiteKlasser.prototype.constructor(
            somestring,
            index,
            givens,
            checks
          );
        };
        return a;
      },
      {}
    );
    const classyGivens = Object.entries(testImplementation.givens)
      .reduce(
        (a, [key, givEn]) => {
          a[key] = (
            features,
            whens,
            thens,
            givEn,
          ) => {
            return new (givenKlasser.prototype).constructor(
              key,
              features,
              whens,
              thens,
              testImplementation.givens[key],
              givEn
            );
          };
          return a;
        },
        {}
      );

    const classyWhens = Object.entries(testImplementation.whens).reduce(
      (a, [key, whEn]: [string, (x) => any]) => {
        a[key] = (payload?: any) => {
          return new whenKlasser.prototype.constructor(
            `${whEn.name}: ${payload && payload.toString()}`,
            whEn(payload)
          );
        };
        return a;
      },
      {}
    );

    const classyThens = Object.entries(testImplementation.thens).reduce(
      (a, [key, thEn]: [string, (x) => any]) => {
        a[key] = (expected: any, x) => {
          return new thenKlasser.prototype.constructor(
            `${thEn.name}: ${expected && expected.toString()}`,
            thEn(expected)
          );
        };
        return a;
      },
      {}
    );

    const classyChecks = Object.entries(testImplementation.checks).reduce(
      (a, [key, z]) => {
        a[key] = (somestring, features, callback) => {
          return new checkKlasser.prototype.constructor(
            somestring,
            features,
            callback,
            classyWhens,
            classyThens
          );
        };
        return a;
      },
      {}
    );
    super(
      input,
      classySuites,
      classyGivens,
      classyWhens,
      classyThens,
      classyChecks,
      logWriter,
      testResourceRequirement,
      testSpecification
    );
  }

}