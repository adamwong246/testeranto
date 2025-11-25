/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin } from "esbuild";
import { Ibdd_in_any, Ibdd_out_any } from "./CoreTypes.js";
import { BaseGiven, IGivens } from "./lib/BaseGiven.js";
import { BaseSuite } from "./lib/BaseSuite.js";
import { BaseThen } from "./lib/BaseThen.js";
import { BaseWhen } from "./lib/BaseWhen.js";
import { ITTestResourceConfiguration } from "./lib/index.js";
import { PM } from "./PM/index.js";

export type ISummary = Record<
  string,
  {
    runTimeTests: number | "?" | undefined;
    runTimeErrors: number | "?" | undefined;
    typeErrors: number | "?" | undefined;
    staticErrors: number | "?" | undefined;
    prompt: string | "?" | undefined;
    failingFeatures: object | undefined;
  }
> & {
  nodeLogs?: string;
  webLogs?: string;
  pureLogs?: string;
};

export type SuiteSpecification<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any
> = {
  [K in keyof O["suites"]]: (
    name: string,
    givens: IGivens<I>
  ) => BaseSuite<I, O>;
};

// Simplified test result summary
export type TestSummary = {
  testName: string;
  errors?: {
    runtime?: number;
    type?: number;
    static?: number;
  };
  prompt?: string;
  failedFeatures: string[];
};

// Core test lifecycle hooks
export type TestLifecycle<Subject, State, Selection> = {
  // Setup
  beforeAll?: (input: any) => Promise<Subject>;
  beforeEach?: (subject: Subject) => Promise<State>;

  // Execution
  executeStep?: (state: State) => Promise<State>;
  verifyStep?: (state: State) => Promise<Selection>;

  // Cleanup
  afterEach?: (state: State) => Promise<void>;
  afterAll?: (state: State) => Promise<void>;

  // Assertions
  assert?: (result: Selection) => void;
};

// BDD Test Structure
export type TestDefinition<Subject, State, Selection> = {
  // Test subject
  subject: Subject;

  // Test steps
  given?: (input: any) => State;
  when?: (state: State) => State | Promise<State>;
  then?: (state: State) => Selection | Promise<Selection>;

  // Configuration
  resources?: ITTestResourceConfiguration;
  pm?: typeof PM;
};

// Test Suite Organization
export type TestSuite = {
  name: string;
  tests: TestDefinition<any, any, any>[];
  features?: string[];
};

// Runtime Configuration
export type RuntimeConfig = {
  type: "node" | "web" | "pure" | "spawn";
  ports?: number[];
  plugins?: Plugin[];
};

// Project Configuration
export type ProjectConfig = {
  name: string;
  sourceDir: string;
  testSuites: TestSuite[];
  runtime: RuntimeConfig;
  minify?: boolean;
  debug?: boolean;
};

export type GivenSpecification<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any
> = {
  [K in keyof O["givens"]]: (
    features: string[],
    whens: BaseWhen<I>[],
    thens: BaseThen<I>[],
    ...xtrasB: O["givens"][K]
  ) => BaseGiven<I>;
};

export type WhenSpecification<I extends Ibdd_in_any, O extends Ibdd_out_any> = {
  [K in keyof O["whens"]]: (...xtrasC: O["whens"][K]) => BaseWhen<I>;
};

export type ThenSpecification<I extends Ibdd_in_any, O extends Ibdd_out_any> = {
  [K in keyof O["thens"]]: (...xtrasD: O["thens"][K]) => BaseThen<I>;
};

//////////////////////////////////////////////////////////////////////////////////////////////

// Base implementation types
export type TestSuiteImplementation<O extends Ibdd_out_any> = {
  [K in keyof O["suites"]]: string;
};

export type TestGivenImplementation<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any
> = {
  [K in keyof O["givens"]]: (...Ig: O["givens"][K]) => I["given"];
};

export type TestWhenImplementation<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any
> = {
  [K in keyof O["whens"]]: (
    ...Iw: O["whens"][K]
  ) => (
    zel: I["iselection"],
    tr: ITTestResourceConfiguration,
    utils: PM
  ) => Promise<I["when"]>;
};

export type TestThenImplementation<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any
> = {
  [K in keyof O["thens"]]: (
    ...It: O["thens"][K]
  ) => (ssel: I["iselection"], utils: PM) => I["then"];
};

//////////////////////////////////////////////////////////////////////////////////////////////

export type Modify<T, R> = Omit<T, keyof R> & R;

// Individual output shape components
export type TestSuiteShape = Record<string, any>;
export type TestGivenShape = Record<string, any>;
export type TestWhenShape = Record<string, any>;
export type TestThenShape = Record<string, any>;

//////////////////////////////////////////////////////////////////////////////////////////////

export type IPluginFactory = (
  register?: (entrypoint: string, sources: string[]) => any,
  entrypoints?: string[]
) => Plugin;

export type IRunTime = `node` | `web` | "pure" | `golang` | `python`;

export type ITestTypes = [string, IRunTime, { ports: number }, ITestTypes[]];

export type IDockerFile = [
  (
    | ["COPY", string]
    | ["WORKDIR", string]
    | ["RUN", string]
    | ["FROM", string]
    | ["STATIC_ANALYSIS", (files) => [string, ...string[]]]
  )[],
  string
];

export type ITests = {
  plugins: any[];
  tests: Record<string, { ports: number }>;
  loaders: Record<string, string>;
  dockerfile: IDockerFile;
};

export type ITestconfig = {
  featureIngestor: (s: string) => Promise<string>;
  importPlugins: IPluginFactory[];
  ports: string[];
  src: string;

  golang: ITests;
  python: ITests;
  node: ITests & {
    externals: string[];
  };
  web: ITests & {
    externals: string[];
  };
};

export type IBuiltConfig = { buildDir: string } & ITestconfig;
