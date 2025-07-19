/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NonEmptyObject } from "type-fest";

import type {
  Ibdd_in_any,
  Ibdd_out_any,
  ITestImplementation,
  ITestSpecification,
} from "../CoreTypes";

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
  I extends Ibdd_in_any = Ibdd_in_any,
  O extends Ibdd_out_any = Ibdd_out_any,
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
    testImplementation: ITestImplementation<I, O, M> & {
      suites: Record<string, NonEmptyObject<object>>;
      givens: Record<string, any>;
      whens: Record<string, any>;
      thens: Record<string, any>;
      checks: Record<string, any>;
    },
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
        a[key] = (features, whens, thens, ...initialValues) => {
          return new givenKlasser.prototype.constructor(
            key,
            features,
            whens,
            thens,
            testImplementation.givens[key],
            initialValues
          );
        };
        return a;
      },
      {}
    );

    const classyWhens = Object.entries(testImplementation.whens).reduce(
      (a, [key, whEn]: [string, (x) => any]) => {
        a[key] = (...payload: any) => {
          return new whenKlasser.prototype.constructor(
            `${whEn.name}: ${payload && payload.toString()}`,
            whEn(...payload)
          );
        };
        return a;
      },
      {}
    );

    const classyThens = Object.entries<(expected: any, ...x: any[]) => any>(
      testImplementation.thens
    ).reduce(
      (a, [key, thEn]: [string, (s: I["iselection"]) => I["isubject"]]) => {
        a[key] = (expected, ...x) => {
          return new thenKlasser.prototype.constructor(
            `${thEn.name}: ${expected && expected.toString()}`,
            thEn(expected, ...x)
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
