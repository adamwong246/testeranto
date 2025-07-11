/* eslint-disable @typescript-eslint/no-explicit-any */
import { PM_Node } from "../PM/node";
import { PM_Pure } from "../PM/pure";
import { PM_Web } from "../PM/web";
import type { IT, OT } from "../Types";

import {
  IGivens,
  BaseCheck,
  BaseSuite,
  BaseGiven,
  BaseWhen,
  BaseThen,
} from "./abstractBase";

export type IPM = PM_Node | PM_Web | PM_Pure;

export type TestPhase = 'beforeAll' | 'beforeEach' | 'test' | 'afterEach' | 'afterAll';

export type TestError = {
  phase: TestPhase;
  error: Error;
  testName: string;
  timestamp: number;
  stackTrace?: string;
  additionalInfo?: Record<string, unknown>;
  isRetryable?: boolean;
};

export type ITestCheckCallback<I extends IT, O extends OT> = {
  [K in keyof O["checks"]]: (
    name: string,
    features: string[],
    checkCallback: (store: I["istore"], pm: IPM) => Promise<O["checks"][K]>,

    ...xtrasA: O["checks"][K]
  ) => BaseCheck<I>;
};

export type ISuiteKlasser<I extends IT, O extends OT> = (
  name: string,
  index: number,
  givens: IGivens<I>,
  checks: BaseCheck<I>[]
) => BaseSuite<I, O>;

export type IGivenKlasser<I extends IT> = (
  name,
  features,
  whens,
  thens,
  givenCB
) => BaseGiven<I>;

export type IWhenKlasser<I extends IT> = (s, o) => BaseWhen<I>;

export type IThenKlasser<I extends IT> = (s, o) => BaseThen<I>;

export type ICheckKlasser<I extends IT> = (n, f, cb, w, t) => BaseCheck<I>;
