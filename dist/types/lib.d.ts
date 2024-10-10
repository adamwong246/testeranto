import { IGivens, BaseCheck, BaseSuite, BaseThen, BaseWhen } from "./base.js";
export declare type ITTestResourceConfiguration = {
    name: string;
    fs: string;
    ports: number[];
    scheduled: boolean;
};
export declare type ITTestResourceRequirement = {
    name: string;
    ports: number;
    fs: string;
};
export declare type ITTestResourceRequest = {
    ports: number;
};
export declare type ITTestShape = {
    suites: any;
    givens: any;
    whens: any;
    thens: any;
    checks: any;
};
export declare type ITTTestShape<T extends ITTestShape> = {
    suites: any;
    givens: any;
    whens: any;
    thens: any;
    checks: any;
};
export declare type ITLog = (...string: any[]) => void;
export declare type ILogWriter = {
    createWriteStream: (line: string) => any | any;
    writeFileSync: (fp: string, contents: string) => any;
    mkdirSync: (fp: string) => any;
    testArtiFactoryfileWriter: (tLog: ITLog, n: (Promise: any) => void) => (fPath: string, value: unknown) => void;
};
export declare type ITestArtificer = (key: string, data: any) => void;
declare type ITest = {
    toObj(): object;
    name: string;
    givens: IGivens<unknown, unknown, unknown, unknown, unknown>;
    checks: BaseCheck<unknown, unknown, unknown, unknown, ITTestShape>[];
    testResourceConfiguration: ITTestResourceConfiguration;
};
export declare type ITestJob = {
    toObj(): object;
    test: ITest;
    runner: (x: ITTestResourceConfiguration, t: ITLog) => Promise<BaseSuite<any, any, any, any, any, any, any>>;
    testResourceRequirement: ITTestResourceRequirement;
    receiveTestResourceConfig: (testResource?: any) => Promise<{
        failed: number;
        artifacts: Promise<unknown>[];
        logPromise: Promise<unknown>;
    }>;
};
export declare type ITestResults = Promise<{
    test: ITest;
}>[];
export declare const defaultTestResourceRequirement: ITTestResourceRequest;
export declare type ITestArtifactory = (key: string, value: unknown) => unknown;
export declare type ITestCheckCallback<ITestShape extends ITTestShape> = {
    [K in keyof ITestShape["checks"]]: (name: string, features: string[], callbackA: (whens: {
        [K in keyof ITestShape["whens"]]: (...unknown: any[]) => BaseWhen<unknown, unknown, unknown>;
    }, thens: {
        [K in keyof ITestShape["thens"]]: (...unknown: any[]) => BaseThen<unknown, unknown, unknown>;
    }) => Promise<any>, ...xtrasA: ITestShape["checks"][K]) => BaseCheck<unknown, unknown, unknown, unknown, ITestShape>;
};
export {};
