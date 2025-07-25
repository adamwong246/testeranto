/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ibdd_in, Ibdd_out } from "../../CoreTypes";
import { BaseBuilder } from "../basebuilder";

export type I = Ibdd_in<
  {}, // iinput
  BaseBuilder<any, any, any, any, any, any>, // isubject
  BaseBuilder<any, any, any, any, any, any>, // istore
  BaseBuilder<any, any, any, any, any, any>, // iselection
  () => BaseBuilder<any, any, any, any, any, any>, // given
  (store: any) => any, // when
  (store: any) => any // then
>;

export type O = Ibdd_out<
  // Suites
  {
    Default: [string];
  },
  // Givens
  {
    Default: [];
  },
  // Whens
  {}, // No whens in these tests
  // Thens
  {
    initializedProperly: [];
    specsGenerated: [];
    jobsCreated: [];
  }
>;
