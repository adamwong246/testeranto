import { ITestResourceConfiguration } from "./lib/tiposkripto/src/index.mjs";
import { BaseGiven, IGivens } from "./lib/tiposkripto/BaseGiven";
import { BaseSuite } from "./lib/tiposkripto/BaseSuite";
import { BaseThen } from "./lib/tiposkripto/BaseThen";
import { BaseWhen } from "./lib/tiposkripto/BaseWhen";
import { Ibdd_in_any, Ibdd_out_any } from "./lib/tiposkripto/src/CoreTypes";
export type IChecks = ((x: any) => string)[];
export type ISummary = Record<string, {
    runTimeTests: number | "?" | undefined;
    runTimeErrors: number | "?" | undefined;
    typeErrors: number | "?" | undefined;
    staticErrors: number | "?" | undefined;
    prompt: string | "?" | undefined;
    failingFeatures: object | undefined;
}> & {
    nodeLogs?: string;
    webLogs?: string;
    pureLogs?: string;
};
export type SuiteSpecification<I extends Ibdd_in_any, O extends Ibdd_out_any> = {
    [K in keyof O["suites"]]: (name: string, givens: IGivens<I>) => BaseSuite<I, O>;
};
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
export type GivenSpecification<I extends Ibdd_in_any, O extends Ibdd_out_any> = {
    [K in keyof O["givens"]]: (features: string[], whens: BaseWhen<I>[], thens: BaseThen<I>[], ...xtrasB: O["givens"][K]) => BaseGiven<I>;
};
export type WhenSpecification<I extends Ibdd_in_any, O extends Ibdd_out_any> = {
    [K in keyof O["whens"]]: (...xtrasC: O["whens"][K]) => BaseWhen<I>;
};
export type ThenSpecification<I extends Ibdd_in_any, O extends Ibdd_out_any> = {
    [K in keyof O["thens"]]: (...xtrasD: O["thens"][K]) => BaseThen<I>;
};
export type TestSuiteImplementation<O extends Ibdd_out_any> = {
    [K in keyof O["suites"]]: string;
};
export type TestGivenImplementation<I extends Ibdd_in_any, O extends Ibdd_out_any> = {
    [K in keyof O["givens"]]: (...Ig: O["givens"][K]) => I["given"];
};
export type TestWhenImplementation<I extends Ibdd_in_any, O extends Ibdd_out_any> = {
    [K in keyof O["whens"]]: (...Iw: O["whens"][K]) => (zel: I["iselection"], tr: ITestResourceConfiguration) => Promise<I["when"]>;
};
export type TestThenImplementation<I extends Ibdd_in_any, O extends Ibdd_out_any> = {
    [K in keyof O["thens"]]: (...It: O["thens"][K]) => (ssel: I["iselection"]) => I["then"];
};
export type Modify<T, R> = Omit<T, keyof R> & R;
export type TestSuiteShape = Record<string, any>;
export type TestGivenShape = Record<string, any>;
export type TestWhenShape = Record<string, any>;
export type TestThenShape = Record<string, any>;
export type IPluginFactory = (register?: (entrypoint: string, sources: string[]) => any, entrypoints?: string[]) => Plugin;
export type IRunTime = `node` | `web` | `golang` | `python` | `ruby` | `java` | `rust`;
export type ITestTypes = [string, IRunTime, {
    ports: number;
}, ITestTypes[]];
export type IDockerSteps = "RUN" | "WORKDIR" | "COPY";
export type IBaseTestConfig = {
    runtime: string;
    tests: string[];
    dockerfile: string;
    buildOptions: string;
    checks: IChecks;
};
export type ITestconfigV2Node = IBaseTestConfig & {
    plugins: any[];
};
export type ITestconfigV2 = {
    featureIngestor: (s: string) => Promise<string>;
    runtimes: Record<string, IBaseTestConfig>;
};
