/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { CdpPage, Page } from "puppeteer-core/lib/esm/puppeteer";
import fs from "fs";
import { Browser, LaunchOptions } from "puppeteer-core";
import { PassThrough } from "stream";
import { IBuiltConfig, ITestTypes } from "../lib/types";
import { PM } from "./index.js";
import { ITLog } from "../lib/index.js";
export declare class PM_Main extends PM {
    browser: Browser;
    shutdownMode: boolean;
    configs: IBuiltConfig;
    ports: Record<number, boolean>;
    queue: any[];
    registry: Record<string, boolean>;
    constructor(configs: IBuiltConfig);
    waitForSelector(p: string, s: string): any;
    closePage(p: any): any;
    newPage(): CdpPage;
    goto(p: any, url: string): any;
    $(selector: string): boolean;
    screencast(opts: object): void;
    customScreenShot(opts: object, cdpPage?: CdpPage): void;
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
    page(): string | undefined;
    click(selector: string): string | undefined;
    focusOn(selector: string): void;
    typeInto(value: string): void;
    getValue(value: string): void;
    getAttribute(selector: string, attribute: string): void;
    isDisabled(selector: string): boolean;
    screencastStop(s: string): void;
    startPuppeteer(options: LaunchOptions, destfolder: string): Promise<any>;
    shutDown(): void;
    checkForShutdown: () => void;
    register: (src: string) => void;
    deregister: (src: string) => void;
    launchNode: (src: string, dest: string) => Promise<void>;
    launchWebSideCar: (src: string, dest: string, testConfig: ITestTypes) => Promise<Page>;
    launchNodeSideCar: (src: string, dest: string, testConfig: ITestTypes) => Promise<void>;
    launchWeb: (t: string, dest: string, sidecars: ITestTypes[]) => void;
    receiveFeatures: (features: string[], destFolder: string) => void;
}
