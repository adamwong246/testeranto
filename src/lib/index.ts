/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// Do not add logging to this file as it is used by the pure runtime.

import { Ibdd_in_any, ITestAdapter, Ibdd_out_any } from "../CoreTypes";
import { PM_Node } from "../PM/node";
import { PM_Pure } from "../PM/pure";
import { PM_Web } from "../PM/web";
import { ITestconfig, IBuiltConfig, IRunTime, ITestTypes } from "../Types";
import { IGivens } from "./abstractBase";
import { BaseSuite } from "./BaseSuite";
import { IPM } from "./types";

export const BaseAdapter = <T extends Ibdd_in_any>(): ITestAdapter<T> => ({
  beforeAll: async (input: T["iinput"], testResource: ITTestResourceConfiguration, pm: IPM) => {
    return input as unknown as T["isubject"];
  },
  beforeEach: async function (
    subject: T["isubject"],
    initializer: (c?: any) => T["given"],
    testResource: ITTestResourceConfiguration,
    initialValues: any,
    pm: IPM
  ): Promise<T["istore"]> {
    return subject as unknown as T["istore"];
  },
  afterEach: async (store: T["istore"], key: string, pm: IPM) => Promise.resolve(store),
  afterAll: (store: T["istore"], pm: IPM) => undefined,
  butThen: async (
    store: T["istore"],
    thenCb: T["then"],
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ) => {
    return thenCb(store, pm);
  },
  andWhen: async (
    store: T["istore"],
    whenCB: T["when"],
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ) => {
    return whenCB(store, pm);
  },
  assertThis: (x: T["then"]) => x,
});

export const DefaultAdapter = <T extends Ibdd_in_any>(
  p: Partial<ITestAdapter<T>>
): ITestAdapter<T> => {
  const base = BaseAdapter<T>();
  return {
    ...base,
    ...p,
  } as ITestAdapter<T>;
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
    n: (promise: Promise<any>) => void
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
  // logPromise: Promise<unknown>;
};
