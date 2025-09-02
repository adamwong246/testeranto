import fs from "fs";
import { IBuiltConfig, IRunTime } from "../Types.js";
import { createLogStreams } from "./utils.js";
import { PM_WithGit } from "./PM_WithGit.js";
export declare abstract class PM_WithProcesses extends PM_WithGit {
    webMetafileWatcher: fs.FSWatcher;
    nodeMetafileWatcher: fs.FSWatcher;
    importMetafileWatcher: fs.FSWatcher;
    pitonoMetafileWatcher: fs.FSWatcher;
    ports: Record<number, string>;
    queue: string[];
    logStreams: Record<string, ReturnType<typeof createLogStreams>>;
    launchers: Record<string, () => void>;
    abstract launchNode(src: string, dest: string): any;
    abstract launchWeb(src: string, dest: string): any;
    abstract launchPure(src: string, dest: string): any;
    abstract launchPython(src: string, dest: string): any;
    abstract launchGolang(src: string, dest: string): any;
    constructor(configs: IBuiltConfig, name: string, mode: "once" | "dev");
    metafileOutputs(platform: IRunTime): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    receiveFeaturesV2: (reportDest: string, srcTest: string, platform: IRunTime) => void;
    findIndexHtml(): string | null;
    addToQueue(src: string, runtime: IRunTime): void;
    checkQueue(): void;
    onBuildDone(): void;
    checkForShutdown: () => void;
}
