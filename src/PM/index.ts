import { Page } from "puppeteer-core";
import {
  CdpPage,
  ScreenRecorderOptions,
} from "puppeteer-core/lib/esm/puppeteer";
import { ITLog, ITTestResourceConfiguration } from "../lib";

type IFPaths = string[];
const fPaths: IFPaths = [];

export abstract class PM {
  server: any;
  testResourceConfiguration: ITTestResourceConfiguration;

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
  abstract testArtiFactoryfileWriter(tLog: ITLog, callback: (Promise) => void);

  abstract $(selector: string): any;
  abstract click(selector: string): any;
  abstract closePage(p): any;
  abstract createWriteStream(
    filepath: string,
    testName: string
  ): Promise<string>;
  abstract customclose();
  abstract customScreenShot(opts: object, page?: string): any;
  abstract end(uid: number): Promise<boolean>;
  abstract existsSync(fp: string): Promise<boolean>;
  abstract focusOn(selector: string): any;
  abstract getAttribute(selector: string, attribute: string): any;
  abstract getValue(value: string): any;
  abstract goto(p, url: string): any;
  abstract isDisabled(selector: string): Promise<boolean>;
  abstract mkdirSync(a: string);
  abstract newPage(): CdpPage;
  abstract page(): string | undefined;
  abstract pages(): string[];
  abstract screencast(o: ScreenRecorderOptions, p: Page | string): any;
  abstract screencastStop(s: string): any;
  abstract typeInto(selector: string, value: string): any;
  abstract waitForSelector(p, sel: string);
  abstract write(uid: number, contents: string): Promise<boolean>;
  abstract writeFileSync(f: string, c: string, t: string): Promise<boolean>;
}
