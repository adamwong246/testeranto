import { IRunTime, IBuiltConfig } from "./lib";
export type ISummary = Record<string, {
    runTimeError?: number | "?";
    typeErrors?: number | "?";
    staticErrors?: number | "?";
    prompt?: string | "?";
}>;
export declare const destinationOfRuntime: (f: string, r: IRunTime, configs: IBuiltConfig) => string;
export declare const tscPather: (entryPoint: string, platform: "web" | "node") => string;
export declare const tscExitCodePather: (entryPoint: string, platform: "web" | "node") => string;
export declare const lintPather: (entryPoint: string, platform: "web" | "node") => string;
export declare const lintExitCodePather: (entryPoint: string, platform: "web" | "node") => string;
export declare const bddPather: (entryPoint: string, platform: "web" | "node") => string;
export declare const bddExitCodePather: (entryPoint: string, platform: "web" | "node") => string;
export declare const promptPather: (entryPoint: string, platform: "web" | "node") => string;
