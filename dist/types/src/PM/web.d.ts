/// <reference types="node" />
/// <reference types="node" />
import { PassThrough } from "stream";
import { ITLog, ITTestResourceConfiguration } from "../lib";
import { PM } from "./index.js";
import { ScreenshotOptions } from "puppeteer-core";
declare type PuppetMasterServer = Record<string, Promise<any>>;
export declare class PM_Web extends PM {
    server: PuppetMasterServer;
    constructor(t: ITTestResourceConfiguration);
    $(selector: string): boolean;
    screencast(opts: object): void;
    isDisabled(selector: string): boolean;
    getAttribute(selector: string, attribute: string): any;
    getValue(selector: string): any;
    focusOn(selector: string): any;
    typeInto(value: string): any;
    page(): string | undefined;
    click(selector: string): any;
    customScreenShot(opts: ScreenshotOptions): any;
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
}
export {};
