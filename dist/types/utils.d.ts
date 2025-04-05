import { IRunTime, IBuiltConfig } from "./lib";
export declare const destinationOfRuntime: (f: string, r: IRunTime, configs: IBuiltConfig) => string;
export declare const tscPather: (entryPoint: string, platform: "web" | "node") => string;
export declare const tscExitCodePather: (entryPoint: string, platform: "web" | "node") => string;
export declare const lintPather: (entryPoint: string, platform: "web" | "node") => string;
export declare const lintExitCodePather: (entryPoint: string, platform: "web" | "node") => string;
export declare const bddPather: (entryPoint: string, platform: "web" | "node") => string;
export declare const bddExitCodePather: (entryPoint: string, platform: "web" | "node") => string;
export declare const promptPather: (entryPoint: string, platform: "web" | "node") => string;
