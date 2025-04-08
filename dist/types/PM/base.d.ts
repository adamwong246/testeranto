import { CdpPage } from "puppeteer-core/lib/esm/puppeteer";
import { Browser } from "puppeteer-core";
import { PassThrough } from "stream";
import { IBuiltConfig, ITLog } from "../lib/index.js";
import { PM } from "./index.js";
export declare abstract class PM_Base extends PM {
    browser: Browser;
    configs: IBuiltConfig;
    constructor(configs: IBuiltConfig);
    customclose(): void;
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
    writeFileSync(filepath: string, contents: string, testName: string): Promise<unknown>;
    createWriteStream(filepath: string, testName: string): Promise<string>;
    testArtiFactoryfileWriter(tLog: ITLog, callback: (Promise: any) => void): (fPath: any, value: string | Buffer | PassThrough) => void;
    write(uid: number, contents: string): Promise<unknown>;
    page(): string | undefined;
    click(selector: string): string | undefined;
    focusOn(selector: string): void;
    typeInto(value: string): void;
    getValue(value: string): void;
    getAttribute(selector: string, attribute: string): void;
    isDisabled(selector: string): Promise<boolean>;
    screencastStop(s: string): void;
}
