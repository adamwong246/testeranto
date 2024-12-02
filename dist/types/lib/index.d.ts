import { PM } from "../PM/index.js";
import { IBaseTest } from "../Types.js";
import { IGivens, BaseCheck, BaseSuite, BaseWhen, BaseThen } from "./abstractBase.js";
import { ITestInterface } from "./types.js";
export declare const BaseTestInterface: ITestInterface<IBaseTest>;
export declare const DefaultTestInterface: (p: Partial<ITestInterface<any>>) => ITestInterface<any>;
export declare type ITTestResourceConfiguration = {
    name: string;
    fs: string;
    ports: number[];
    browserWSEndpoint: string;
};
export declare type ITTestResourceRequirement = {
    name: string;
    ports: number;
    fs: string;
};
export declare type ITTestResourceRequest = {
    ports: number;
};
export declare type ITLog = (...string: any[]) => void;
export declare type ILogWriter = {
    createWriteStream: (line: string) => any | any;
    writeFileSync: (fp: string, contents: string) => any;
    mkdirSync: () => any;
    testArtiFactoryfileWriter: (tLog: ITLog, n: (Promise: any) => void) => (fPath: string, value: unknown) => void;
};
export declare type ITestArtificer = (key: string, data: any) => void;
declare type ITest = {
    toObj(): object;
    name: string;
    givens: IGivens<IBaseTest>;
    checks: BaseCheck<IBaseTest>[];
    testResourceConfiguration: ITTestResourceConfiguration;
};
export declare type ITestJob<T = PM> = {
    toObj(): object;
    test: ITest;
    runner: (x: ITTestResourceConfiguration, t: ITLog) => Promise<BaseSuite<IBaseTest>>;
    testResourceRequirement: ITTestResourceRequirement;
    receiveTestResourceConfig: (pm: PM) => Promise<{
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
export declare type ITestCheckCallback<ITestShape extends IBaseTest> = {
    [K in keyof ITestShape["checks"]]: (name: string, features: string[], callbackA: (whens: {
        [K in keyof ITestShape["whens"]]: (...unknown: any[]) => BaseWhen<ITestShape>;
    }, thens: {
        [K in keyof ITestShape["thens"]]: (...unknown: any[]) => BaseThen<ITestShape>;
    }) => Promise<any>, ...xtrasA: ITestShape["checks"][K]) => BaseCheck<ITestShape>;
};
export {};
