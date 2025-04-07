import { Page } from "puppeteer-core/lib/esm/puppeteer";
import fs from "fs";
import { IBuiltConfig, IRunnables, ITestTypes } from "../lib/index.js";
import { ISummary } from "../utils";
import { PM_Base } from "./base.js";
export declare class PM_Main extends PM_Base {
    name: string;
    ports: Record<number, boolean>;
    queue: any[];
    mode: "once" | "dev";
    bigBoard: ISummary;
    webMetafileWatcher: fs.FSWatcher;
    nodeMetafileWatcher: fs.FSWatcher;
    constructor(configs: IBuiltConfig, name: string, mode: "once" | "dev");
    start(): Promise<any>;
    stop: () => void;
    getRunnables: (tests: ITestTypes[], payload?: {
        nodeEntryPoints: {};
        webEntryPoints: {};
    }) => IRunnables;
    metafileOutputs(platform: "web" | "node"): Promise<void>;
    tscCheck: ({ entrypoint, addableFiles, platform, }: {
        platform: "web" | "node";
        entrypoint: string;
        addableFiles: string[];
    }) => Promise<void>;
    eslintCheck: (entrypoint: string, platform: "web" | "node", addableFiles: string[]) => Promise<void>;
    makePrompt: (entryPoint: string, addableFiles: string[], platform: "web" | "node") => Promise<void>;
    checkForShutdown: () => void;
    typeCheckIsRunning: (src: string) => void;
    typeCheckIsNowDone: (src: string, failures: number) => void;
    lintIsRunning: (src: string) => void;
    lintIsNowDone: (src: string, failures: number) => void;
    bddTestIsRunning: (src: string) => void;
    bddTestIsNowDone: (src: string, failures: number) => void;
    launchNode: (src: string, dest: string) => Promise<void>;
    launchWebSideCar: (src: string, dest: string, testConfig: ITestTypes) => Promise<Page>;
    launchNodeSideCar: (src: string, dest: string, testConfig: ITestTypes) => Promise<void>;
    launchWeb: (src: string, dest: string) => void;
    receiveFeatures: (features: string[], destFolder: string, srcTest: string, platform: "node" | "web") => void;
    writeBigBoard: () => void;
}
