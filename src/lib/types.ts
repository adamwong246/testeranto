/* eslint-disable @typescript-eslint/no-explicit-any */

// Do not add logging to this file as it is used by the pure runtime.

import type { Ibdd_in_any, Ibdd_out_any } from "../CoreTypes";
import { PM_Node } from "../PM/node";
import { PM_Pure } from "../PM/pure";
import { PM_Web } from "../PM/web";
import { IGivens, BaseGiven } from "./BaseGiven";

import { BaseSuite } from "./BaseSuite";
import { BaseThen } from "./BaseThen";
import { BaseWhen } from "./BaseWhen";

export type IPM = PM_Node | PM_Web | PM_Pure;

export type ThemeType =
  | "system"
  | "light"
  | "dark"
  | "light-vibrant"
  | "dark-vibrant"
  | "sepia"
  | "light-grayscale"
  | "dark-grayscale"
  | "daily"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia";

export type TestPhase =
  | "beforeAll"
  | "beforeEach"
  | "test"
  | "afterEach"
  | "afterAll";

export type TestError = {
  phase: TestPhase;
  error: Error;
  testName: string;
  timestamp: number;
  stackTrace?: string;
  additionalInfo?: Record<string, unknown>;
  isRetryable?: boolean;
};

export type ISuiteKlasser<I extends Ibdd_in_any, O extends Ibdd_out_any> = (
  name: string,
  index: number,
  givens: IGivens<I>
) => BaseSuite<I, O>;

export type IGivenKlasser<I extends Ibdd_in_any> = (
  name,
  features,
  whens,
  thens,
  givenCB
) => BaseGiven<I>;

export type IWhenKlasser<I extends Ibdd_in_any> = (s, o) => BaseWhen<I>;

export type IThenKlasser<I extends Ibdd_in_any> = (s, o) => BaseThen<I>;
