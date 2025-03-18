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
    abstract customScreenShot(opts: object): any;
    abstract screencast(opts: object): any;
    abstract page(): string | undefined;
    abstract click(selector: string): any;
    abstract focusOn(selector: string): any;
    abstract typeInto(value: string): any;
    abstract getValue(value: string): any;
    abstract getAttribute(selector: string, attribute: string): any;
    abstract isDisabled(selector: string): boolean;
    abstract $(selector: string): any;
}
