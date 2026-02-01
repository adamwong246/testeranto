import { Ibdd_in_any, Ibdd_out_any } from "./CoreTypes";
import { IGivens, BaseGiven } from "./BaseGiven";
import { BaseSuite } from "./BaseSuite";
import { BaseThen } from "./BaseThen";
import { BaseWhen } from "./BaseWhen";

export type ISuiteKlasser<I extends Ibdd_in_any, O extends Ibdd_out_any> = (
  name: string,
  index: number,
  givens: IGivens<I>
) => BaseSuite<I, O>;

export type IGivenKlasser<I extends Ibdd_in_any> = (
  name,
  features,
  whens,
  thens,
  givenCB
) => BaseGiven<I>;

export type IWhenKlasser<I extends Ibdd_in_any> = (s, o) => BaseWhen<I>;

export type IThenKlasser<I extends Ibdd_in_any> = (s, o) => BaseThen<I>;

export type ITestResourceConfiguration = {
  name: string;
  fs: string;
  ports: number[];
  files: string[];
  timeout?: number;
  retries?: number;
  environment?: Record<string, any>;
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
