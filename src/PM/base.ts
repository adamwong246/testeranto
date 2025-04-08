import { CdpPage } from "puppeteer-core/lib/esm/puppeteer";
import fs from "fs";
import path from "path";
import { Browser, ScreenRecorder, ScreenshotOptions } from "puppeteer-core";
import { PassThrough } from "stream";

import { IBuiltConfig, ITLog } from "../lib/index.js";

import { PM } from "./index.js";

const fileStreams3: fs.WriteStream[] = [];
type IFPaths = string[];
const fPaths: IFPaths = [];
const files: Record<string, Set<string>> = {};
const recorders: Record<string, ScreenRecorder> = {};
const screenshots: Record<string, Promise<Uint8Array>[]> = {};

export abstract class PM_Base extends PM {
  browser: Browser;
  configs: IBuiltConfig;

  constructor(configs: IBuiltConfig) {
    super();
    this.server = {};
    this.configs = configs;

    globalThis["waitForSelector"] = async (pageKey: string, sel: string) => {
      const page = (await this.browser.pages()).find(
        /* @ts-ignore:next-line */
        (p) => p.mainFrame()._id === pageKey
      );
      await page?.waitForSelector(sel);
    };

    globalThis["screencastStop"] = async (path: string) => {
      return recorders[path].stop();
    };

    globalThis["closePage"] = async (pageKey) => {
      const page = (await this.browser.pages()).find(
        /* @ts-ignore:next-line */
        (p) => p.mainFrame()._id === pageKey
      );
      /* @ts-ignore:next-line */
      return page.close();
    };

    globalThis["goto"] = async (pageKey: string, url: string) => {
      const page = (await this.browser.pages()).find(
        /* @ts-ignore:next-line */
        (p) => p.mainFrame()._id === pageKey
      );
      await page?.goto(url);
      return;
    };

    globalThis["newPage"] = () => {
      return this.browser.newPage();
    };

    globalThis["pages"] = () => {
      return this.browser.pages();
    };

    globalThis["mkdirSync"] = (fp: string) => {
      if (!fs.existsSync(fp)) {
        return fs.mkdirSync(fp, {
          recursive: true,
        });
      }
      return false;
    };

    globalThis["writeFileSync"] = (
      filepath: string,
      contents: string,
      testName: string
    ) => {
      this.writeFileSync(filepath, contents, testName);
    };

    globalThis["createWriteStream"] = (filepath: string, testName: string) => {
      return this.createWriteStream(filepath, testName);
      // const f = fs.createWriteStream(filepath);
      // fileStreams3.push(f);
      // // files.add(filepath);
      // if (!files[testName]) {
      //   files[testName] = new Set();
      // }
      // files[testName].add(filepath);
      // return {
      //   ...JSON.parse(JSON.stringify(f)),
      //   uid: fileStreams3.length - 1,
      // };
    };

    globalThis["write"] = (uid: number, contents: string) => {
      // fileStreams3[uid].write(contents);
      return this.write(uid, contents);
    };

    globalThis["end"] = (uid: number) => {
      fileStreams3[uid].end();
    };

    globalThis["customScreenShot"] = async (
      opts: { path: string },
      pageKey: string,
      testName: string
    ) => {
      const page = (await this.browser.pages()).find(
        /* @ts-ignore:next-line */
        (p) => p.mainFrame()._id === pageKey
      );

      const p = opts.path as string;
      const dir = path.dirname(p);
      fs.mkdirSync(dir, {
        recursive: true,
      });
      if (!files[opts.path]) {
        files[opts.path] = new Set();
      }
      files[opts.path].add(opts.path as string);

      /* @ts-ignore:next-line */
      const sPromise = page.screenshot({
        ...opts,
        path: p,
      });

      if (!screenshots[opts.path]) {
        screenshots[opts.path] = [];
      }
      screenshots[opts.path].push(sPromise);

      await sPromise;
      return sPromise;
    };

    globalThis["screencast"] = async (
      opts: ScreenshotOptions,
      pageKey: string
    ) => {
      const page = (await this.browser.pages()).find(
        /* @ts-ignore:next-line */
        (p) => p.mainFrame()._id === pageKey
      );

      const p = opts.path as string;
      const dir = path.dirname(p);
      fs.mkdirSync(dir, {
        recursive: true,
      });

      const recorder = await page?.screencast({
        ...opts,
        /* @ts-ignore:next-line */
        path: p,
      });

      /* @ts-ignore:next-line */
      recorders[opts.path] = recorder;

      return opts.path;
    };
  }

  customclose() {
    throw new Error("Method not implemented.");
  }
  waitForSelector(p: string, s: string): any {
    throw new Error("Method not implemented.");
  }
  closePage(p): any {
    throw new Error("Method not implemented.");
  }
  newPage(): CdpPage {
    throw new Error("Method not implemented.");
  }
  goto(p, url: string): any {
    throw new Error("Method not implemented.");
  }
  $(selector: string): boolean {
    throw new Error("Method not implemented.");
  }
  screencast(opts: object) {
    throw new Error("Method not implemented.");
  }
  /* @ts-ignore:next-line */
  customScreenShot(opts: object, cdpPage?: CdpPage) {
    throw new Error("Method not implemented.");
  }
  end(accessObject: { uid: number }): boolean {
    throw new Error("Method not implemented.");
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

  writeFileSync(filepath: string, contents: string, testName: string) {
    return new Promise((res) => {
      fs.mkdirSync(path.dirname(filepath), {
        recursive: true,
      });
      if (!files[testName]) {
        files[testName] = new Set();
      }
      files[testName].add(filepath);
      // return ;

      res(fs.writeFileSync(filepath, contents));
    });
  }

  createWriteStream(filepath: string, testName: string): Promise<string> {
    return new Promise((res) => {
      const f = fs.createWriteStream(filepath);
      fileStreams3.push(f);
      // files.add(filepath);
      if (!files[testName]) {
        files[testName] = new Set();
      }
      files[testName].add(filepath);

      res((fileStreams3.length - 1).toString());
    });
    // return {
    //   ...JSON.parse(JSON.stringify(f)),
    //   uid: fileStreams3.length - 1,
    // };
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

  write(uid: number, contents: string) {
    return new Promise((res) => {
      const x = fileStreams3[uid].write(contents);
      res(x);
    });

    // return x
  }
  page(): string | undefined {
    throw new Error("Method not implemented.");
  }
  click(selector: string): string | undefined {
    throw new Error("Method not implemented.");
  }
  focusOn(selector: string) {
    throw new Error("Method not implemented.");
  }
  typeInto(value: string) {
    throw new Error("Method not implemented.");
  }
  getValue(value: string) {
    throw new Error("Method not implemented.");
  }
  getAttribute(selector: string, attribute: string) {
    throw new Error("Method not implemented.");
  }
  isDisabled(selector: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  screencastStop(s: string) {
    throw new Error("Method not implemented.");
  }
}
