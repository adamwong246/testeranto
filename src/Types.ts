import { Page, Browser, ScreenshotOptions } from "puppeteer-core";
import {
  ITTestResourceConfiguration,
  ITTestResourceRequest,
  ITestArtificer,
  ITestCheckCallback
} from "./lib/index.js";
import { IGivens, BaseCheck, BaseSuite, BaseWhen, BaseThen, BaseGiven } from "./lib/abstractBase.js";
import Testeranto from "./lib/core.js";
import { BrowserWindow } from "electron";

export type INodeUtils = TBrowser;
export type IWebUtils = BrowserWindow;
export type IUtils = INodeUtils | IWebUtils;

// export class TPage extends Page {
//   // screenshot(options?: puppeteer.ScreenshotOptions) {
//   //   return super.screenshot({
//   //     ...options,
//   //     path: "dist/" + (options ? options : { path: "" }).path,

//   //   });
//   // }
// }

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

export type IJsonConfig = {
  outdir: string,
  tests: ITestTypes[]
};

export type IBaseConfig = {
  externals: string[],
  clearScreen: boolean;
  devMode: boolean;
  features: string;
  webPlugins: any[];
  nodePlugins: any[];
  minify: boolean;
  outbase: string;
  outdir: string;
  ports: string[];
  debugger: boolean;
};

export type IPartialInterface<I extends IBaseTest> = Partial<ITestInterface<I>>;
export type IPartialNodeInterface<I extends IBaseTest> = Partial<INodeTestInterface<I>>;

export type IEntry<ITestShape extends IBaseTest> = (
  input: ITestShape['iinput'],
  testSpecification: ITestSpecification<ITestShape>,
  testImplementation: ITestImplementation<ITestShape, object>,
  testInterface: IPartialInterface<ITestShape>,
  testResourceRequirement: ITTestResourceRequest,
) => Promise<Testeranto<ITestShape>>;

// type If = {
//   (modulePath: string | URL, options?: childProcess.ForkOptions): childProcess.ChildProcess;
//   (modulePath: string | URL, args?: readonly string[], options?: childProcess.ForkOptions): childProcess.ChildProcess
// };

// const f: If = childProcess.fork;

export type IRunTime = `node` | `web`;

export type ITestTypes = [
  string,
  IRunTime,
  ITestTypes[]
];

export type ITestSpecification<
  ITestShape extends IBaseTest
> = (
  Suite: {
    [K in keyof ITestShape["suites"]]: (
      name: string,
      givens: IGivens<
        ITestShape
      >,
      checks: BaseCheck<
        ITestShape
      >[]
    ) => BaseSuite<
      ITestShape
    >;
  },
  Given: {
    [K in keyof ITestShape["givens"]]: (
      features: string[],
      whens: BaseWhen<
        ITestShape
      >[],
      thens: BaseThen<
        ITestShape
      >[],
      ...xtrasB: ITestShape["givens"][K]
    ) => BaseGiven<
      ITestShape
    >;
  },
  When: {
    [K in keyof ITestShape["whens"]]: (
      ...xtrasC: ITestShape["whens"][K]
    ) => BaseWhen<
      ITestShape
    >;
  },
  Then: {
    [K in keyof ITestShape["thens"]]: (
      ...xtrasD: ITestShape["thens"][K]
    ) => BaseThen<
      ITestShape
    >;
  },
  Check: ITestCheckCallback<ITestShape>
) => any[];

export type ITestImplementation<
  ITestShape extends IBaseTest,
  IMod
> = Modify<{
  suites: {
    [K in keyof ITestShape["suites"]]: string;
  };
  givens: {
    [K in keyof ITestShape["givens"]]: (
      ...Ig: ITestShape["givens"][K]
    ) => ITestShape['given'];
  };
  whens: {
    [K in keyof ITestShape["whens"]]: (
      ...Iw: ITestShape["whens"][K]
    ) =>
      (zel: ITestShape['iselection']) =>
        ITestShape['when'];
  };
  thens: {
    [K in keyof ITestShape["thens"]]: (
      ...It: ITestShape["thens"][K]
    ) => (ssel: ITestShape['iselection']) =>
        ITestShape['then'];
  };
  checks: {
    [K in keyof ITestShape["checks"]]: (
      ...Ic: ITestShape["checks"][K]
    ) => ITestShape['given'];
  };
}, IMod>;



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

type Modify<T, R> = Omit<T, keyof R> & R;

export type IBaseTest = {
  iinput; // input
  isubject;  // subject
  istore; // store
  iselection;
  // iinitial;

  given;
  when;
  then;
  suites: Record<string, any[]>;
  givens: Record<string, any[]>;
  whens: Record<string, any[]>;
  thens: Record<string, any[]>;
  checks: Record<string, any[]>;
};

export type ITestShaper<
  T extends IBaseTest,
  modifier
> = {
  given;
  when;
  then;
  suites;
  givens;
  whens;
  thens;
  checks;
};