/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

  abstract launchSideCar(n: number, testName: string, projectName: string);

  customclose() {
    throw new Error("customclose not implemented.");
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

  async newPage(): Promise<string> {
    return (await this.browser.newPage()).mainFrame()._id;
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

  $(selector: string, p: string): Promise<any> {
    return new Promise((res) => {
      this.doInPage(p, async (page) => {
        const x = await page.$(selector);
        const y = await x?.jsonValue();
        res(y);
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
    pageUid: any
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

    const page = (await this.browser.pages()).find(
      (p) => p.mainFrame()._id === pageUid
    ) as Page;
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
    const folder = filepath.split("/").slice(0, -1).join("/");

    return new Promise<number>((res) => {
      if (!fs.existsSync(folder)) {
        return fs.mkdirSync(folder, {
          recursive: true,
        });
      }

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

  page(p): string | undefined {
    return p;
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

  // setValue(value: string, p: string) {
  //   this.doInPage(p, (page) => {
  //     return page.keyboard.type(value);
  //   });
  // }

  getAttribute(selector: string, attribute: string, p: string) {
    this.doInPage(p, (page) => {
      return page.$eval(selector, (input) => input.getAttribute(attribute));
    });
  }

  async getInnerHtml(selector: string, p: string) {
    return new Promise((res, rej) => {
      this.doInPage(p, async (page) => {
        const e = await page.$(selector);
        if (!e) {
          rej();
        } else {
          const text = await (await e.getProperty("textContent")).jsonValue();
          res(text);
        }
      });
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
      const frame = page.mainFrame() as { _id?: string };
      if (frame._id === p) {
        return cb(page);
      }
    });
  }
}
