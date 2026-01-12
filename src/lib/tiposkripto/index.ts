import { Ibdd_in_any, ITestAdapter, Ibdd_out_any } from "../../CoreTypes";
import { IGivens } from "./BaseGiven";
import { BaseSuite } from "./BaseSuite";

export const BaseAdapter = <T extends Ibdd_in_any>(): ITestAdapter<T> => ({
  beforeAll: async (
    input: T["iinput"],
    testResource: ITestResourceConfiguration
  ) => {
    return input as unknown as T["isubject"];
  },
  beforeEach: async function (
    subject: T["isubject"],
    initializer: (c?: any) => T["given"],
    testResource: ITestResourceConfiguration,
    initialValues: any
  ): Promise<T["istore"]> {
    return subject as unknown as T["istore"];
  },
  afterEach: async (store: T["istore"], key: string) => Promise.resolve(store),
  afterAll: (store: T["istore"]) => undefined,
  butThen: async (
    store: T["istore"],
    thenCb: T["then"],
    testResource: ITestResourceConfiguration
  ) => {
    return thenCb(store);
  },
  andWhen: async (
    store: T["istore"],
    whenCB: T["when"],
    testResource: ITestResourceConfiguration
  ) => {
    return whenCB(store);
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

export type ITestResourceConfiguration = {
  name: string;
  fs: string;
  ports: number[];
  files: string[];
};

export type ITTestResourceRequirement = {
  name: string;
  ports: number;
  fs: string;
};

export type ITTestResourceRequest = {
  ports: number;
};

type ITest = {
  toObj(): object;
  name: string;
  givens: IGivens<Ibdd_in_any>;
  testResourceConfiguration: ITestResourceConfiguration;
};

export type ITestJob = {
  toObj(): object;
  test: ITest;
  runner: (
    x: ITestResourceConfiguration
  ) => Promise<BaseSuite<Ibdd_in_any, Ibdd_out_any>>;
  testResourceRequirement: ITTestResourceRequirement;
  receiveTestResourceConfig: (x) => IFinalResults;
};

export type ITestResults = Promise<{ test: ITest }>[];

export const defaultTestResourceRequirement: ITTestResourceRequest = {
  ports: 0,
};

export type ITestArtifactory = (key: string, value: unknown) => unknown;

export type IRunnables = {
  golangEntryPoints: Record<string, string>;
  nodeEntryPoints: Record<string, string>;
  pythonEntryPoints: Record<string, string>;
  webEntryPoints: Record<string, string>;
};

export type IFinalResults = {
  features: string[];
  failed: boolean;
  fails: number;
  artifacts: Promise<unknown>[];
  tests: number;
  runTimeTests: number;
  testJob: object;
};
