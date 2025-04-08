import net from "net";
import fs from "fs";
import path from "path";
import { ScreencastOptions } from "puppeteer-core";
import { PassThrough } from "stream";
import rpc from "rpc-over-ipc";

import { ITLog, ITTestResourceConfiguration } from "../lib";

import { PM } from "./index.js";
import { CdpPage, Page } from "puppeteer-core/lib/esm/puppeteer";

type IFPaths = string[];
const fPaths: IFPaths = [];

type PuppetMasterServer = Record<string, Promise<any>>;

export class PM_Node extends PM {
  server: PuppetMasterServer;
  testResourceConfiguration: ITTestResourceConfiguration;
  client: net.Socket;

  constructor(t: ITTestResourceConfiguration) {
    super();
    this.server = {};
    this.testResourceConfiguration = t;
  }

  start(): Promise<void> {
    return new Promise((res) => {
      process.on("message", (message: unknown) => {
        console.log("MESSAGE", message);
        if (message.path) {
          this.client = net.createConnection(message.path, () => {
            res();
            // this.client.write("hi from child");
            // console.error("goodbye node error", e);
            // process.exit(-1);
          });
        }
      });
    });
  }

  stop(): Promise<void> {
    throw new Error("Method not implemented.");
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

  write(uid: number, contents: string): Promise<boolean> {
    return new Promise<boolean>((res) => {
      const key = Math.random().toString();

      const myListener = (event) => {
        const x = JSON.parse(event);

        if (x.key === key) {
          // console.log(`WRITE MATCH`, key);
          process.removeListener("message", myListener);
          res(x.written);
        }
      };

      process.addListener("message", myListener);

      this.client.write(JSON.stringify(["write", uid, contents, key]));
    });

    // return globalThis["write"](writeObject.uid, contents);
  }

  writeFileSync(filepath: string, contents: string) {
    return new Promise<boolean>((res) => {
      const key = Math.random().toString();

      const myListener = (event) => {
        const x = JSON.parse(event);
        if (x.key === key) {
          process.removeListener("message", myListener);
          res(x.uid);
        }
      };

      process.addListener("message", myListener);

      this.client.write(
        JSON.stringify([
          "writeFileSync",
          this.testResourceConfiguration.fs + "/" + filepath,
          contents,
          this.testResourceConfiguration.name,
          key,
        ])
      );
    });

    // return globalThis["writeFileSync"](
    //   this.testResourceConfiguration.fs + "/" + filepath,
    //   contents,
    //   this.testResourceConfiguration.name
    // );
  }

  createWriteStream(filepath: string): Promise<string> {
    return new Promise((res) => {
      const key = Math.random().toString();

      const myListener = (event) => {
        const x = JSON.parse(event);

        if (x.key === key) {
          process.removeListener("message", myListener);
          res(x.uid);
        }
      };

      process.addListener("message", myListener);

      this.client.write(
        JSON.stringify([
          "createWriteStream",
          this.testResourceConfiguration.fs + "/" + filepath,
          this.testResourceConfiguration.name,
          key,
        ])
      );
    });
  }

  end(uid) {
    console.log("end");
    return new Promise((res) => {
      const key = Math.random().toString();

      const myListener = (event) => {
        console.log(`Received end: ${JSON.stringify(event)}`);

        const x = JSON.parse(event);
        console.log(`x: `, x);
        if (x.key === key) {
          console.log(`end MATCH`, key);
          process.removeListener("message", myListener);
          res(x.uid);
        }
      };

      process.addListener("message", myListener);

      this.client.write(JSON.stringify(["end", uid, key]));
    });

    // return globalThis["end"](writeObject.uid);
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
