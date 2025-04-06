import { PM } from "../PM";
import { Ibdd_in, Ibdd_out } from "../Types";

import {
  IGivens,
  BaseCheck,
  BaseSuite,
  BaseGiven,
  BaseWhen,
  BaseThen,
} from "./abstractBase";

export type ITestCheckCallback<
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
> = {
  [K in keyof O["checks"]]: (
    name: string,
    features: string[],
    checkCallback: (store: I["istore"], pm: PM) => Promise<any>,

    ...xtrasA: O["checks"][K]
  ) => BaseCheck<I, O>;
};

export type ISuiteKlasser<
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
> = (
  name: string,
  index: number,
  givens: IGivens<I>,
  checks: BaseCheck<I, O>[]
) => BaseSuite<I, O>;

export type IGivenKlasser<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >
> = (name, features, whens, thens, givenCB) => BaseGiven<I>;

export type IWhenKlasser<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >
> = (s, o) => BaseWhen<I>;

export type IThenKlasser<
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >
> = (s, o) => BaseThen<I>;

export type ICheckKlasser<
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
> = (n, f, cb, w, t) => BaseCheck<I, O>;
