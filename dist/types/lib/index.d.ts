import { PM } from "../PM/index.js";
import { Ibdd_in, Ibdd_out, ITestInterface } from "../Types.js";
import { IGivens, BaseCheck, BaseSuite } from "./abstractBase.js";
export declare const BaseTestInterface: ITestInterface<Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>>;
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
    givens: IGivens<Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>>;
    checks: BaseCheck<Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>[];
    testResourceConfiguration: ITTestResourceConfiguration;
};
export type ITestJob<T = PM> = {
    toObj(): object;
    test: ITest;
    runner: (x: ITTestResourceConfiguration, t: ITLog) => Promise<BaseSuite<Ibdd_in<unknown, unknown, unknown, unknown, unknown, unknown, unknown>, Ibdd_out<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>>>;
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
export type IRunnables = {
    nodeEntryPoints: Record<string, string>;
    webEntryPoints: Record<string, string>;
};
export type IFinalResults = {
    features: string[];
    failed: number;
};
export type IRunTime = `node` | `web`;
export type ITestTypes = [string, IRunTime, {
    ports: number;
}, ITestTypes[]];
export type IPluginFactory = (register: (entrypoint: any, sources: any) => any, entrypoints: any) => Plugin;
export type IBaseConfig = {
    src: string;
    clearScreen: boolean;
    debugger: boolean;
    devMode: boolean;
    externals: string[];
    minify: boolean;
    ports: string[];
    tests: ITestTypes[];
    nodePlugins: IPluginFactory[];
    webPlugins: IPluginFactory[];
    featureIngestor: (s: string) => Promise<string>;
};
export type IBuiltConfig = {
    buildDir: string;
} & IBaseConfig;
export {};
