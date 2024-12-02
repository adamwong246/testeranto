import { IBaseTest } from "../Types";

// import puppeteer from "puppeteer-core";
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

export type IRunTime = `node` | `web`;

export type ITestTypes = [string, IRunTime, { ports: number }, ITestTypes[]];

export type IJsonConfig = {
  outdir: string;
  tests: ITestTypes[];
  features: string;
};

export type IBaseConfig = {
  clearScreen: boolean;
  debugger: boolean;
  devMode: boolean;
  externals: string[];
  features: string;
  minify: boolean;
  nodePlugins: any[];
  outbase: string;
  outdir: string;
  ports: string[];
  tests: ITestTypes[];
  webPlugins: any[];
};

export type IBuiltConfig = { buildDir: string } & IBaseConfig;

export type IWebTestInterface<ITestShape extends IBaseTest> = {
  assertThis: (x: ITestShape["then"]) => void;

  andWhen: (
    store: ITestShape["istore"],
    whenCB: ITestShape["when"],
    testResource: ITTestResourceConfiguration
  ) => Promise<ITestShape["istore"]>;
  butThen: (
    store: ITestShape["istore"],
    thenCB,
    testResource: ITTestResourceConfiguration
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
    initialValues
    // utils: IUtils
  ) => Promise<ITestShape["istore"]>;
};
// & ITestInterface<ITestShape>;

export type INodeTestInterface<ITestShape extends IBaseTest> = {
  assertThis: (x: ITestShape["then"]) => void;
  andWhen: (
    store: ITestShape["istore"],
    whenCB: ITestShape["when"],
    testResource: ITTestResourceConfiguration
  ) => Promise<ITestShape["istore"]>;
  butThen: (
    store: ITestShape["istore"],
    thenCB,
    testResource: ITTestResourceConfiguration
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
    initialValues
    // utils: IUtils
  ) => Promise<ITestShape["istore"]>;
};
// & ITestInterface<ITestShape>;

export type ITestInterface<ITestShape extends IBaseTest> = {
  assertThis: (x: ITestShape["then"]) => void;

  andWhen: (
    store: ITestShape["istore"],
    whenCB: ITestShape["when"],
    testResource: ITTestResourceConfiguration
  ) => Promise<ITestShape["istore"]>;
  butThen: (
    store: ITestShape["istore"],
    thenCB,
    testResource: ITTestResourceConfiguration
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

export type ISuiteKlasser<ITestShape extends IBaseTest> = (
  name: string,
  index: number,
  givens: IGivens<ITestShape>,
  checks: BaseCheck<ITestShape>[]
) => BaseSuite<ITestShape>;

export type IGivenKlasser<ITestShape extends IBaseTest> = (
  name,
  features,
  whens,
  thens,
  givenCB
) => BaseGiven<ITestShape>;

export type IWhenKlasser<ITestShape extends IBaseTest> = (
  s,
  o
) => BaseWhen<ITestShape>;

export type IThenKlasser<ITestShape extends IBaseTest> = (
  s,
  o
) => BaseThen<ITestShape>;

export type ICheckKlasser<ITestShape extends IBaseTest> = (
  n,
  f,
  cb,
  w,
  t
) => BaseCheck<ITestShape>;
