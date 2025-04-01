// import { IBaseTest } from "../Types";

import type { Plugin } from "esbuild";
import {
  IGivens,
  BaseCheck,
  BaseSuite,
  BaseGiven,
  BaseWhen,
  BaseThen,
} from "./abstractBase";
import { IBaseTest } from "../Types";

export type IFinalResults = { features: string[]; failed: number };

export type IRunTime = `node` | `web`;

export type ITestTypes = [string, IRunTime, { ports: number }, ITestTypes[]];

export type IJsonConfig = {
  outdir: string;
  tests: ITestTypes[];
  botEmail: string;
};

export type IPlugin = (
  register: (entrypoint, sources) => any,
  entrypoints
) => Plugin;

export type IBaseConfig = {
  src: string;
  clearScreen: boolean;
  debugger: boolean;
  devMode: boolean;
  externals: string[];
  minify: boolean;
  outbase: string;
  outdir: string;
  ports: string[];
  tests: ITestTypes[];

  nodePlugins: IPlugin[];
  webPlugins: IPlugin[];

  featureIngestor: (s: string) => Promise<string>;
};

export type IBuiltConfig = { buildDir: string } & IBaseConfig;

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
