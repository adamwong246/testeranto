import { PM_Pure } from "../PM/pure.js";
import { PM_Node } from "../PM/node.js";
import { PM_Web } from "../PM/web.js";
import { Ibdd_in, ITestInterface, ITestconfig, IBuiltConfig, IRunTime, ITestTypes, IT, OT } from "../Types.js";
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
    checks: BaseCheck<IT>[];
    testResourceConfiguration: ITTestResourceConfiguration;
};
export type ITestJob = {
    toObj(): object;
    test: ITest;
    runner: (x: ITTestResourceConfiguration, t: ITLog) => Promise<BaseSuite<IT, OT>>;
    testResourceRequirement: ITTestResourceRequirement;
    receiveTestResourceConfig: (pm: PM_Node | PM_Web | PM_Pure) => IFinalResults;
};
export type ITestResults = Promise<{
    test: ITest;
}>[];
export declare const defaultTestResourceRequirement: ITTestResourceRequest;
export type ITestArtifactory = (key: string, value: unknown) => unknown;
export type { ITestconfig, IBuiltConfig, IRunTime, ITestTypes };
export type IRunnables = {
    nodeEntryPoints: Record<string, string>;
    webEntryPoints: Record<string, string>;
    importEntryPoints: Record<string, string>;
};
export type IFinalResults = {
    features: string[];
    failed: boolean;
    fails: number;
    artifacts: Promise<unknown>[];
    logPromise: Promise<unknown>;
};
