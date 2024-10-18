// for internal types only

import { BrowserWindow } from "electron";
import { Browser, Page } from "puppeteer-core";
import { ITTestResourceConfiguration, ITestArtificer } from ".";
import { IBaseTest } from "../Types";

import { IGivens, BaseCheck, BaseSuite, BaseGiven, BaseWhen, BaseThen } from "./abstractBase";

export type IRunTime = `node` | `web`;

export type ITestTypes = [
  string,
  IRunTime,
  ITestTypes[]
];


export type IJsonConfig = {
  outdir: string,
  tests: ITestTypes[]
  features: string;
};

export type IBaseConfig = {
  outdir: string,
  tests: ITestTypes[]
  features: string
  externals: string[],
  clearScreen: boolean;
  devMode: boolean;
  webPlugins: any[];
  nodePlugins: any[];
  minify: boolean;
  outbase: string;
  ports: string[];
  debugger: boolean;
};

export type IBuiltConfig = {
  buildDir: string,
  modules: {
    module: unknown,
    test: string,
    runtime: IRunTime
  }[]
};

export type INodeUtils = TBrowser;
export type IWebUtils = BrowserWindow;
export type IUtils = INodeUtils | IWebUtils;

export class TBrowser {
  browser: Browser;
  constructor(browser: Browser) {
    this.browser = browser;
  }
  pages(): Promise<Page[]> {

    return new Promise(async (res, rej) => {


      res(
        (await this.browser.pages()).map((p) => {
          // const handler = {
          //   apply: function (target, thisArg, argumentsList) {
          //     console.log('screenshot was called with ' + JSON.stringify(argumentsList));
          //     const x: ScreenshotOptions = argumentsList[0]
          //     x.path = "./dist/" + x.path;
          //     console.log('x.path' + x.path, target, thisArg);
          //     return target(...argumentsList);
          //   }
          // };
          // p.screenshot = new Proxy(p.screenshot, handler);
          return p;
        })
      );
    });

  }
  // pages(): Promise<TPage[]> {
  //   return super.pages();
  // }
}



export type IWebTestInterface<
  ITestShape extends IBaseTest
> = {
  assertThis: (x: ITestShape['then']) => void,

  andWhen: (
    store: ITestShape['istore'],
    whenCB: ITestShape['when'],
    testResource: ITTestResourceConfiguration
  ) => Promise<ITestShape['istore']>;
  butThen: (
    store: ITestShape['istore'],
    thenCB,
    testResource: ITTestResourceConfiguration
  ) => Promise<ITestShape['iselection']>;

  afterAll: (
    store: ITestShape['istore'],
    artificer: ITestArtificer,
    browser: IWebUtils
  ) => any;
  afterEach: (
    store: ITestShape['istore'],
    key: string,
    artificer: ITestArtificer,
    // utils: IUtils
  ) => Promise<unknown>;
  beforeAll: (
    input: ITestShape['iinput'],
    testResource: ITTestResourceConfiguration,
    artificer: ITestArtificer,
    // utils: IUtils
  ) => Promise<ITestShape['isubject']>;
  beforeEach: (
    subject: ITestShape['isubject'],
    initializer: (c?) => ITestShape['given'],
    artificer: ITestArtificer,
    testResource: ITTestResourceConfiguration,
    initialValues,
    // utils: IUtils
  ) => Promise<ITestShape['istore']>;
} & ITestInterface<ITestShape>;

export type INodeTestInterface<
  ITestShape extends IBaseTest
> = {
  assertThis: (x: ITestShape['then']) => void,

  andWhen: (
    store: ITestShape['istore'],
    whenCB: ITestShape['when'],
    testResource: ITTestResourceConfiguration
  ) => Promise<ITestShape['istore']>;
  butThen: (
    store: ITestShape['istore'],
    thenCB,
    testResource: ITTestResourceConfiguration
  ) => Promise<ITestShape['iselection']>;

  afterAll: (
    store: ITestShape['istore'],
    artificer: ITestArtificer,
    browser: INodeUtils
  ) => any;
  afterEach: (
    store: ITestShape['istore'],
    key: string,
    artificer: ITestArtificer,
    // utils: IUtils
  ) => Promise<unknown>;
  beforeAll: (
    input: ITestShape['iinput'],
    testResource: ITTestResourceConfiguration,
    artificer: ITestArtificer,
    // utils: IUtils
  ) => Promise<ITestShape['isubject']>;
  beforeEach: (
    subject: ITestShape['isubject'],
    initializer: (c?) => ITestShape['given'],
    artificer: ITestArtificer,
    testResource: ITTestResourceConfiguration,
    initialValues,
    // utils: IUtils
  ) => Promise<ITestShape['istore']>;
} & ITestInterface<ITestShape>;


export type ITestInterface<
  ITestShape extends IBaseTest
> = {
  assertThis: (x: ITestShape['then']) => void,

  andWhen: (
    store: ITestShape['istore'],
    whenCB: ITestShape['when'],
    testResource: ITTestResourceConfiguration
  ) => Promise<ITestShape['istore']>;
  butThen: (
    store: ITestShape['istore'],
    thenCB,
    testResource: ITTestResourceConfiguration
  ) => Promise<ITestShape['iselection']>;

  afterAll: (
    store: ITestShape['istore'],
    artificer: ITestArtificer,
    utils: IUtils
  ) => any;
  afterEach: (
    store: ITestShape['istore'],
    key: string,
    artificer: ITestArtificer,
    // utils: IUtils
  ) => Promise<unknown>;
  beforeAll: (
    input: ITestShape['iinput'],
    testResource: ITTestResourceConfiguration,
    artificer: ITestArtificer,
    // utils: IUtils
  ) => Promise<ITestShape['isubject']>;
  beforeEach: (
    subject: ITestShape['isubject'],
    initializer: (c?) => ITestShape['given'],
    artificer: ITestArtificer,
    testResource: ITTestResourceConfiguration,
    initialValues,
    // utils: IUtils
  ) => Promise<ITestShape['istore']>;
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

export type IWhenKlasser<ITestShape extends IBaseTest> = (s, o) =>
  BaseWhen<ITestShape>

export type IThenKlasser<ITestShape extends IBaseTest> = (s, o) =>
  BaseThen<ITestShape>;

export type ICheckKlasser<ITestShape extends IBaseTest> = (
  n,
  f,
  cb,
  w,
  t
) => BaseCheck<ITestShape>;

// export type ITestShaper<
//   T extends IBaseTest,
//   modifier
// > = {
//   given;
//   when;
//   then;
//   suites;
//   givens;
//   whens;
//   thens;
//   checks;
// };

// export class TPage extends Page {
//   // screenshot(options?: puppeteer.ScreenshotOptions) {
//   //   return super.screenshot({
//   //     ...options,
//   //     path: "dist/" + (options ? options : { path: "" }).path,

//   //   });
//   // }
// }
// type If = {
//   (modulePath: string | URL, options?: childProcess.ForkOptions): childProcess.ChildProcess;
//   (modulePath: string | URL, args?: readonly string[], options?: childProcess.ForkOptions): childProcess.ChildProcess
// };

// const f: If = childProcess.fork;
