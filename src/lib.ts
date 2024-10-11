import {
  IGivens, BaseCheck, BaseSuite, BaseThen, BaseWhen
} from "./base.js";
import { IBaseTest } from "./Types.js";

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
  createWriteStream: (line: string) => any | any,
  writeFileSync: (fp: string, contents: string) => any
  mkdirSync: (fp: string) => any
  testArtiFactoryfileWriter: (tLog: ITLog, n: (Promise) => void) =>
    (fPath: string, value: unknown) =>
      void
}

export type ITestArtificer = (key: string, data: any) => void;

type ITest = {
  toObj(): object;
  name: string;
  givens: IGivens<
    IBaseTest
  >;
  checks: BaseCheck<
    IBaseTest
  >[];
  testResourceConfiguration: ITTestResourceConfiguration;
};

export type ITestJob = {
  toObj(): object;
  test: ITest;
  runner: (x: ITTestResourceConfiguration, t: ITLog) => Promise<
    BaseSuite<
      IBaseTest
    >
  >;
  testResourceRequirement: ITTestResourceRequirement;
  receiveTestResourceConfig: (testResource?) => Promise<{
    failed: number,
    artifacts: Promise<unknown>[],
    logPromise: Promise<unknown>
  }>
};

export type ITestResults = Promise<{ test: ITest }>[];

export const defaultTestResourceRequirement: ITTestResourceRequest = {
  ports: 0
};

export type ITestArtifactory = (key: string, value: unknown) => unknown;

export type ITestCheckCallback<ITestShape extends IBaseTest> = {
  [K in keyof ITestShape["checks"]]: (
    name: string,
    features: string[],
    callbackA: (
      whens: {
        [K in keyof ITestShape["whens"]]: (
          ...unknown
        ) => BaseWhen<
          ITestShape
        >;
      },
      thens: {
        [K in keyof ITestShape["thens"]]: (
          ...unknown
        ) => BaseThen<
          ITestShape
        >;
      }
    ) => Promise<any>,
    ...xtrasA: ITestShape["checks"][K]
  ) => BaseCheck<
    ITestShape
  >;
};

