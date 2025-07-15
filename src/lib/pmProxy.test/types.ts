import { ITestProxies } from ".";
import { Ibdd_in, Ibdd_out } from "../../CoreTypes";

import { IProxiedFunctions, IProxy } from "../pmProxy";
import { IPM } from "../types";

export type I = Ibdd_in<
  { butThenProxy: IProxy },
  { proxies: ITestProxies; filepath: string; mockPm: IPM },
  { butThenProxy: IProxy },
  // { butThenProxy: IProxy },

  { proxies: ITestProxies; filepath: string; mockPm: IPM },
  [string, string],
  (
    ...args: any[]
  ) => (proxies: { butThenProxy: IProxy }) => { butThenProxy: IProxy },
  [IPM, "string"]
>;

export type O = Ibdd_out<
  { Default: [string] },
  { SomeBaseString: [string] },
  {}, // No Whens for pure functions
  {
    theButTheProxyReturns: [IProxiedFunctions, string];
  },
  { Default: [] }
>;

export type M = {
  givens: {
    [K in keyof O["givens"]]: (...Iw: O["givens"][K]) => string;
  };
  // whens: {
  //   [K in keyof O["whens"]]: (
  //     ...Iw: O["whens"][K]
  //   ) => (rectangle: Rectangle, utils: PM) => Rectangle;
  // };
  // thens: {
  //   [K in keyof O["thens"]]: (
  //     ...Iw: O["thens"][K]
  //   ) => (rectangle: Rectangle, utils: PM) => Rectangle;
  // };
};
