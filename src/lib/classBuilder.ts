import { IT, ITestImplementation, ITestSpecification, OT } from "../Types.js";

import { BaseBuilder } from "./basebuilder.js";
import {
  ISuiteKlasser,
  IGivenKlasser,
  IWhenKlasser,
  IThenKlasser,
  ICheckKlasser,
} from "./types.js";
import { ITTestResourceRequest } from "./index.js";
import { BaseCheck } from "./abstractBase.js";

type IExtenstions = Record<string, unknown>;

export abstract class ClassBuilder<
  I extends IT = IT,
  O extends OT = OT,
  M = unknown
> extends BaseBuilder<
  I,
  O,
  IExtenstions,
  IExtenstions,
  IExtenstions,
  IExtenstions,
  IExtenstions
> {
  constructor(
    testImplementation: ITestImplementation<I, O, M>,
    testSpecification: ITestSpecification<I, O>,
    input: I["iinput"],
    suiteKlasser: ISuiteKlasser<I, O>,
    givenKlasser: IGivenKlasser<I>,
    whenKlasser: IWhenKlasser<I>,
    thenKlasser: IThenKlasser<I>,
    checkKlasser: ICheckKlasser<I>,
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
        a[key] = (features, whens, thens) => {
          // console.log("givEn", givEn.toString());
          return new givenKlasser.prototype.constructor(
            key,
            features,
            whens,
            thens,
            testImplementation.givens[key]
            // givEn
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
      (a, [key, thEn]: [string, (s: I["iselection"]) => I["isubject"]]) => {
        a[key] = (expected, x) => {
          return new thenKlasser.prototype.constructor(
            `${thEn.name}: ${expected && expected.toString()}`,
            // () => {
            //   thEn(expected);
            //   // return new Promise((res), rej) => {

            //   // }
            //   // try {
            //   //   thEn(expected);
            //   // } catch (c) {
            //   //   console.log("mark99");
            //   // }
            // },
            thEn(expected)
          );
        };
        return a;
      },
      {}
    );

    const classyChecks = Object.entries(testImplementation.checks).reduce(
      (a, [key, chEck]) => {
        a[key] = (name, features, checker) => {
          return new checkKlasser.prototype.constructor(
            key,
            features,
            chEck,
            checker
          );
        };
        return a;
      },
      {} as Record<string, (n, f, c) => BaseCheck<I>>
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
