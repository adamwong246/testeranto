import fs from "fs";
import path from "path";
import { ScreencastOptions } from "puppeteer-core";
import { CdpPage } from "puppeteer-core/lib/esm/puppeteer";
import { PassThrough } from "stream";

import { ITLog, ITTestResourceConfiguration } from "../lib";

import { PM } from ".";

type IFPaths = string[];
const fPaths: IFPaths = [];

type PuppetMasterServer = Record<string, Promise<any>>;

export class PM_Pure extends PM {
  server: PuppetMasterServer;
  testResourceConfiguration: ITTestResourceConfiguration;

  constructor(t: ITTestResourceConfiguration) {
    super();
    this.server = {};
    this.testResourceConfiguration = t;
  }

  start(): Promise<void> {
    return new Promise((r) => r());
  }

  stop(): Promise<void> {
    return new Promise((r) => r());
  }

  pages() {
    return globalThis["pages"]();
  }

  waitForSelector(p: string, s: string): any {
    return globalThis["waitForSelector"](p, s);
  }

  closePage(p): string {
    return globalThis["closePage"](p);
  }

  goto(cdpPage: CdpPage, url: string): any {
    return globalThis["goto"](cdpPage.mainFrame()._id, url);
  }

  newPage() {
    return globalThis["newPage"]();
  }

  $(selector: string): boolean {
    return globalThis["$"](selector);
  }

  isDisabled(selector: string): Promise<boolean> {
    return globalThis["isDisabled"](selector);
  }

  getAttribute(selector: string, attribute: string) {
    return globalThis["getAttribute"](selector, attribute);
  }

  getValue(selector: string) {
    return globalThis["getValue"](selector);
  }

  focusOn(selector: string) {
    return globalThis["focusOn"](selector);
  }

  typeInto(selector: string, value: string) {
    return globalThis["typeInto"](selector, value);
  }

  page() {
    return globalThis["page"]();
  }

  click(selector: string): string | undefined {
    return globalThis["click"](selector);
  }

  screencast(opts: ScreencastOptions, page: string) {
    return globalThis["screencast"](
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path,
      },
      page,
      this.testResourceConfiguration.name
    );
  }

  screencastStop(p: string) {
    return globalThis["screencastStop"](p);
  }

  customScreenShot(opts: ScreencastOptions, page: string) {
    return globalThis["customScreenShot"](
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path,
      },
      page,
      this.testResourceConfiguration.name
    );
  }

  existsSync(destFolder: string): Promise<boolean> {
    return globalThis["existsSync"](
      this.testResourceConfiguration.fs + "/" + destFolder
    );
  }

  mkdirSync() {
    return globalThis["mkdirSync"](this.testResourceConfiguration.fs + "/");
  }

  write(uid: number, contents: string) {
    return globalThis["write"](uid, contents);
  }

  writeFileSync(filepath: string, contents: string) {
    return globalThis["writeFileSync"](
      this.testResourceConfiguration.fs + "/" + filepath,
      contents,
      this.testResourceConfiguration.name
    );
  }

  createWriteStream(filepath: string): any {
    return globalThis["createWriteStream"](
      this.testResourceConfiguration.fs + "/" + filepath,
      this.testResourceConfiguration.name
    );
  }

  end(uid: number) {
    return globalThis["end"](uid);
  }

  customclose() {
    globalThis["customclose"](
      this.testResourceConfiguration.fs,
      this.testResourceConfiguration.name
    );
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

  // launch(options?: PuppeteerLaunchOptions): Promise<Browser>;
  startPuppeteer(options?: any): any {
    // return puppeteer.connect(options).then((b) => {
    //   this.browser = b;
    // });
  }
}
