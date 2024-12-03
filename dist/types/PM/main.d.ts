/// <reference types="node" />
import fs from "fs";
import { PassThrough } from "stream";
import { ITLog } from "../lib";
import { IBuiltConfig } from "../lib/types";
import { PM } from "./index.js";
export declare class PM_Main extends PM {
    configs: IBuiltConfig;
    ports: Record<number, boolean>;
    queue: any[];
    constructor(configs: IBuiltConfig);
    startPuppeteer(options: any, destfolder: string): Promise<any>;
    launchNode: (src: string, dest: string) => Promise<void>;
    launchWeb: (t: string, dest: string) => void;
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
