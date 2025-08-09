/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Do not add logging to this file as it is used by the pure runtime.

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
} from "./types.js";
import { ITTestResourceRequest } from "./index.js";

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
  IExtenstions
> {
  constructor(
    testImplementation: ITestImplementation<I, O, M> & {
      suites: Record<string, NonEmptyObject<object>>;
      givens: Record<string, any>;
      whens: Record<string, any>;
      thens: Record<string, any>;
    },
    testSpecification: ITestSpecification<I, O>,
    input: I["iinput"],
    suiteKlasser: ISuiteKlasser<I, O>,
    givenKlasser: IGivenKlasser<I>,
    whenKlasser: IWhenKlasser<I>,
    thenKlasser: IThenKlasser<I>,
    testResourceRequirement: ITTestResourceRequest
  ) {
    const classySuites = Object.entries(testImplementation.suites).reduce(
      (a, [key], index) => {
        a[key] = (somestring, givens) => {
          return new suiteKlasser.prototype.constructor(
            somestring,
            index,
            givens
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

    super(
      input,
      classySuites,
      classyGivens,
      classyWhens,
      classyThens,
      testResourceRequirement,
      testSpecification
    );
  }
}
