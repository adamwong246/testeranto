/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PM_Pure } from "../PM/pure.js";

import { PM_Node } from "../PM/node.js";
import { PM_Web } from "../PM/web.js";
import { ITestconfig, IBuiltConfig, IRunTime, ITestTypes } from "../Types.js";

import { IGivens } from "./abstractBase.js";
import { IPM } from "./types.js";
import type {
  ITestInterface,
  Ibdd_in_any,
  Ibdd_out_any,
} from "../CoreTypes.js";
import { BaseSuite } from "./BaseSuite.js";

export const BaseTestInterface = <
  T extends Ibdd_in_any
>(): ITestInterface<T> => ({
  beforeAll: async (s: T["istore"]) => s,
  beforeEach: async function (
    subject: T["isubject"],
    initialValues: T["iinitialValues"],
    x: unknown,
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<T["isubject"]> {
    return subject;
  },
  afterEach: async (s: T["istore"]) => s,
  afterAll: (store: T["istore"]) => undefined,
  butThen: async (
    store: T["istore"],
    thenCb: (s: T["iselection"]) => Promise<T["isubject"]>
  ) => {
    return thenCb(store);
  },
  andWhen: async (
    store: T["istore"],
    whenCB: T["when"],
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ) => {
    try {
      await whenCB(store, testResource, pm);
    } catch (error) {
      console.error("Error in andWhen:", error);
      throw error; // Re-throw to maintain test failure
    }
  },
  assertThis: (x: any) => x,
});

export const DefaultTestInterface = <T extends Ibdd_in_any>(
  p: Partial<ITestInterface<T>>
): ITestInterface<T> => {
  return {
    ...BaseTestInterface,
    ...p,
  };
};

export type ITTestResourceConfiguration = {
  name: string;
  fs: string;
  ports: number[];
  browserWSEndpoint?: string;
  timeout?: number;
  retries?: number;
  environment?: Record<string, string>;
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
  givens: IGivens<Ibdd_in_any>;
  testResourceConfiguration: ITTestResourceConfiguration;
};

export type ITestJob = {
  toObj(): object;
  test: ITest;
  runner: (
    x: ITTestResourceConfiguration,
    t: ITLog
  ) => Promise<BaseSuite<Ibdd_in_any, Ibdd_out_any>>;
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
  nodeEntryPointSidecars: Record<string, string>;
  webEntryPoints: Record<string, string>;
  webEntryPointSidecars: Record<string, string>;
  pureEntryPoints: Record<string, string>;
  pureEntryPointSidecars: Record<string, string>;
};

export type IFinalResults = {
  features: string[];
  failed: boolean;
  fails: number;
  artifacts: Promise<unknown>[];
  logPromise: Promise<unknown>;
};
