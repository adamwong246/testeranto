/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

export type ISummary = Record<
  string,
  {
    runTimeError?: number | "?";
    typeErrors?: number | "?";
    staticErrors?: number | "?";
    prompt?: string | "?";
    failingFeatures: Record<string, string[]>;
  }
>;

/**
 * Defines the interface for test lifecycle operations.
 * @template I - The test input type extending IT
 */
export type ITestInterface<I extends IT = IT> = {
  /** Assertion function to validate test results */
  assertThis: (x: I["then"]) => any;
  
  /** Executes a When step */
  andWhen: (
    store: I["istore"],
    whenCB: I["when"],
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ) => Promise<I["istore"]>;
  
  /** Executes a Then step */  
  butThen: (
    store: I["istore"],
    thenCB: I["then"],
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ) => Promise<I["iselection"]>;
  
  /** Runs after all tests complete */
  afterAll: (store: I["istore"], pm: IPM) => any;
  
  /** Runs after each test case */
  afterEach: (store: I["istore"], key: string, pm: IPM) => Promise<unknown>;
  
  /** Runs before all tests start */
  beforeAll: (
    input: I["iinput"],
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ) => Promise<I["isubject"]>;
  
  /** Runs before each test case */
  beforeEach: (
    subject: I["isubject"],
    initializer: (c?) => I["given"],
    testResource: ITTestResourceConfiguration,
    initialValues,
    pm: IPM
  ) => Promise<I["istore"]>;
};

// Example usage:
/*
interface MyTestInterface extends ITestInterface<MyTestType> {
  beforeEach: (subject, initializer) => {
    console.log('Setting up test');
    return initializer();
  }
}
*/

export type IWebTestInterface<I extends IT> = ITestInterface<I>;

export type INodeTestInterface<I extends IT> = ITestInterface<I>;

export type IPartialInterface<I extends IT> = Partial<ITestInterface<I>>;

export type IPartialNodeInterface<I extends IT> = Partial<
  INodeTestInterface<I>
>;
export type IPartialWebInterface<I extends IT> = Partial<IWebTestInterface<I>>;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Core test type defining the shape of BDD test inputs and operations.
 * Each generic parameter represents:
 * @template IInput - Type of initial test input
 * @template ISubject - Type of test subject being tested 
 * @template IStore - Type of test state storage
 * @template ISelection - Type of selected test state
 * @template IGiven - Type for Given steps
 * @template IWhen - Type for When steps 
 * @template IThen - Type for Then steps
 */
export type IT = Ibdd_in<
  unknown,  // IInput
  unknown,  // ISubject
  unknown,  // IStore
  unknown,  // ISelection
  unknown,  // IGiven
  unknown,  // IWhen
  unknown   // IThen
>;

// Example usage:
/*
type RectangleTest = Ibdd_in<
  null,                   // No initial input needed
  Rectangle,              // Test subject is Rectangle class
  Rectangle,              // Store complete Rectangle state
  Rectangle,              // Select complete Rectangle for assertions
  (w: number, h: number) => Rectangle,  // Given creates Rectangle
  (n: number) => (r: Rectangle) => void, // When modifies Rectangle
  (r: Rectangle) => number              // Then checks Rectangle props
>;
*/

export type OT = Ibdd_out<
  Record<string, any>,
  Record<string, any>,
  Record<string, any>,
  Record<string, any>,
  Record<string, any>
>;

// Specification component types
export type SuiteSpecification<I extends IT, O extends OT> = {
  [K in keyof O["suites"]]: (
    name: string,
    givens: IGivens<I>,
    checks: BaseCheck<I>[]
  ) => BaseSuite<I, O>;
};

export type GivenSpecification<I extends IT, O extends OT> = {
  [K in keyof O["givens"]]: (
    features: string[],
    whens: BaseWhen<I>[],
    thens: BaseThen<I>[],
    ...xtrasB: O["givens"][K]
  ) => BaseGiven<I>;
};

export type WhenSpecification<I extends IT, O extends OT> = {
  [K in keyof O["whens"]]: (...xtrasC: O["whens"][K]) => BaseWhen<I>;
};

export type ThenSpecification<I extends IT, O extends OT> = {
  [K in keyof O["thens"]]: (...xtrasD: O["thens"][K]) => BaseThen<I>;
};

// Complete test specification
export type ITestSpecification<I extends IT, O extends OT> = (
  Suite: SuiteSpecification<I, O>,
  Given: GivenSpecification<I, O>,
  When: WhenSpecification<I, O>,
  Then: ThenSpecification<I, O>,
  Check: ITestCheckCallback<I, O>
) => any[];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Base implementation types
export type TestSuiteImplementation<O extends OT> = {
  [K in keyof O["suites"]]: string;
};

export type TestGivenImplementation<I extends IT, O extends OT> = {
  [K in keyof O["givens"]]: (...Ig: O["givens"][K]) => I["given"];
};

export type TestWhenImplementation<I extends IT, O extends OT> = {
  [K in keyof O["whens"]]: (
    ...Iw: O["whens"][K]
  ) => (
    zel: I["iselection"],
    tr: ITTestResourceConfiguration,
    utils: PM
  ) => Promise<I["when"]>;
};

export type TestThenImplementation<I extends IT, O extends OT> = {
  [K in keyof O["thens"]]: (
    ...It: O["thens"][K]
  ) => (ssel: I["iselection"], utils: PM) => I["then"];
};

export type TestCheckImplementation<I extends IT, O extends OT> = {
  [K in keyof O["checks"]]: (...Ic: O["checks"][K]) => I["given"];
};

// Complete test implementation
export type ITestImplementation<
  I extends IT,
  O extends OT,
  modifier = {
    whens: TestWhenImplementation<I, O>;
  }
> = Modify<
  {
    suites: TestSuiteImplementation<O>;
    givens: TestGivenImplementation<I, O>;
    whens: TestWhenImplementation<I, O>;
    thens: TestThenImplementation<I, O>;
    checks: TestCheckImplementation<I, O>;
  },
  modifier
>;

// export type ITestImplementation<
//   I extends IT,
//   O extends OT,
//   modifier = Partial<{
//     // givens: string;
//     givens: {
//       [K in keyof O["givens"]]: (...Ig: O["givens"][K]) => I["given"];
//     };
//   }>
// > = Modify<
//   {
//     // suites: {
//     //   // [K in keyof O["suites"]]: unknown;
//     //   [K in keyof O["suites"]]: (...Ig: O["suites"][K]) => I["suites"];
//     // };
//     // suites: [];

//     // givens: {
//     //   [K in keyof O["givens"]]: (...Ig: O["givens"][K]) => I["given"];
//     // };

//     whens: {
//       [K in keyof O["whens"]]: (
//         ...Iw: O["whens"][K]
//       ) => (zel: I["iselection"], utils: PM) => Promise<I["when"]>;
//     };
//     thens: {
//       [K in keyof O["thens"]]: (
//         ...It: O["thens"][K]
//       ) => (ssel: I["iselection"], utils: PM) => I["then"];
//     };
//     checks: {
//       [K in keyof O["checks"]]: (...Ic: O["checks"][K]) => I["given"];
//     };
//   },
//   modifier
// >;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type Modify<T, R> = Omit<T, keyof R> & R;

// Individual output shape components
export type TestSuiteShape = Record<string, any>;
export type TestGivenShape = Record<string, any>;
export type TestWhenShape = Record<string, any>;
export type TestThenShape = Record<string, any>;
export type TestCheckShape = Record<string, any>;

// Complete BDD output shape
export type Ibdd_out<
  ISuites extends TestSuiteShape = TestSuiteShape,
  IGivens extends TestGivenShape = TestGivenShape,
  IWhens extends TestWhenShape = TestWhenShape,
  IThens extends TestThenShape = TestThenShape,
  IChecks extends TestCheckShape = TestCheckShape
> = {
  suites: ISuites;
  givens: IGivens;
  whens: IWhens;
  thens: IThens;
  checks: IChecks;
};

/**
 * Defines the input shape for BDD test definitions.
 * This is the core type that structures all test operations.
 */
export type Ibdd_in<
  IInput,     // Type of initial test input
  ISubject,   // Type of object being tested
  IStore,     // Type for storing test state between steps  
  ISelection, // Type for selecting state for assertions
  IGiven,     // Type for Given step functions
  IWhen,      // Type for When step functions
  IThen       // Type for Then step functions
> = {
  /** Initial input required to start tests */
  iinput: IInput;
  
  /** The subject being tested (class, function, etc) */
  isubject: ISubject;
  
  /** Complete test state storage */
  istore: IStore;
  
  /** Selected portion of state for assertions */  
  iselection: ISelection;
  
  /** Function type for Given steps */
  given: IGiven;
  
  /** Function type for When steps */
  when: IWhen;
  
  /** Function type for Then steps */
  then: IThen;
};

// Example usage:
/*
type CounterTest = Ibdd_in<
  number,                     // Initial count value
  Counter,                    // Test subject is Counter class
  { counter: Counter, env: any }, // Store counter + environment
  number,                     // Assert against current count
  (init: number) => Counter,  // Given creates Counter
  (delta: number) => (c: Counter) => void, // When modifies Counter
  (expected: number) => (c: Counter) => void // Then asserts count
>;
*/

///////////////////////////////////////////////

export type IPluginFactory = (
  register?: (entrypoint: string, sources: string[]) => any,
  entrypoints?: string[]
) => Plugin;

export type IRunTime = `node` | `web` | "pure" | `spawn`;

export type ITestTypes = [string, IRunTime, { ports: number }, ITestTypes[]];

export type ITestconfig = {
  clearScreen: boolean;
  debugger: boolean;
  externals: string[];
  externalTests: Record<string, { watch: string[]; exec: string }>;
  featureIngestor: (s: string) => Promise<string>;
  importPlugins: IPluginFactory[];
  minify: boolean;
  nodePlugins: IPluginFactory[];
  ports: string[];
  src: string;
  tests: ITestTypes[];
  webPlugins: IPluginFactory[];
};

export type IBuiltConfig = { buildDir: string } & ITestconfig;

export type IProject = {
  projects: Record<string, ITestconfig>;
};
