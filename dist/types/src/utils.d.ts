import { IBuiltConfig, IRunTime, ITestTypes } from "./Types";
import { IRunnables } from "./lib";
export type ISummary = Record<string, {
    runTimeError?: number | "?";
    typeErrors?: number | "?";
    staticErrors?: number | "?";
    prompt?: string | "?";
}>;
export declare const destinationOfRuntime: (f: string, r: IRunTime, configs: IBuiltConfig) => string;
export declare const tscPather: (entryPoint: string, platform: IRunTime, projectName: string) => string;
export declare const lintPather: (entryPoint: string, platform: IRunTime, projectName: string) => string;
export declare const bddPather: (entryPoint: string, platform: IRunTime, projectName: string) => string;
export declare const promptPather: (entryPoint: string, platform: IRunTime, projectName: string) => string;
export declare const getRunnables: (tests: ITestTypes[], projectName: string, payload?: {
    nodeEntryPoints: {};
    webEntryPoints: {};
    importEntryPoints: {};
}) => IRunnables;
