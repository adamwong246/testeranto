import net from "net";
import fs from "fs";
import path from "path";
import { ScreencastOptions } from "puppeteer-core";
import { PassThrough } from "stream";
import { CdpPage } from "puppeteer-core/lib/esm/puppeteer";

import { ITLog, ITTestResourceConfiguration } from "../lib";

import { PM } from ".";

type IFPaths = string[];
const fPaths: IFPaths = [];

export class PM_Node extends PM {
  testResourceConfiguration: ITTestResourceConfiguration;
  client: net.Socket;

  constructor(t: ITTestResourceConfiguration) {
    super();
    this.testResourceConfiguration = t;
  }

  start(): Promise<void> {
    return new Promise((res) => {
      process.on("message", (message: unknown) => {
        if (message.path) {
          this.client = net.createConnection(message.path, () => {
            res();
          });
        }
      });
    });
  }

  stop(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  send<I>(command: string, ...argz): Promise<I> {
    return new Promise<I>((res) => {
      const key = Math.random().toString();

      const myListener = (event) => {
        const x = JSON.parse(event);
        if (x.key === key) {
          process.removeListener("message", myListener);
          res(x.payload);
        }
      };

      process.addListener("message", myListener);

      this.client.write(JSON.stringify([command, ...argz, key]));
    });
  }

  pages(): string[] {
    return this.send("pages", ...arguments);
  }

  waitForSelector(p: string, s: string): any {
    return this.send("waitForSelector", ...arguments);
  }

  closePage(p) {
    return this.send("closePage", ...arguments);
    // return globalThis["closePage"](p);
  }

  goto(page: string, url: string) {
    return this.send("goto", ...arguments);
    // return globalThis["goto"](cdpPage.mainFrame()._id, url);
  }

  async newPage(): Promise<CdpPage> {
    return this.send<CdpPage>("newPage");
  }

  $(selector: string) {
    return this.send("$", ...arguments);
  }

  isDisabled(selector: string): Promise<boolean> {
    return this.send("isDisabled", ...arguments);
  }

  getAttribute(selector: string, attribute: string) {
    return this.send("getAttribute", ...arguments);
  }

  getValue(selector: string) {
    return this.send("getValue", ...arguments);
  }

  focusOn(selector: string) {
    return this.send("focusOn", ...arguments);
  }

  typeInto(selector: string) {
    return this.send("typeInto", ...arguments);
  }

  page() {
    return this.send("page");
  }

  click(selector: string) {
    return this.send("click", ...arguments);
  }

  screencast(opts: ScreencastOptions, page: string) {
    return this.send(
      "screencast",
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path,
      },
      page,
      this.testResourceConfiguration.name
    );
  }

  screencastStop(p: string) {
    return this.send("screencastStop", ...arguments);
  }

  customScreenShot(opts: ScreencastOptions, page?: string) {
    return this.send(
      "customScreenShot",
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path,
      },
      page,
      this.testResourceConfiguration.name
    );
  }

  existsSync(destFolder: string) {
    return this.send(
      "existsSync",
      this.testResourceConfiguration.fs + "/" + destFolder
    );
  }

  mkdirSync() {
    return this.send("mkdirSync", this.testResourceConfiguration.fs + "/");
  }

  async write(uid: number, contents: string): Promise<boolean> {
    return await this.send("write", ...arguments);
  }

  async writeFileSync(filepath: string, contents: string) {
    return await this.send<boolean>(
      "writeFileSync",
      this.testResourceConfiguration.fs + "/" + filepath,
      contents,
      this.testResourceConfiguration.name
    );
  }

  async createWriteStream(filepath: string) {
    return await this.send<string>(
      "createWriteStream",
      this.testResourceConfiguration.fs + "/" + filepath,
      this.testResourceConfiguration.name
    );
  }

  async end(uid) {
    return await this.send<boolean>("end", ...arguments);
  }

  async customclose() {
    return await this.send(
      "customclose",
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
