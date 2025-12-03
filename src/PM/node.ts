/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-rest-params */
import net from "net";
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
  client: net.Socket;

  constructor(t: ITTestResourceConfiguration, dockerManHost: string, dockerManPort: number) {
    super();
    this.testResourceConfiguration = t;

    console.log(`🔌 Connecting to DockerMan at ${dockerManHost}:${dockerManPort}`);
    this.client = net.createConnection(dockerManPort, dockerManHost, () => {
      console.log('✅ Connected to DockerMan via TCP');
      // Send registration message
      const registerMessage = JSON.stringify(['register', this.testResourceConfiguration.name]) + '\n';
      this.client.write(registerMessage);
      return;
    });

    this.client.on('error', (err) => {
      console.error('❌ Failed to connect to DockerMan:', err.message);
    });
  }

  start(): Promise<void> {
    throw new Error("DEPRECATED");
  }

  stop(): Promise<void> {
    throw new Error("stop not implemented.");
  }

  send<I>(command: string, ...argz): Promise<I> {
    const callbackId = Math.random().toString();
    if (!this.client || this.client.destroyed) {
      console.error(
        `Tried to send "${command} (${argz})" but the TCP client is not established or destroyed. Exiting as failure!`
      );
      process.exit(-1);
    }

    return new Promise<I>((resolve, reject) => {
      const messageHandler = (data: Buffer) => {
        try {
          const response = JSON.parse(data.toString());
          if (response.callbackId === callbackId) {
            this.client.removeListener('data', messageHandler);
            if (response.error) {
              reject(new Error(response.error));
            } else {
              resolve(response.result);
            }
          }
        } catch (err) {
          // Not our response, continue
        }
      };

      this.client.on('data', messageHandler);
      
      // Send the message
      const message = JSON.stringify([command, ...argz, callbackId]) + '\n';
      this.client.write(message, (err) => {
        if (err) {
          this.client.removeListener('data', messageHandler);
          reject(err);
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

  async writeFileSync(filepath, contents) {
    const z = arguments["0"];

    // const filepath = z[0];
    // const contents = z[1];

    // const filepath = arguments[0];
    // const contents = arguments[1];

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
