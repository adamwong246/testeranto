import {
  Browser,
  Page,
} from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser";
import { ITLog, ITTestResourceConfiguration } from "../lib";
// import { Page } from "puppeteer-core";

type IFPaths = string[];
const fPaths: IFPaths = [];

export abstract class PM {
  server: any;
  browser: Browser;
  testResourceConfiguration: ITTestResourceConfiguration;

  abstract startPuppeteer(options: any, destfolder: string): Promise<Browser>;
  abstract testArtiFactoryfileWriter(tLog: ITLog, callback: (Promise) => void);
  abstract createWriteStream(filepath: string): any;
  abstract writeFileSync(fp: string, contents: string);
  abstract mkdirSync();
  abstract existsSync(fp: string): boolean;
  abstract write(accessObject: { uid: number }, contents: string): boolean;
  abstract end(accessObject: { uid: number }): boolean;
  abstract customScreenShot(opts: object, page: Page): any;
}
