/// <reference types="node" />
/// <reference types="node" />
import { ScreencastOptions } from "puppeteer-core";
import { PassThrough } from "stream";
import { ITLog, ITTestResourceConfiguration } from "../lib";
import { PM } from "./index.js";
import { CdpPage } from "puppeteer-core/lib/esm/puppeteer";
declare type PuppetMasterServer = Record<string, Promise<any>>;
export declare class PM_Node extends PM {
    server: PuppetMasterServer;
    testResourceConfiguration: ITTestResourceConfiguration;
    constructor(t: ITTestResourceConfiguration);
    waitForSelector(p: string, s: string): any;
    closePage(p: any): string;
    goto(cdpPage: CdpPage, url: string): any;
    newPage(): CdpPage;
    $(selector: string): boolean;
    isDisabled(selector: string): boolean;
    getAttribute(selector: string, attribute: string): void;
    getValue(selector: string): void;
    focusOn(selector: string): void;
    typeInto(value: string): void;
    page(): any;
    click(selector: string): string | undefined;
    screencast(opts: ScreencastOptions, page: CdpPage): any;
    screencastStop(p: string): any;
    customScreenShot(opts: ScreencastOptions, cdpPage: CdpPage): any;
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
    startPuppeteer(options?: any): any;
}
export {};
