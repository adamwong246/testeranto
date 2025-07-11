import { ChildProcess } from "node:child_process";
import { Page } from "puppeteer-core/lib/esm/puppeteer";
import fs from "fs";
import { IRunnables, ITTestResourceConfiguration } from "../lib/index.js";
import { IBuiltConfig, IRunTime, ITestTypes } from "../Types.js";
import { Sidecar } from "../lib/Sidecar.js";
import { PM_WithEslintAndTsc } from "./PM_WithEslintAndTsc.js";
export declare class PM_Main extends PM_WithEslintAndTsc {
    ports: Record<number, boolean>;
    queue: any[];
    webMetafileWatcher: fs.FSWatcher;
    nodeMetafileWatcher: fs.FSWatcher;
    importMetafileWatcher: fs.FSWatcher;
    pureSidecars: Record<number, Sidecar>;
    nodeSidecars: Record<number, ChildProcess>;
    webSidecars: Record<number, Page>;
    constructor(configs: IBuiltConfig, name: string, mode: "once" | "dev");
    stopSideCar(uid: number): Promise<any>;
    launchSideCar(n: number, name: string): Promise<[number, ITTestResourceConfiguration]>;
    mapping(): [string, (...a: any[]) => any][];
    start(): Promise<void>;
    launchExternalTest(externalTestName: string, externalTest: {
        watch: string[];
        exec: string;
    }): Promise<void>;
    stop(): Promise<void>;
    getRunnables: (tests: ITestTypes[], testName: string, payload?: {
        nodeEntryPoints: {};
        nodeEntryPointSidecars: {};
        webEntryPoints: {};
        webEntryPointSidecars: {};
        pureEntryPoints: {};
        pureEntryPointSidecars: {};
    }) => IRunnables;
    metafileOutputs(platform: IRunTime): Promise<void>;
    launchPure: (src: string, dest: string) => Promise<void>;
    launchNode: (src: string, dest: string) => Promise<void>;
    launchWebSideCar: (testConfig: ITestTypes) => Promise<[number, ITTestResourceConfiguration]>;
    launchNodeSideCar: (sidecar: ITestTypes) => Promise<[number, ITTestResourceConfiguration]>;
    stopPureSideCar: (uid: number) => Promise<void>;
    launchPureSideCar: (sidecar: ITestTypes) => Promise<[number, ITTestResourceConfiguration]>;
    launchWeb: (src: string, dest: string) => Promise<void>;
    receiveFeaturesV2: (reportDest: string, srcTest: string, platform: IRunTime) => void;
}
