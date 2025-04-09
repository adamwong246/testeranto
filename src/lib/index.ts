import { PM_Pure } from "../PM/pure.js";

import { PM_Node } from "../PM/node.js";
import { PM_Web } from "../PM/web.js";
import {
  Ibdd_in,
  Ibdd_out,
  ITestInterface,
  ITestconfig,
  IBuiltConfig,
  IRunTime,
  ITestTypes,
  IT,
  OT,
} from "../Types.js";

import { IGivens, BaseCheck, BaseSuite } from "./abstractBase.js";
import { IPM } from "./types.js";

export const BaseTestInterface: ITestInterface<
  Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>
> = {
  beforeAll: async (s) => s,
  beforeEach: async function (
    subject: any,
    initialValues: any,
    x: any,
    testResource: any,
    pm: IPM
  ) {
    return subject as any;
  },
  afterEach: async (s) => s,
  afterAll: (
    store: Ibdd_in<
      unknown,
      unknown,
      unknown,
      unknown,
      unknown,
      unknown,
      unknown
    >["istore"]
  ) => undefined,
  butThen: async (
    store: Ibdd_in<
      unknown,
      unknown,
      unknown,
      unknown,
      unknown,
      unknown,
      unknown
    >["istore"],
    thenCb: any
  ) => {
    try {
      thenCb(store);
    } catch (e) {}
  },
  andWhen: async (a) => a,
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
    Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>
  >;
  checks: BaseCheck<IT>[];
  testResourceConfiguration: ITTestResourceConfiguration;
};

export type ITestJob = {
  toObj(): object;
  test: ITest;
  runner: (
    x: ITTestResourceConfiguration,
    t: ITLog
  ) => Promise<BaseSuite<IT, OT>>;
  testResourceRequirement: ITTestResourceRequirement;
  receiveTestResourceConfig: (pm: PM_Node | PM_Web | PM_Pure) => IFinalResults;
};

export type ITestResults = Promise<{ test: ITest }>[];

export const defaultTestResourceRequirement: ITTestResourceRequest = {
  ports: 0,
};

export type ITestArtifactory = (key: string, value: unknown) => unknown;

export type { ITestconfig, IBuiltConfig, IRunTime, ITestTypes };

export type IRunnables = {
  nodeEntryPoints: Record<string, string>;
  webEntryPoints: Record<string, string>;
  importEntryPoints: Record<string, string>;
};

export type IFinalResults = {
  features: string[];
  failed: boolean;
  fails: number;
  artifacts: Promise<unknown>[];
  logPromise: Promise<unknown>;
};
