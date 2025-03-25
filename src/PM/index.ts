import { CdpPage } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser";
import { ScreenRecorderOptions } from "puppeteer-core/lib/esm/puppeteer";
import { ITLog, ITTestResourceConfiguration } from "../lib";

type IFPaths = string[];
const fPaths: IFPaths = [];

export abstract class PM {
  server: any;
  testResourceConfiguration: ITTestResourceConfiguration;

  abstract testArtiFactoryfileWriter(tLog: ITLog, callback: (Promise) => void);
  abstract createWriteStream(filepath: string): any;
  abstract writeFileSync(fp: string, contents: string);
  abstract mkdirSync(a: string);
  abstract existsSync(fp: string): boolean;
  abstract write(accessObject: { uid: number }, contents: string): boolean;
  abstract end(accessObject: { uid: number }): boolean;
  abstract customScreenShot(opts: object, page?: CdpPage): any;
  abstract screencast(opts: ScreenRecorderOptions, p?): any;
  abstract screencastStop(s: string): any;

  abstract page(): string | undefined;
  abstract click(selector: string): any;
  abstract focusOn(selector: string): any;
  abstract typeInto(value: string): any;
  abstract getValue(value: string): any;
  abstract getAttribute(selector: string, attribute: string): any;
  abstract isDisabled(selector: string): boolean;
  abstract $(selector: string): any;

  abstract newPage(): CdpPage;
  abstract goto(p, url: string): any;
  abstract closePage(p): any;

  abstract waitForSelector(p, sel: string);
  abstract customclose();
}
