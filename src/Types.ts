import {
  IGivens,
  BaseCheck,
  BaseSuite,
  BaseWhen,
  BaseThen,
  BaseGiven
} from "./base.js";
import {
  ITTestResourceConfiguration,
  ITestArtificer,
  ITestCheckCallback
} from "./lib.js";

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
  tests: string;
  debugger: boolean;
};

export type IRunTime = `node` | `electron` | `chromium`;

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
  assertThis?: (x: ITestShape['then']) => void,
  andWhen: (
    store: ITestShape['istore'],
    whenCB: ITestShape['when'],
    testResource: ITTestResourceConfiguration
  ) => Promise<ITestShape['istore']>;
  butThen?: (
    store: ITestShape['istore'],
    thenCB,
    testResource: ITTestResourceConfiguration
  ) => Promise<ITestShape['iselection']>;
  afterAll?: (
    store: ITestShape['istore'],
    artificer: ITestArtificer
  ) => any;
  afterEach?: (
    store: ITestShape['istore'],
    key: string,
    artificer: ITestArtificer
  ) => Promise<unknown>;
  beforeAll?: (
    input: ITestShape['iinput'],
    artificer: ITestArtificer
  ) => Promise<ITestShape['isubject']>;
  beforeEach?: (
    subject: ITestShape['isubject'],
    initializer: (c?) => ITestShape['given'],
    artificer: ITestArtificer,
    testResource: ITTestResourceConfiguration,
    initialValues
  ) => Promise<ITestShape['istore']>;
};

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