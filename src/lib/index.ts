import { PM } from "../PM/index.js";
import { IBaseTest, ITestInterface } from "../Types.js";

import { IGivens, BaseCheck, BaseSuite } from "./abstractBase.js";

export const BaseTestInterface: ITestInterface<
  IBaseTest<
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
  beforeAll: async (s) => s,
  beforeEach: async function (
    subject: any,
    initialValues: any,
    x: any,
    testResource: any,
    pm: PM
  ) {
    return subject as any;
  },
  afterEach: async (s) => s,
  afterAll: (
    store: IBaseTest<
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
    >["istore"]
  ) => undefined,
  butThen: async (
    store: IBaseTest<
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
    >["istore"],
    thenCb
  ) => thenCb(store),
  andWhen: (a) => a,
  assertThis: () => null,
};

export const DefaultTestInterface = (
  p: Partial<ITestInterface<any>>
): ITestInterface<any> => {
  return {
    ...BaseTestInterface,
    ...p,
  };
};

export type ITTestResourceConfiguration = {
  name: string;
  fs: string;
  ports: number[];
  browserWSEndpoint: string;
};

export type ITTestResourceRequirement = {
  name: string;
  ports: number;
  fs: string;
};

export type ITTestResourceRequest = {
  ports: number;
};

export type ITLog = (...string) => void;

export type ILogWriter = {
  createWriteStream: (line: string) => any | any;
  writeFileSync: (fp: string, contents: string) => any;
  mkdirSync: () => any;
  testArtiFactoryfileWriter: (
    tLog: ITLog,
    n: (Promise) => void
  ) => (fPath: string, value: unknown) => void;
};

export type ITestArtificer = (key: string, data: any) => void;

type ITest = {
  toObj(): object;
  name: string;
  givens: IGivens<
    IBaseTest<
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
  >;
  checks: BaseCheck<
    IBaseTest<
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
  >[];
  testResourceConfiguration: ITTestResourceConfiguration;
};

export type ITestJob<T = PM> = {
  toObj(): object;
  test: ITest;
  runner: (
    x: ITTestResourceConfiguration,
    t: ITLog
  ) => Promise<
    BaseSuite<
      IBaseTest<
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
    >
  >;
  testResourceRequirement: ITTestResourceRequirement;
  receiveTestResourceConfig: (pm: PM) => Promise<{
    failed: number;
    artifacts: Promise<unknown>[];
    logPromise: Promise<unknown>;
    features: string[];
  }>;
};

export type ITestResults = Promise<{ test: ITest }>[];

export const defaultTestResourceRequirement: ITTestResourceRequest = {
  ports: 0,
};

export type ITestArtifactory = (key: string, value: unknown) => unknown;

export type IRunnables = {
  nodeEntryPoints: Record<string, string>;
  webEntryPoints: Record<string, string>;
};

export type IFinalResults = { features: string[]; failed: number };

export type IRunTime = `node` | `web`;

export type ITestTypes = [string, IRunTime, { ports: number }, ITestTypes[]];

// export type IJsonConfig = {
//   outdir: string;
//   tests: ITestTypes[];
//   botEmail: string;
// };

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
