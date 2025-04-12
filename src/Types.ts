import { Plugin } from "esbuild";

import { ITTestResourceConfiguration } from "./lib/index.js";
import {
  IGivens,
  BaseCheck,
  BaseSuite,
  BaseWhen,
  BaseThen,
  BaseGiven,
} from "./lib/abstractBase.js";
import { IPM, ITestCheckCallback } from "./lib/types.js";
import { PM } from "./PM/index.js";

export type ITestInterface<I extends IT = IT> = {
  assertThis: (x: I["then"]) => any;
  andWhen: (
    store: I["istore"],
    whenCB: I["when"],
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ) => Promise<I["istore"]>;
  butThen: (
    store: I["istore"],
    thenCB: I["then"],
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ) => Promise<I["iselection"]>;
  afterAll: (store: I["istore"], pm: IPM) => any;
  afterEach: (store: I["istore"], key: string, pm: IPM) => Promise<unknown>;
  beforeAll: (
    input: I["iinput"],
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ) => Promise<I["isubject"]>;
  beforeEach: (
    subject: I["isubject"],
    initializer: (c?) => I["given"],
    testResource: ITTestResourceConfiguration,
    initialValues,
    pm: IPM
  ) => Promise<I["istore"]>;
};

export type IWebTestInterface<I extends IT> = ITestInterface<I>;

export type INodeTestInterface<I extends IT> = ITestInterface<I>;

export type IPartialInterface<I extends IT> = Partial<ITestInterface<I>>;

export type IPartialNodeInterface<I extends IT> = Partial<
  INodeTestInterface<I>
>;
export type IPartialWebInterface<I extends IT> = Partial<IWebTestInterface<I>>;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type IT = Ibdd_in<
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown
>;

export type OT = Ibdd_out<
  Record<string, any>,
  Record<string, any>,
  Record<string, any>,
  Record<string, any>,
  Record<string, any>
>;

// export type MT<O extends OT> = Partial<{
//   suites: { [K in keyof O["suites"]]: unknown };
//   givens: { [K in keyof O["givens"]]: unknown };
//   whens: { [K in keyof O["whens"]]: unknown };
//   thens: { [K in keyof O["thens"]]: unknown };
//   checks: { [K in keyof O["checks"]]: unknown };
// }>;

export type ITestSpecification<I extends IT, O extends OT> = (
  Suite: {
    [K in keyof O["suites"]]: (
      name: string,
      givens: IGivens<I>,
      checks: BaseCheck<I>[]
    ) => BaseSuite<I, O>;
  },
  Given: {
    [K in keyof O["givens"]]: (
      features: string[],
      whens: BaseWhen<I>[],
      thens: BaseThen<I>[],
      ...xtrasB: O["givens"][K]
    ) => BaseGiven<I>;
  },
  When: {
    [K in keyof O["whens"]]: (...xtrasC: O["whens"][K]) => BaseWhen<I>;
  },
  Then: {
    [K in keyof O["thens"]]: (...xtrasD: O["thens"][K]) => BaseThen<I>;
  },
  Check: ITestCheckCallback<I, O>
) => any[];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type ITestImplementation<
  I extends IT,
  O extends OT,
  modifier = {}
> = Modify<
  {
    suites: {
      [K in keyof O["suites"]]: string;
    };
    givens: {
      [K in keyof O["givens"]]: (...Ig: O["givens"][K]) => I["given"];
    };
    whens: {
      [K in keyof O["whens"]]: (
        ...Iw: O["whens"][K]
      ) => (zel: I["iselection"], utils: PM) => Promise<I["when"]>;
    };
    thens: {
      [K in keyof O["thens"]]: (
        ...It: O["thens"][K]
      ) => (ssel: I["iselection"], utils: PM) => I["then"];
    };
    checks: {
      [K in keyof O["checks"]]: (...Ic: O["checks"][K]) => I["given"];
    };
  },
  modifier
>;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type Modify<T, R> = Omit<T, keyof R> & R;

export type Ibdd_out<
  ISuites extends Record<string, any> = Record<string, any>,
  IGivens extends Record<string, any> = Record<string, any>,
  IWhens extends Record<string, any> = Record<string, any>,
  IThens extends Record<string, any> = Record<string, any>,
  IChecks extends Record<string, any> = Record<string, any>
> = {
  suites: ISuites;
  givens: IGivens;
  whens: IWhens;
  thens: IThens;
  checks: IChecks;
};

export type Ibdd_in<
  IInput,
  ISubject,
  IStore,
  ISelection,
  IGiven,
  IWhen,
  IThen
> = {
  iinput: IInput;
  isubject: ISubject;
  istore: IStore;
  iselection: ISelection;
  given: IGiven;
  when: IWhen;
  then: IThen;
};

///////////////////////////////////////////////

export type IPluginFactory = (
  register?: (entrypoint: string, sources: string[]) => any,
  entrypoints?: string[]
) => Plugin;

export type IRunTime = `node` | `web` | "pure";

export type ITestTypes = [string, IRunTime, { ports: number }, ITestTypes[]];

export type ITestconfig = {
  clearScreen: boolean;
  debugger: boolean;
  externals: string[];
  featureIngestor: (s: string) => Promise<string>;
  importPlugins: IPluginFactory[];
  minify: boolean;
  nodePlugins: IPluginFactory[];
  ports: string[];
  src: string;
  tests: ITestTypes[];
  webPlugins: IPluginFactory[];
  reportDomain: string;
};

export type IBuiltConfig = { buildDir: string } & ITestconfig;

export type IProject = {
  projects: Record<string, ITestconfig>;
};
