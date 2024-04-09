import {
  IGivens, BaseCheck, BaseSuite, BaseWhen, BaseThen, BaseGiven
} from "./base";
import {
  ITestCheckCallback
} from "./lib";

export type ITTestShape = {
  suites;
  givens;
  whens;
  thens;
  checks;
};

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
  IInput,
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
    ) =>
      (input: IInput) =>
        IState;
  };
  Whens: {
    [K in keyof ITestShape["whens"]]: (
      ...Iw: ITestShape["whens"][K]
    ) =>
      (selection: ISelection) =>
        IWhenShape;
  };
  Thens: {
    [K in keyof ITestShape["thens"]]: (
      ...It: ITestShape["thens"][K]
    ) =>
      (selection: ISelection) =>
        IThenShape;
  };
  Checks: {
    [K in keyof ITestShape["checks"]]: (
      ...Ic: ITestShape["checks"][K]
    ) =>
      (input: IInput) =>
        IState;
  };
};