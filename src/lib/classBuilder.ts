import {
  Ibdd_in,
  Ibdd_out,
  ITestImplementation,
  ITestSpecification,
} from "../Types.js";

import { BaseBuilder } from "./basebuilder.js";
import {
  ISuiteKlasser,
  IGivenKlasser,
  IWhenKlasser,
  IThenKlasser,
  ICheckKlasser,
} from "./types.js";
import { ITTestResourceRequest } from "./index.js";

export abstract class ClassBuilder<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> extends BaseBuilder<I, O, any, any, any, any, any> {
  constructor(
    testImplementation: ITestImplementation<I, O>,
    testSpecification: ITestSpecification<I, O>,
    input: I["iinput"],
    suiteKlasser: ISuiteKlasser<I, O>,
    givenKlasser: IGivenKlasser<I>,
    whenKlasser: IWhenKlasser<I>,
    thenKlasser: IThenKlasser<I>,
    checkKlasser: ICheckKlasser<I, O>,
    testResourceRequirement: ITTestResourceRequest
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

    const classyGivens = Object.entries(testImplementation.givens).reduce(
      (a, [key, g]) => {
        a[key] = (features, whens, thens, givEn) => {
          return new givenKlasser.prototype.constructor(
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
      testResourceRequirement,
      testSpecification
    );
  }
}
