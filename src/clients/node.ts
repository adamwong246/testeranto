/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
import WebSocket from "ws";
import fs from "fs";
import path from "path";
import { ScreencastOptions, ScreenshotOptions } from "puppeteer-core";
import { PassThrough } from "stream";

import { ITLog, ITTestResourceConfiguration } from "../lib";

import { PM } from ".";

type IFPaths = string[];
const fPaths: IFPaths = [];

export class PM_Node extends PM {
  testResourceConfiguration: ITTestResourceConfiguration;
  ws: WebSocket;
  private messageCallbacks: Map<string, (data: any) => void> = new Map();

  constructor(t: ITTestResourceConfiguration, wsUrl: string) {
    super();
    this.testResourceConfiguration = t;

    // Connect via WebSocket instead of net.Socket
    this.ws = new WebSocket(wsUrl);

    this.ws.on("open", () => {
      console.log("WebSocket connected to", wsUrl);
    });

    this.ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());

        // Handle responses with keys
        if (message.key && this.messageCallbacks.has(message.key)) {
          const callback = this.messageCallbacks.get(message.key);
          if (callback) {
            callback(message.payload);
            this.messageCallbacks.delete(message.key);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    this.ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    this.ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  }

  start(): Promise<void> {
    throw new Error("DEPRECATED");
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
        this.ws.on("close", () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  send<I>(command: string, ...argz): Promise<I> {
    const key = Math.random().toString();

    // Wait for WebSocket to be open
    const waitForOpen = (): Promise<void> => {
      if (this.ws.readyState === WebSocket.OPEN) {
        return Promise.resolve();
      }
      if (this.ws.readyState === WebSocket.CONNECTING) {
        return new Promise((resolve) => {
          const onOpen = () => {
            this.ws.off("open", onOpen);
            resolve();
          };
          this.ws.on("open", onOpen);
        });
      }
      // If closing or closed, reject
      return Promise.reject(
        new Error(`WebSocket is not open. State: ${this.ws.readyState}`)
      );
    };

    return waitForOpen().then(() => {
      return new Promise<I>((res, rej) => {
        // Store the callback to handle the response
        this.messageCallbacks.set(key, (payload) => {
          res(payload);
        });

        // Set a timeout for the response
        const timeoutId = setTimeout(() => {
          this.messageCallbacks.delete(key);
          rej(new Error(`Timeout waiting for response to command: ${command}`));
        }, 10000); // 10 second timeout

        // Send the message in a format the server expects
        const message = {
          type: command,
          data: argz.length > 0 ? argz : undefined,
          key: key,
        };
        this.ws.send(JSON.stringify(message));

        // Clean up timeout on response
        const originalCallback = this.messageCallbacks.get(key);
        if (originalCallback) {
          this.messageCallbacks.set(key, (payload) => {
            clearTimeout(timeoutId);
            originalCallback(payload);
          });
        }
      });
    });
  }

  async pages() {
    return this.send<string[]>("pages", ...arguments);
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

  async newPage() {
    return this.send<string>("newPage");
  }

  $(selector: string, page: string) {
    return this.send("$", ...arguments);
  }

  isDisabled(selector: string): Promise<boolean> {
    return this.send("isDisabled", ...arguments);
  }

  getAttribute(selector: string, attribute: string, p: string) {
    return this.send("getAttribute", ...arguments);
  }

  getInnerHtml(selector: string, p: string) {
    return this.send("getInnerHtml", ...arguments);
  }

  // setValue(selector: string) {
  //   return this.send("getValue", ...arguments);
  // }

  focusOn(selector: string) {
    return this.send("focusOn", ...arguments);
  }

  typeInto(selector: string) {
    return this.send("typeInto", ...arguments);
  }

  page() {
    return this.send<string | undefined>("page");
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

  customScreenShot(x: ScreenshotOptions, y?: string) {
    const opts = x[0];
    const page = x[1];

    return this.send(
      "customScreenShot",
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path,
      },

      this.testResourceConfiguration.name,
      page
    );
  }

  async existsSync(destFolder: string): Promise<boolean> {
    return await this.send<boolean>(
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

  async writeFileSync(filepath: string, contents: string): Promise<boolean> {
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

  testArtiFactoryfileWriter(tLog: ITLog, callback: (p: Promise<void>) => void) {
    return (fPath: string, value: string | Buffer | PassThrough) => {
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

            // fs.writeFileSync(
            //   path.resolve(
            //     targetDir.split("/").slice(0, -1).join("/"),
            //     "manifest"
            //   ),
            //   fPaths.join(`\n`),
            //   {
            //     encoding: "utf-8",
            //   }
            // );

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

  // launch(options?: PuppeteerLaunchOptions): Promise<Browser>;
  startPuppeteer(options?: any): any {
    // return puppeteer.connect(options).then((b) => {
    //   this.browser = b;
    // });
  }

  // async launchSideCar(
  //   n: number
  // ): Promise<[number, ITTestResourceConfiguration]> {
  //   return this.send<[number, ITTestResourceConfiguration]>(
  //     "launchSideCar",
  //     n,
  //     this.testResourceConfiguration.name
  //   );
  // }

  // stopSideCar(n: number): Promise<any> {
  //   return this.send<ITTestResourceConfiguration>(
  //     "stopSideCar",
  //     n,
  //     this.testResourceConfiguration.name
  //   );
  // }
}
