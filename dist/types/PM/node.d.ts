/// <reference types="node" />
/// <reference types="node" />
import { PassThrough } from "stream";
import { ITLog, ITTestResourceConfiguration } from "../lib";
import { PM } from "./index.js";
import { Page } from "puppeteer-core/lib/esm/puppeteer";
declare type PuppetMasterServer = Record<string, Promise<any>>;
export declare class PM_Node extends PM {
    server: PuppetMasterServer;
    testResourceConfiguration: ITTestResourceConfiguration;
    constructor(t: ITTestResourceConfiguration);
    customScreenShot(opts: object, page: Page): any;
    existsSync(destFolder: string): boolean;
    mkdirSync(): any;
    write(writeObject: {
        uid: number;
    }, contents: string): any;
    writeFileSync(filepath: string, contents: string): any;
    createWriteStream(filepath: string): any;
    end(writeObject: {
        uid: number;
    }): any;
    customclose(): void;
    testArtiFactoryfileWriter(tLog: ITLog, callback: (Promise: any) => void): (fPath: any, value: string | Buffer | PassThrough) => void;
    startPuppeteer(options?: any): Promise<any>;
}
export {};
