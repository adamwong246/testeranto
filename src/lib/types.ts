/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Ibdd_in_any, Ibdd_out_any } from "../CoreTypes";
import { IGivens, BaseGiven } from "./BaseGiven";

import { BaseSuite } from "./BaseSuite";
import { BaseThen } from "./BaseThen";
import { BaseWhen } from "./BaseWhen";

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
