import { PassThrough } from "stream";
import { ScreencastOptions, ScreenshotOptions } from "puppeteer-core";
declare module "puppeteer-core" {
    interface Frame {
        _id: string;
    }
}
import { Page } from "puppeteer-core";
import { ITLog, ITTestResourceConfiguration } from "../lib";
import { PM } from ".";
export declare class PM_Web extends PM {
    testResourceConfiguration: ITTestResourceConfiguration;
    constructor(t: ITTestResourceConfiguration);
    start(): Promise<void>;
    stop(): Promise<void>;
    getInnerHtml(selector: string, page: string): void;
    pages(): Promise<string[]>;
    stopSideCar(n: number): Promise<any>;
    launchSideCar(n: number): Promise<[number, ITTestResourceConfiguration]>;
    waitForSelector(p: string, s: string): any;
    screencast(opts: ScreencastOptions, page: string | Page): Promise<string>;
    screencastStop(recorder: string): any;
    closePage(p: any): string;
    goto(p: any, url: string): any;
    newPage(): any;
    $(selector: string): boolean;
    isDisabled(selector: string): Promise<boolean>;
    getAttribute(selector: string, attribute: string): any;
    getValue(selector: number): any;
    focusOn(selector: string): any;
    typeInto(value: string): any;
    page(x?: any): Promise<string | undefined>;
    click(selector: string): any;
    customScreenShot(x: ScreenshotOptions, y: any): any;
    existsSync(destFolder: string): Promise<boolean>;
    mkdirSync(x: any): any;
    write(uid: number, contents: string): Promise<boolean>;
    writeFileSync(x: any): any;
    createWriteStream(filepath: string): any;
    end(uid: number): Promise<boolean>;
    customclose(): void;
    testArtiFactoryfileWriter(tLog: ITLog, callback: (Promise: any) => void): (fPath: any, value: string | Buffer | PassThrough) => void;
}
