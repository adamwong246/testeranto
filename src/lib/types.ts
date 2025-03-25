import { IBaseTest } from "../Types";

import type { Plugin } from "esbuild";
import {
  IGivens,
  BaseCheck,
  BaseSuite,
  BaseGiven,
  BaseWhen,
  BaseThen,
} from "./abstractBase";
import { ITTestResourceConfiguration, ITestArtificer } from ".";
import { PM } from "../PM/index";

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

export type IWebTestInterface<
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
  assertThis: (x: ITestShape["then"]) => void;

  andWhen: (
    store: ITestShape["istore"],
    whenCB: ITestShape["when"],
    testResource: ITTestResourceConfiguration,
    utils: PM
  ) => Promise<ITestShape["istore"]>;
  butThen: (
    store: ITestShape["istore"],
    thenCB,
    testResource: ITTestResourceConfiguration,
    utils: PM
  ) => Promise<ITestShape["iselection"]>;

  afterAll: (
    store: ITestShape["istore"],
    artificer: ITestArtificer,
    utils: PM
  ) => any;
  afterEach: (
    store: ITestShape["istore"],
    key: string,
    artificer: ITestArtificer,
    utils: PM
  ) => Promise<unknown>;
  beforeAll: (
    input: ITestShape["iinput"],
    testResource: ITTestResourceConfiguration,
    artificer: ITestArtificer,
    utils: PM
  ) => Promise<ITestShape["isubject"]>;
  beforeEach: (
    subject: ITestShape["isubject"],
    initializer: (c?) => ITestShape["given"],
    artificer: ITestArtificer,
    testResource: ITTestResourceConfiguration,
    initialValues,
    utils: PM
  ) => Promise<ITestShape["istore"]>;
};
// & ITestInterface<ITestShape>;

export type INodeTestInterface<
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
  assertThis: (x: ITestShape["then"]) => void;
  andWhen: (
    store: ITestShape["istore"],
    whenCB: ITestShape["when"],
    testResource: ITTestResourceConfiguration,
    utils: PM
  ) => Promise<ITestShape["istore"]>;
  butThen: (
    store: ITestShape["istore"],
    thenCB,
    testResource: ITTestResourceConfiguration,
    utils: PM
  ) => Promise<ITestShape["iselection"]>;
  afterAll: (
    store: ITestShape["istore"],
    artificer: ITestArtificer,
    pm: PM
  ) => any;
  afterEach: (
    store: ITestShape["istore"],
    key: string,
    artificer: ITestArtificer,
    pm: PM
  ) => Promise<unknown>;
  beforeAll: (
    input: ITestShape["iinput"],
    testResource: ITTestResourceConfiguration,
    artificer: ITestArtificer,
    pm: PM
  ) => Promise<ITestShape["isubject"]>;
  beforeEach: (
    subject: ITestShape["isubject"],
    initializer: (c?) => ITestShape["given"],
    artificer: ITestArtificer,
    testResource: ITTestResourceConfiguration,
    initialValues,
    pm: PM
  ) => Promise<ITestShape["istore"]>;
};
// & ITestInterface<ITestShape>;

export type ITestInterface<
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
  assertThis: (x: ITestShape["then"]) => void;

  andWhen: (
    store: ITestShape["istore"],
    whenCB: ITestShape["when"],
    testResource: ITTestResourceConfiguration,
    pm: PM
  ) => Promise<ITestShape["istore"]>;
  butThen: (
    store: ITestShape["istore"],
    thenCB: ITestShape["then"],
    testResource: ITTestResourceConfiguration,
    pm: PM
  ) => Promise<ITestShape["iselection"]>;

  afterAll: (
    store: ITestShape["istore"],
    artificer: ITestArtificer,
    pm: PM
  ) => any;
  afterEach: (
    store: ITestShape["istore"],
    key: string,
    artificer: ITestArtificer,
    pm: PM
  ) => Promise<unknown>;
  beforeAll: (
    input: ITestShape["iinput"],
    testResource: ITTestResourceConfiguration,
    artificer: ITestArtificer,
    pm: PM
  ) => Promise<ITestShape["isubject"]>;
  beforeEach: (
    subject: ITestShape["isubject"],
    initializer: (c?) => ITestShape["given"],
    artificer: ITestArtificer,
    testResource: ITTestResourceConfiguration,
    initialValues,
    pm: PM
  ) => Promise<ITestShape["istore"]>;
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
