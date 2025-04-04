import { PM } from "../PM/index.js";
import { IBaseTest } from "../Types.js";
import { IGivens, BaseCheck, BaseSuite, BaseWhen, BaseThen } from "./abstractBase.js";
import { ITestInterface } from "./types.js";
export declare const BaseTestInterface: ITestInterface<IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>;
export declare const DefaultTestInterface: (p: Partial<ITestInterface<any>>) => ITestInterface<any>;
export type ITTestResourceConfiguration = {
    name: string;
    fs: string;
    ports: number[];
    browserWSEndpoint: string;
};
export type ITTestResourceRequirement = {
    name: string;
    ports: number;
    fs: string;
};
export type ITTestResourceRequest = {
    ports: number;
};
export type ITLog = (...string: any[]) => void;
export type ILogWriter = {
    createWriteStream: (line: string) => any | any;
    writeFileSync: (fp: string, contents: string) => any;
    mkdirSync: () => any;
    testArtiFactoryfileWriter: (tLog: ITLog, n: (Promise: any) => void) => (fPath: string, value: unknown) => void;
};
export type ITestArtificer = (key: string, data: any) => void;
type ITest = {
    toObj(): object;
    name: string;
    givens: IGivens<IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>;
    checks: BaseCheck<IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>[];
    testResourceConfiguration: ITTestResourceConfiguration;
};
export type ITestJob<T = PM> = {
    toObj(): object;
    test: ITest;
    runner: (x: ITTestResourceConfiguration, t: ITLog) => Promise<BaseSuite<IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>>;
    testResourceRequirement: ITTestResourceRequirement;
    receiveTestResourceConfig: (pm: PM) => Promise<{
        failed: number;
        artifacts: Promise<unknown>[];
        logPromise: Promise<unknown>;
        features: string[];
    }>;
};
export type ITestResults = Promise<{
    test: ITest;
}>[];
export declare const defaultTestResourceRequirement: ITTestResourceRequest;
export type ITestArtifactory = (key: string, value: unknown) => unknown;
export type ITestCheckCallback<ITestShape extends IBaseTest<unknown, unknown, unknown, unknown, unknown, unknown, unknown, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>> = {
    [K in keyof ITestShape["checks"]]: (name: string, features: string[], callbackA: (whens: {
        [K in keyof ITestShape["whens"]]: (...unknown: any[]) => BaseWhen<ITestShape>;
    }, thens: {
        [K in keyof ITestShape["thens"]]: (...unknown: any[]) => BaseThen<ITestShape>;
    }) => Promise<any>, ...xtrasA: ITestShape["checks"][K]) => BaseCheck<ITestShape>;
};
export {};
