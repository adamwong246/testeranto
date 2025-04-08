import { PassThrough } from "stream";
import { ITLog, ITTestResourceConfiguration } from "../lib";
import { PM } from "./index.js";
import { ScreencastOptions, ScreenshotOptions } from "puppeteer-core";
import { CdpPage } from "puppeteer-core/lib/esm/puppeteer";
type PuppetMasterServer = Record<string, Promise<any>>;
export declare class PM_Web extends PM {
    server: PuppetMasterServer;
    constructor(t: ITTestResourceConfiguration);
    start(): Promise<void>;
    stop(): Promise<void>;
    waitForSelector(p: string, s: string): any;
    screencast(opts: ScreencastOptions): any;
    screencastStop(recorder: string): any;
    closePage(p: any): string;
    goto(p: any, url: string): any;
    newPage(): CdpPage;
    $(selector: string): boolean;
    isDisabled(selector: string): Promise<boolean>;
    getAttribute(selector: string, attribute: string): any;
    getValue(selector: string): any;
    focusOn(selector: string): any;
    typeInto(value: string): any;
    page(): string | undefined;
    click(selector: string): any;
    customScreenShot(opts: ScreenshotOptions): any;
    existsSync(destFolder: string): boolean;
    mkdirSync(x: any): any;
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
