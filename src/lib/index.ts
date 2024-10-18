import { IBaseTest } from "../Types.js";

import {
  IGivens,
  BaseCheck,
  BaseSuite,
  BaseWhen,
  BaseThen,
} from "./abstractBase.js";

import { INodeUtils, ITestInterface, IUtils, IWebUtils } from "./types.js";

export const BaseTestInterface: ITestInterface<IBaseTest> = {
  beforeAll: async (s) => s,
  beforeEach: async function (
    subject: any,
    initialValues: any,
    testResource: any
  ) {
    return subject as any;
  },
  afterEach: async (s) => s,
  afterAll: (store: IBaseTest["istore"]) => undefined,
  butThen: async (store: IBaseTest["istore"], thenCb) => thenCb(store),
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
  scheduled: boolean;
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
  mkdirSync: (fp: string) => any;
  testArtiFactoryfileWriter: (
    tLog: ITLog,
    n: (Promise) => void
  ) => (fPath: string, value: unknown) => void;
};

export type ITestArtificer = (key: string, data: any) => void;

type ITest = {
  toObj(): object;
  name: string;
  givens: IGivens<IBaseTest>;
  checks: BaseCheck<IBaseTest>[];
  testResourceConfiguration: ITTestResourceConfiguration;
};

export type ITestJob<T = INodeUtils | IWebUtils> = {
  toObj(): object;
  test: ITest;
  runner: (
    x: ITTestResourceConfiguration,
    t: ITLog
  ) => Promise<BaseSuite<IBaseTest>>;
  testResourceRequirement: ITTestResourceRequirement;
  receiveTestResourceConfig: (
    testResource,
    utils: T
  ) => Promise<{
    failed: number;
    artifacts: Promise<unknown>[];
    logPromise: Promise<unknown>;
  }>;
};

export type ITestResults = Promise<{ test: ITest }>[];

export const defaultTestResourceRequirement: ITTestResourceRequest = {
  ports: 0,
};

export type ITestArtifactory = (key: string, value: unknown) => unknown;

export type ITestCheckCallback<ITestShape extends IBaseTest> = {
  [K in keyof ITestShape["checks"]]: (
    name: string,
    features: string[],
    callbackA: (
      whens: {
        [K in keyof ITestShape["whens"]]: (...unknown) => BaseWhen<ITestShape>;
      },
      thens: {
        [K in keyof ITestShape["thens"]]: (...unknown) => BaseThen<ITestShape>;
      }
    ) => Promise<any>,
    ...xtrasA: ITestShape["checks"][K]
  ) => BaseCheck<ITestShape>;
};
