import fs from "fs";
import path from "path";
import { ScreencastOptions } from "puppeteer-core";
import { PassThrough } from "stream";

import { ITLog, ITTestResourceConfiguration } from "../lib";

import { PM } from "./index.js";
import { CdpPage, Page } from "puppeteer-core/lib/esm/puppeteer";

type IFPaths = string[];
const fPaths: IFPaths = [];

type PuppetMasterServer = Record<string, Promise<any>>;

export class PM_Node extends PM {
  server: PuppetMasterServer;
  testResourceConfiguration: ITTestResourceConfiguration;

  constructor(t: ITTestResourceConfiguration) {
    super();
    this.server = {};
    this.testResourceConfiguration = t;
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

  newPage(): CdpPage {
    return globalThis["newPage"]();
  }

  $(selector: string): boolean {
    throw new Error("Method not implemented.");
  }

  isDisabled(selector: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  getAttribute(selector: string, attribute: string) {
    throw new Error("Method not implemented.");
  }
  getValue(selector: string) {
    throw new Error("Method not implemented.");
  }

  focusOn(selector: string) {
    throw new Error("Method not implemented.");
  }

  typeInto(value: string) {
    throw new Error("Method not implemented.");
  }

  page() {
    return globalThis["page"]();
  }

  click(selector: string): string | undefined {
    return globalThis["click"](selector);
  }

  screencast(opts: ScreencastOptions, page: CdpPage) {
    return globalThis["screencast"](
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path,
      },
      page.mainFrame()._id,
      this.testResourceConfiguration.name
    );
  }

  screencastStop(p: string) {
    return globalThis["screencastStop"](p);
  }

  customScreenShot(opts: ScreencastOptions, cdpPage: CdpPage) {
    return globalThis["customScreenShot"](
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path,
      },
      cdpPage.mainFrame()._id,
      this.testResourceConfiguration.name
    );
  }

  existsSync(destFolder: string): boolean {
    return globalThis["existsSync"](
      this.testResourceConfiguration.fs + "/" + destFolder
    );
  }

  mkdirSync() {
    return globalThis["mkdirSync"](this.testResourceConfiguration.fs + "/");
  }

  write(writeObject: { uid: number }, contents: string) {
    return globalThis["write"](writeObject.uid, contents);
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

  end(writeObject: { uid: number }) {
    return globalThis["end"](writeObject.uid);
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
