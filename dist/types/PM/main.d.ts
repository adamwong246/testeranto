/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import fs from "fs";
import { PassThrough } from "stream";
import { IBuiltConfig, ITestTypes } from "../lib/types";
import { PM } from "./index.js";
import { ITLog } from "../lib/index.js";
export declare class PM_Main extends PM {
    customScreenShot(opts: object): void;
    configs: IBuiltConfig;
    ports: Record<number, boolean>;
    queue: any[];
    constructor(configs: IBuiltConfig);
    startPuppeteer(options: any, destfolder: string): Promise<any>;
    launchNode: (src: string, dest: string) => Promise<void>;
    launchWebSideCar: (src: string, dest: string, testConfig: ITestTypes) => Promise<void>;
    launchNodeSideCar: (src: string, dest: string, testConfig: ITestTypes) => Promise<void>;
    launchWeb: (t: string, dest: string, sidecars: ITestTypes[]) => void;
    end(accessObject: {
        uid: number;
    }): boolean;
    existsSync(destFolder: string): boolean;
    mkdirSync(fp: string): Promise<string | false | undefined>;
    writeFileSync(fp: string, contents: string): void;
    createWriteStream(filepath: string): fs.WriteStream;
    testArtiFactoryfileWriter(tLog: ITLog, callback: (Promise: any) => void): (fPath: any, value: string | Buffer | PassThrough) => void;
    write(accessObject: {
        uid: number;
    }, contents: string): boolean;
}
