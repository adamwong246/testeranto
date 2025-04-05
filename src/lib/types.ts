import {
  IGivens,
  BaseCheck,
  BaseSuite,
  BaseGiven,
  BaseWhen,
  BaseThen,
} from "./abstractBase";
import { IBaseTest } from "../Types";

export type ITestCheckCallback<
  ITestShape extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = {
  [K in keyof ITestShape["checks"]]: (
    name: string,
    features: string[],
    callbackA: (
      whens: {
        [K in keyof ITestShape["whens"]]: (...unknown) => BaseWhen<ITestShape>;
      },
      thens: {
        [K in keyof ITestShape["thens"]]: (...unknown) => BaseThen<ITestShape>;
      }
    ) => Promise<any>,
    ...xtrasA: ITestShape["checks"][K]
  ) => BaseCheck<ITestShape>;
};

export type ISuiteKlasser<
  ITestShape extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = (
  name: string,
  index: number,
  givens: IGivens<ITestShape>,
  checks: BaseCheck<ITestShape>[]
) => BaseSuite<ITestShape>;

export type IGivenKlasser<
  ITestShape extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = (name, features, whens, thens, givenCB) => BaseGiven<ITestShape>;

export type IWhenKlasser<
  ITestShape extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = (s, o) => BaseWhen<ITestShape>;

export type IThenKlasser<
  ITestShape extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = (s, o) => BaseThen<ITestShape>;

export type ICheckKlasser<
  ITestShape extends IBaseTest<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
> = (n, f, cb, w, t) => BaseCheck<ITestShape>;
