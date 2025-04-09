import { Page } from "puppeteer-core/lib/esm/puppeteer";
import fs from "fs";
import { IRunnables } from "../lib/index.js";
import { ISummary } from "../utils";
import { PM_Base } from "./base.js";
import { IBuiltConfig, IRunTime, ITestTypes } from "../Types.js";
export declare class PM_Main extends PM_Base {
    name: string;
    ports: Record<number, boolean>;
    queue: any[];
    mode: "once" | "dev";
    bigBoard: ISummary;
    webMetafileWatcher: fs.FSWatcher;
    nodeMetafileWatcher: fs.FSWatcher;
    importMetafileWatcher: fs.FSWatcher;
    constructor(configs: IBuiltConfig, name: string, mode: "once" | "dev");
    mapping(): [string, (...a: any[]) => any][];
    start(): Promise<void>;
    stop(): Promise<void>;
    getRunnables: (tests: ITestTypes[], testName: string, payload?: {
        nodeEntryPoints: {};
        webEntryPoints: {};
        importEntryPoints: {};
    }) => IRunnables;
    metafileOutputs(platform: IRunTime): Promise<void>;
    tscCheck: ({ entrypoint, addableFiles, platform, }: {
        platform: IRunTime;
        entrypoint: string;
        addableFiles: string[];
    }) => Promise<void>;
    eslintCheck: (entrypoint: string, platform: IRunTime, addableFiles: string[]) => Promise<void>;
    makePrompt: (entryPoint: string, addableFiles: string[], platform: IRunTime) => Promise<void>;
    checkForShutdown: () => void;
    typeCheckIsRunning: (src: string) => void;
    typeCheckIsNowDone: (src: string, failures: number) => void;
    lintIsRunning: (src: string) => void;
    lintIsNowDone: (src: string, failures: number) => void;
    bddTestIsRunning: (src: string) => void;
    bddTestIsNowDone: (src: string, failures: number) => void;
    launchPure: (src: string, dest: string) => Promise<void>;
    launchNode: (src: string, dest: string) => Promise<void>;
    launchWebSideCar: (src: string, dest: string, testConfig: ITestTypes) => Promise<Page>;
    launchNodeSideCar: (src: string, dest: string, testConfig: ITestTypes) => Promise<void>;
    launchWeb: (src: string, dest: string) => Promise<void>;
    receiveFeatures: (features: string[], destFolder: string, srcTest: string, platform: IRunTime) => void;
    writeBigBoard: () => void;
}
