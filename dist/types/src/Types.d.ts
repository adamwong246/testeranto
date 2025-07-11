import { Plugin } from "esbuild";
import { ITTestResourceConfiguration } from "./lib/index.js";
import { PM } from "./PM/index.js";
import { IT, OT } from "../dist/types/src/Types.js";
import { IGivens, BaseCheck, BaseSuite, BaseWhen, BaseThen, BaseGiven } from "./lib/abstractBase.js";
import { ITestCheckCallback } from "./lib/types.js";
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
export type TestLifecycle<Subject, State, Selection> = {
    beforeAll?: (input: any) => Promise<Subject>;
    beforeEach?: (subject: Subject) => Promise<State>;
    executeStep?: (state: State) => Promise<State>;
    verifyStep?: (state: State) => Promise<Selection>;
    afterEach?: (state: State) => Promise<void>;
    afterAll?: (state: State) => Promise<void>;
    assert?: (result: Selection) => void;
};
export type TestDefinition<Subject, State, Selection> = {
    subject: Subject;
    given?: (input: any) => State;
    when?: (state: State) => State | Promise<State>;
    then?: (state: State) => Selection | Promise<Selection>;
    resources?: ITTestResourceConfiguration;
    pm?: typeof PM;
};
export type TestSuite = {
    name: string;
    tests: TestDefinition<any, any, any>[];
    features?: string[];
};
export type RuntimeConfig = {
    type: "node" | "web" | "pure" | "spawn";
    ports?: number[];
    plugins?: Plugin[];
};
export type ProjectConfig = {
    name: string;
    sourceDir: string;
    testSuites: TestSuite[];
    runtime: RuntimeConfig;
    minify?: boolean;
    debug?: boolean;
};
export type SuiteSpecification<I extends IT, O extends OT> = {
    [K in keyof O["suites"]]: (name: string, givens: IGivens<I>, checks: BaseCheck<I>[]) => BaseSuite<I, O>;
};
export type GivenSpecification<I extends IT, O extends OT> = {
    [K in keyof O["givens"]]: (features: string[], whens: BaseWhen<I>[], thens: BaseThen<I>[], ...xtrasB: O["givens"][K]) => BaseGiven<I>;
};
export type WhenSpecification<I extends IT, O extends OT> = {
    [K in keyof O["whens"]]: (...xtrasC: O["whens"][K]) => BaseWhen<I>;
};
export type ThenSpecification<I extends IT, O extends OT> = {
    [K in keyof O["thens"]]: (...xtrasD: O["thens"][K]) => BaseThen<I>;
};
export type ITestSpecification<I extends IT, O extends OT> = (Suite: SuiteSpecification<I, O>, Given: GivenSpecification<I, O>, When: WhenSpecification<I, O>, Then: ThenSpecification<I, O>, Check: ITestCheckCallback<I, O>) => any[];
export type TestSuiteImplementation<O extends OT> = {
    [K in keyof O["suites"]]: string;
};
export type TestGivenImplementation<I extends IT, O extends OT> = {
    [K in keyof O["givens"]]: (...Ig: O["givens"][K]) => I["given"];
};
export type TestWhenImplementation<I extends IT, O extends OT> = {
    [K in keyof O["whens"]]: (...Iw: O["whens"][K]) => (zel: I["iselection"], tr: ITTestResourceConfiguration, utils: PM) => Promise<I["when"]>;
};
export type TestThenImplementation<I extends IT, O extends OT> = {
    [K in keyof O["thens"]]: (...It: O["thens"][K]) => (ssel: I["iselection"], utils: PM) => I["then"];
};
export type TestCheckImplementation<I extends IT, O extends OT> = {
    [K in keyof O["checks"]]: (...Ic: O["checks"][K]) => I["given"];
};
export type ITestImplementation<I extends IT, O extends OT, modifier = {
    whens: TestWhenImplementation<I, O>;
}> = Modify<{
    suites: TestSuiteImplementation<O>;
    givens: TestGivenImplementation<I, O>;
    whens: TestWhenImplementation<I, O>;
    thens: TestThenImplementation<I, O>;
    checks: TestCheckImplementation<I, O>;
}, modifier>;
export type Modify<T, R> = Omit<T, keyof R> & R;
export type TestSuiteShape = Record<string, any>;
export type TestGivenShape = Record<string, any>;
export type TestWhenShape = Record<string, any>;
export type TestThenShape = Record<string, any>;
export type TestCheckShape = Record<string, any>;
export type Ibdd_out<ISuites extends TestSuiteShape = TestSuiteShape, IGivens extends TestGivenShape = TestGivenShape, IWhens extends TestWhenShape = TestWhenShape, IThens extends TestThenShape = TestThenShape, IChecks extends TestCheckShape = TestCheckShape> = {
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
export type Ibdd_in<IInput, // Type of initial test input
ISubject, // Type of object being tested
IStore, // Type for storing test state between steps
ISelection, // Type for selecting state for assertions
IGiven, // Type for Given step functions
IWhen, // Type for When step functions
IThen> = {
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
export type IPluginFactory = (register?: (entrypoint: string, sources: string[]) => any, entrypoints?: string[]) => Plugin;
export type IRunTime = `node` | `web` | "pure" | `spawn`;
export type ITestTypes = [string, IRunTime, {
    ports: number;
}, ITestTypes[]];
export type ITestconfig = {
    clearScreen: boolean;
    debugger: boolean;
    externals: string[];
    externalTests: Record<string, {
        watch: string[];
        exec: string;
    }>;
    featureIngestor: (s: string) => Promise<string>;
    importPlugins: IPluginFactory[];
    minify: boolean;
    nodePlugins: IPluginFactory[];
    ports: string[];
    src: string;
    tests: ITestTypes[];
    webPlugins: IPluginFactory[];
};
export type IBuiltConfig = {
    buildDir: string;
} & ITestconfig;
export type IProject = {
    projects: Record<string, ITestconfig>;
};
