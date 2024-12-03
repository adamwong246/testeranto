import fs from "fs";
import path from "path";
import puppeteer, { ScreenshotOptions } from "puppeteer-core";
import { PassThrough } from "stream";

import { ITLog, ITTestResourceConfiguration } from "../lib";
import { IBuiltConfig } from "../lib/types";

import { PM } from "./index.js";

type IFPaths = string[];
const fPaths: IFPaths = [];

const fileStreams3: fs.WriteStream[] = [];
const screenshots3: Promise<any>[] = [];
const doneFileStream3: Promise<any>[] = [];

export class PM_Main extends PM {
  configs: IBuiltConfig;

  ports: Record<number, boolean>;
  queue: any[];

  // testResourceConfiguration: ITTestResourceConfiguration;

  constructor(
    configs: IBuiltConfig
    // testResourceConfig: ITTestResourceConfiguration
  ) {
    super();
    // this.testResourceConfiguration = testResourceConfig;
    // console.log("mkdirsync4", testResourceConfig);
    this.server = {};
    this.configs = configs;
    this.ports = {};
    this.configs.ports.forEach((element) => {
      this.ports[element] = "true"; // set ports as open
    });

    globalThis["mkdirSync"] = (fp: string) => {
      if (!fs.existsSync(fp)) {
        return fs.mkdirSync(fp, {
          recursive: true,
        });
      }
      return false;
    };

    globalThis["writeFileSync"] = (fp: string, contents: string) => {
      // Create directories if they don't exist
      const dir = path.dirname(fp.split("/").slice(0, -1).join("/"));
      console.log("dir", dir);
      fs.mkdirSync(dir, {
        recursive: true,
      });
      return fs.writeFileSync(fp, contents);
    };

    globalThis["createWriteStream"] = (filepath: string) => {
      const f = fs.createWriteStream(filepath);
      fileStreams3.push(f);

      return {
        ...JSON.parse(JSON.stringify(f)),
        uid: fileStreams3.length - 1,
      };
    };

    globalThis["write"] = (uid: number, contents: string) => {
      console.log("write", uid, contents);
      // process.exit();
      fileStreams3[uid].write(contents);
    };

    globalThis["end"] = (uid: number) => {
      fileStreams3[uid].end();
    };
  }

  async startPuppeteer(options: any, destfolder: string): Promise<any> {
    this.browser = await puppeteer.launch(options);
    return this.browser;
  }

  launchNode = async (src: string, dest: string) => {
    console.log("launchNode", src);
    // childProcesses[src] = "running";
    const destFolder = dest.replace(".mjs", "");

    let argz = "";

    const testConfig = this.configs.tests.find((t) => {
      return t[0] === src;
    });

    if (!testConfig) {
      console.error("missing test config");
      process.exit(-1);
    }
    const testConfigResource = testConfig[2];

    console.log("mark22 testConfigResource", testConfigResource);
    let portsToUse: string[] = [];
    if (testConfigResource.ports === 0) {
      argz = JSON.stringify({
        scheduled: true,
        name: src,
        ports: portsToUse,
        fs: destFolder,
        browserWSEndpoint: this.browser.wsEndpoint(),
      });
    } else if (testConfigResource.ports > 0) {
      const openPorts = Object.entries(this.ports).filter(
        ([portnumber, portopen]) => portopen
      );
      if (openPorts.length >= testConfigResource.ports) {
        for (let i = 0; i < testConfigResource.ports; i++) {
          portsToUse.push(openPorts[i][0]);
          this.ports[openPorts[i][0]] = false; // port is now closed
        }

        argz = JSON.stringify({
          scheduled: true,
          name: src,
          // ports: [3333],
          ports: portsToUse,
          fs: ".",
          browserWSEndpoint: this.browser.wsEndpoint(),
        });
      } else {
        this.queue.push(src);
        return;
      }
    } else {
      console.error("negative port makes no sense", src);
      process.exit(-1);
    }

    const builtfile = dest + ".mjs";

    this.server[builtfile] = await import(builtfile).then((module) => {
      return module.default.then((defaultModule) => {
        defaultModule
          .receiveTestResourceConfig(argz)
          .then((x) => {
            console.log("then", x);
            return x;
          })
          .catch((e) => {
            console.log("catch", e);
          });
      });
    });

    for (let i = 0; i <= portsToUse.length; i++) {
      this.ports[i] = true; //port is open again
    }
  };

  launchWeb = (t: string, dest: string) => {
    console.log("launchWeb", t, dest);
    const testResourceConfiguration = this.testResourceConfiguration;

    // childProcesses[t] = "running";
    const destFolder = dest.replace(".mjs", "");

    const webArgz = JSON.stringify({
      name: dest,
      ports: [].toString(),
      fs: destFolder,
      browserWSEndpoint: this.browser.wsEndpoint(),
    });

    const evaluation = `import('${dest}.mjs').then(async (x) => {
      console.log("imported", x, (x.default));
      try {
        await (await x.default).receiveTestResourceConfig(${webArgz})
      } catch (e) {
        console.log("fail", e)
      }
    })`;

    const fileStreams2: fs.WriteStream[] = [];

    const screenshots2: Promise<any>[] = [];
    const doneFileStream2: Promise<any>[] = [];

    this.browser
      .newPage()
      .then((page) => {
        page.exposeFunction(
          "custom-screenshot",
          async (ssOpts: ScreenshotOptions) => {
            const p = ssOpts.path as string;
            console.log("custom-screenshot", ssOpts);
            const dir = path.dirname(p);
            console.log("dir", dir);
            fs.mkdirSync(dir, {
              recursive: true,
            });
            // page.screenshot({
            //   ...ssOpts,
            //   path: ssOpts.path,
            // });

            // screenshots.push(
            //   page.screenshot({
            //     ...ssOpts,
            //     path: ssOpts.path,
            //   })
            // );
            return await page.screenshot({
              ...ssOpts,
              path: p,
            });
          }
        );

        page.exposeFunction("writeFileSync", (fp: string, contents: string) => {
          console.log("writeFileSync", fp);
          // Create directories if they don't exist
          const dir = path.dirname(fp);
          console.log("dir", dir);
          fs.mkdirSync(dir, {
            recursive: true,
          });
          // return fs.writeFileSync(fp, contents);

          const p = new Promise<string>(async (res, rej) => {
            fs.writeFileSync(fp, contents);
            res(fp);
          });
          doneFileStream2.push(p);
          return p;
        });

        page.exposeFunction("existsSync", (fp: string, contents: string) => {
          return fs.existsSync(fp);
        });

        page.exposeFunction("mkdirSync", (fp: string) => {
          console.log("mkdirsync", fp);
          if (!fs.existsSync(fp)) {
            return fs.mkdirSync(fp, {
              recursive: true,
            });
          }
          return false;
        });

        page.exposeFunction("createWriteStream", (fp: string) => {
          const f = fs.createWriteStream(fp);

          const p = new Promise<string>((res, rej) => {
            res(fp);
          });
          doneFileStream2.push(p);
          f.on("close", async () => {
            await p;
          });
          fileStreams2.push(f);
          return {
            ...JSON.parse(JSON.stringify(f)),
            uid: fileStreams2.length - 1,
          };
        });

        page.exposeFunction("write", async (uid: number, contents: string) => {
          return fileStreams2[uid].write(contents);
        });

        page.exposeFunction("end", async (uid: number) => {
          return fileStreams2[uid].end();
        });

        page.exposeFunction("customclose", () => {
          console.log("closing doneFileStream2", doneFileStream2);
          // console.log("closing doneFileStream2", doneFileStream2);
          Promise.all([...doneFileStream2, ...screenshots2]).then(() => {
            // page.close();
          });

          // page.close();
          // Promise.all(screenshots).then(() => {
          //   page.close();
          // });
          // setTimeout(() => {
          //   console.log("Delayed for 1 second.");
          //   page.close();
          // }, 5000);

          // return page.close();
        });

        return page;
      })
      .then(async (page) => {
        await page.goto(`file://${`${dest}.html`}`, {
          // waitUntil: "load",
          // timeout: 0,
        });

        page.evaluate(evaluation).finally(() => {
          console.log("evaluation failed.", dest);
        });

        return page;
      })
      .then((page) => {
        // console.log("qwe", page);
        // page.close();
      });
  };

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

  writeFileSync(fp: string, contents: string) {
    fs.writeFileSync(fp, contents);
  }

  createWriteStream(filepath: string): fs.WriteStream {
    return fs.createWriteStream(filepath);
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

  write(accessObject: { uid: number }, contents: string): boolean {
    throw new Error("Method not implemented.");
  }
}
