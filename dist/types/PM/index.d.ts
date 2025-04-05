import { CdpPage } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser";
import { ScreenRecorderOptions } from "puppeteer-core/lib/esm/puppeteer";
import { ITLog, ITTestResourceConfiguration } from "../lib";
export declare abstract class PM {
    server: any;
    testResourceConfiguration: ITTestResourceConfiguration;
    abstract testArtiFactoryfileWriter(tLog: ITLog, callback: (Promise: any) => void): any;
    abstract createWriteStream(filepath: string): any;
    abstract writeFileSync(fp: string, contents: string): any;
    abstract mkdirSync(a: string): any;
    abstract existsSync(fp: string): boolean;
    abstract write(accessObject: {
        uid: number;
    }, contents: string): boolean;
    abstract end(accessObject: {
        uid: number;
    }): boolean;
    abstract customScreenShot(opts: object, page?: string): any;
    abstract screencast(opts: ScreenRecorderOptions, p?: any): any;
    abstract screencastStop(s: string): any;
    abstract page(): string | undefined;
    abstract click(selector: string): any;
    abstract focusOn(selector: string): any;
    abstract typeInto(value: string): any;
    abstract getValue(value: string): any;
    abstract getAttribute(selector: string, attribute: string): any;
    abstract isDisabled(selector: string): Promise<boolean>;
    abstract $(selector: string): any;
    abstract newPage(): CdpPage;
    abstract goto(p: any, url: string): any;
    abstract closePage(p: any): any;
    abstract waitForSelector(p: any, sel: string): any;
    abstract customclose(): any;
}
