import {
  IGivens, BaseCheck, BaseSuite, BaseWhen, BaseThen, BaseGiven
} from "./base";
import {
  ITTestResourceConfiguration,
  ITTestShape, ITestArtificer, ITestCheckCallback
} from "./lib";

export type IBaseConfig = {
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
};

export type IRunTime = `node` | `web`;

export type ITestTypes = [
  string,
  IRunTime,
  ITestTypes[]
];

export type ITestSpecification<
  ITestShape extends ITTestShape,
  ISubject,
  IStore,
  ISelection,
  IThenShape
> = (
  Suite: {
    [K in keyof ITestShape["suites"]]: (
      name: string,
      givens: IGivens<
        ISubject,
        IStore,
        ISelection,
        IThenShape
      >,
      checks: BaseCheck<
        ISubject,
        IStore,
        ISelection,
        IThenShape,
        ITestShape
      >[]
    ) => BaseSuite<
      unknown,
      ISubject,
      IStore,
      ISelection,
      IThenShape,
      ITestShape
    >;
  },
  Given: {
    [K in keyof ITestShape["givens"]]: (
      features: string[],
      whens: BaseWhen<
        IStore,
        ISelection,
        IThenShape
      >[],
      thens: BaseThen<
        ISelection,
        IStore,
        IThenShape
      >[],
      ...xtrasB: ITestShape["givens"][K]
    ) => BaseGiven<
      ISubject,
      IStore,
      ISelection,
      IThenShape
    >;
  },
  When: {
    [K in keyof ITestShape["whens"]]: (
      ...xtrasC: ITestShape["whens"][K]
    ) => BaseWhen<
      IStore,
      ISelection,
      IThenShape
    >;
  },
  Then: {
    [K in keyof ITestShape["thens"]]: (
      ...xtrasD: ITestShape["thens"][K]
    ) => BaseThen<
      ISelection,
      IStore,
      IThenShape>;
  },
  Check: ITestCheckCallback<ITestShape>
) => any[];

export type ITestImplementation<
  IState,
  ISelection,
  IWhenShape,
  IThenShape,
  ITestShape extends ITTestShape
> = {
  Suites: {
    [K in keyof ITestShape["suites"]]: string;
  };
  Givens: {
    [K in keyof ITestShape["givens"]]: (
      ...Ig: ITestShape["givens"][K]
    ) => IState;
  };
  Whens: {
    [K in keyof ITestShape["whens"]]: (
      ...Iw: ITestShape["whens"][K]
    ) =>
      (zel: ISelection) =>
        IWhenShape;
  };
  Thens: {
    [K in keyof ITestShape["thens"]]: (
      ...It: ITestShape["thens"][K]
    ) => (ssel: ISelection) => IThenShape;
  };
  Checks: {
    [K in keyof ITestShape["checks"]]: (
      ...Ic: ITestShape["checks"][K]
    ) => IState;
  };
};

export type ITestInterface<
  IStore, ISelection, ISubject, IThenShape, IInput
> = {
  actionHandler?: (b: (...any) => any) => any;
  andWhen: (
    store: IStore,
    whenCB,
    testResource: ITTestResourceConfiguration
  ) => Promise<ISelection>;
  butThen?: (
    store: IStore,
    thenCB,
    testResource: ITTestResourceConfiguration
  ) => Promise<ISelection>;
  assertioner?: (t: IThenShape) => any;

  afterAll?: (store: IStore, artificer: ITestArtificer) => any;
  afterEach?: (
    store: IStore,
    key: string,
    artificer: ITestArtificer
  ) => Promise<unknown>;
  beforeAll?: (input: IInput, artificer: ITestArtificer) => Promise<ISubject>;
  beforeEach?: (
    subject: ISubject,
    initialValues,
    testResource: ITTestResourceConfiguration,
    artificer: ITestArtificer
  ) => Promise<IStore>;
};