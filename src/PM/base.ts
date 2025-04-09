import fs from "fs";
import path from "path";
import {
  Browser,
  Page,
  ScreenRecorder,
  ScreenshotOptions,
} from "puppeteer-core";
import { PassThrough } from "stream";

import { ITLog } from "../lib/index.js";
import { IBuiltConfig } from "../Types.js";

const fileStreams3: fs.WriteStream[] = [];
type IFPaths = string[];
const fPaths: IFPaths = [];
const files: Record<string, Set<string>> = {};
const recorders: Record<string, ScreenRecorder> = {};
const screenshots: Record<string, Promise<Uint8Array>[]> = {};

export abstract class PM_Base {
  browser: Browser;
  configs: IBuiltConfig;

  constructor(configs: IBuiltConfig) {
    this.configs = configs;
  }

  customclose() {
    throw new Error("Method not implemented.");
  }

  waitForSelector(p: string, s: string): any {
    return new Promise((res) => {
      this.doInPage(p, async (page) => {
        const x = page.$(s);
        const y = await x;

        res(y !== null);
        // return page.focus(selector);
      });
    });
  }

  closePage(p): any {
    // throw new Error("Method not implemented.");
    return new Promise((res) => {
      this.doInPage(p, async (page) => {
        page.close();

        res({});
        // return page.focus(selector);
      });
    });
  }

  newPage(): Promise<Page> {
    return this.browser.newPage();
  }

  goto(p, url: string): any {
    return new Promise((res) => {
      this.doInPage(p, async (page) => {
        await page?.goto(url);

        res({});
        // return page.focus(selector);
      });
    });
  }

  $(selector: string, p: string): Promise<boolean> {
    return new Promise((res) => {
      this.doInPage(p, async (page) => {
        const x = page.$(selector);
        const y = await x;
        res(y !== null);
      });
    });
  }

  async pages(): Promise<string[]> {
    return (await this.browser.pages()).map((p) => {
      return (p.mainFrame() as any)._id;
    });
  }

  async screencast(ssOpts: ScreenshotOptions, testName: string, page: Page) {
    const p = ssOpts.path as string;
    const dir = path.dirname(p);
    fs.mkdirSync(dir, {
      recursive: true,
    });
    if (!files[testName]) {
      files[testName] = new Set();
    }
    files[testName].add(ssOpts.path as string);

    const sPromise = page.screenshot({
      ...ssOpts,
      path: p,
    });

    if (!screenshots[testName]) {
      screenshots[testName] = [];
    }
    screenshots[testName].push(sPromise);
    await sPromise;
    return sPromise;
  }

  async customScreenShot(
    ssOpts: ScreenshotOptions,
    testName: string,
    page: Page
  ) {
    const p = ssOpts.path as string;
    const dir = path.dirname(p);
    fs.mkdirSync(dir, {
      recursive: true,
    });
    if (!files[testName]) {
      files[testName] = new Set();
    }
    files[testName].add(ssOpts.path as string);

    const sPromise = page.screenshot({
      ...ssOpts,
      path: p,
    });

    if (!screenshots[testName]) {
      screenshots[testName] = [];
    }
    screenshots[testName].push(sPromise);
    await sPromise;
    return sPromise;
  }

  async end(uid: number): Promise<boolean> {
    await fileStreams3[uid].end();
    return true;
  }

  existsSync(destFolder: string): boolean {
    return fs.existsSync(destFolder);
  }

  async mkdirSync(fp: string) {
    if (!fs.existsSync(fp)) {
      return fs.mkdirSync(fp, {
        recursive: true,
      });
    }
    return false;
  }

  async writeFileSync(
    filepath: string,
    contents: string,
    testName: string
  ): Promise<boolean> {
    return new Promise<boolean>(async (res) => {
      fs.mkdirSync(path.dirname(filepath), {
        recursive: true,
      });
      if (!files[testName]) {
        files[testName] = new Set();
      }
      files[testName].add(filepath);

      await fs.writeFileSync(filepath, contents);
      res(true);
    });
  }

  async createWriteStream(filepath: string, testName: string): Promise<number> {
    return new Promise<number>((res) => {
      const f = fs.createWriteStream(filepath);
      fileStreams3.push(f);
      if (!files[testName]) {
        files[testName] = new Set();
      }
      files[testName].add(filepath);

      res(fileStreams3.length - 1);
    });
  }

  testArtiFactoryfileWriter(tLog: ITLog, callback: (Promise) => void) {
    return (fPath, value: string | Buffer | PassThrough) => {
      callback(
        new Promise<void>((res, rej) => {
          tLog("testArtiFactory =>", fPath);

          const cleanPath = path.resolve(fPath);
          fPaths.push(cleanPath.replace(process.cwd(), ``));

          const targetDir = cleanPath.split("/").slice(0, -1).join("/");

          fs.mkdir(targetDir, { recursive: true }, async (error) => {
            if (error) {
              console.error(`❗️testArtiFactory failed`, targetDir, error);
            }

            fs.writeFileSync(
              path.resolve(
                targetDir.split("/").slice(0, -1).join("/"),
                "manifest"
              ),
              fPaths.join(`\n`),
              {
                encoding: "utf-8",
              }
            );

            if (Buffer.isBuffer(value)) {
              fs.writeFileSync(fPath, value, "binary");
              res();
            } else if (`string` === typeof value) {
              fs.writeFileSync(fPath, value.toString(), {
                encoding: "utf-8",
              });
              res();
            } else {
              /* @ts-ignore:next-line */
              const pipeStream: PassThrough = value;
              const myFile = fs.createWriteStream(fPath);
              pipeStream.pipe(myFile);
              pipeStream.on("close", () => {
                myFile.close();
                res();
              });
            }
          });
        })
      );
    };
  }

  async write(uid: number, contents: string): Promise<boolean> {
    return new Promise<boolean>((res) => {
      const x = fileStreams3[uid].write(contents);
      res(x);
    });
  }

  page(): string | undefined {
    throw new Error("Method not implemented.");
  }

  click(selector: string, page: Page) {
    return page.click(selector);
  }

  async focusOn(selector: string, p: string) {
    this.doInPage(p, (page) => {
      return page.focus(selector);
    });
  }

  async typeInto(value: string, p: string) {
    this.doInPage(p, (page) => {
      return page.keyboard.type(value);
    });
  }

  getValue(value: string, p: string) {
    this.doInPage(p, (page) => {
      return page.keyboard.type(value);
    });
  }

  getAttribute(selector: string, attribute: string, p: string) {
    this.doInPage(p, (page) => {
      return page.$eval(selector, (input) => input.getAttribute("value"));
    });
  }

  isDisabled(selector: string, p: string) {
    this.doInPage(p, async (page) => {
      return await page.$eval(selector, (input: HTMLButtonElement) => {
        return input.disabled;
      });
    });
  }

  screencastStop(s: string) {
    return recorders[s].stop();
  }

  async doInPage(p: string, cb: (p: Page) => unknown) {
    (await this.browser.pages()).forEach((page: Page) => {
      if ((page.mainFrame() as any)._id === p) {
        return cb(page);
      }
    });
  }
}
