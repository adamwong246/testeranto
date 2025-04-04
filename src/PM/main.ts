import { CdpPage, Page } from "puppeteer-core/lib/esm/puppeteer";
import fs from "fs";
import path from "path";
import puppeteer, {
  Browser,
  ConsoleMessage,
  LaunchOptions,
  ScreenRecorder,
  ScreenshotOptions,
} from "puppeteer-core";
import { PassThrough } from "stream";
import crypto from "crypto";

import { IBuiltConfig, IFinalResults, ITestTypes } from "../lib/types";
import { ITLog } from "../lib/index.js";

import { PM } from "./index.js";

const fileStreams3: fs.WriteStream[] = [];

type IFPaths = string[];

const fPaths: IFPaths = [];

const files: Record<string, Set<string>> = {};
const recorders: Record<string, ScreenRecorder> = {};
const screenshots: Record<string, Promise<Uint8Array>[]> = {};

const red = "\x1b[31m";
const green = "\x1b[32m";
const reset = "\x1b[0m"; // Resets to default color

const statusMessagePretty = (failures: number, test: string) => {
  if (failures === 0) {
    console.log(green + `> ${test} completed successfully` + reset);
  } else {
    console.log(red + `> ${test} failed ${failures} times` + reset);
  }
};

export class PM_Main extends PM {
  browser: Browser;

  shutdownMode = false;
  configs: IBuiltConfig;
  ports: Record<number, boolean>;
  queue: any[];

  bigBoard: Record<
    string,
    {
      status: "?" | "running" | "waiting";
      runTimeError?: number;
      typeErrors?: string;
      staticErrors?: string;
    }
  > = {};

  constructor(configs: IBuiltConfig) {
    super();
    this.server = {};
    this.configs = configs;
    this.ports = {};

    this.configs.tests.forEach(([t]) => {
      this.bigBoard[t] = {
        status: "?",
      };
    });

    this.configs.ports.forEach((element) => {
      this.ports[element] = "true"; // set ports as open
    });

    globalThis["waitForSelector"] = async (pageKey: string, sel: string) => {
      console.log("waitForSelector", pageKey, sel);
      const page = (await this.browser.pages()).find(
        (p) => p.mainFrame()._id === pageKey
      );
      await page?.waitForSelector(sel);
    };

    globalThis["screencastStop"] = async (path: string) => {
      return recorders[path].stop();
    };

    globalThis["closePage"] = async (pageKey) => {
      const page = (await this.browser.pages()).find(
        (p) => p.mainFrame()._id === pageKey
      );
      return page.close();
    };

    globalThis["goto"] = async (pageKey: string, url: string) => {
      const page = (await this.browser.pages()).find(
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
      fs.mkdirSync(path.dirname(filepath), {
        recursive: true,
      });
      if (!files[testName]) {
        files[testName] = new Set();
      }
      files[testName].add(filepath);
      return fs.writeFileSync(filepath, contents);
    };

    globalThis["createWriteStream"] = (filepath: string, testName: string) => {
      const f = fs.createWriteStream(filepath);
      fileStreams3.push(f);
      // files.add(filepath);
      if (!files[testName]) {
        files[testName] = new Set();
      }
      files[testName].add(filepath);
      return {
        ...JSON.parse(JSON.stringify(f)),
        uid: fileStreams3.length - 1,
      };
    };

    globalThis["write"] = (uid: number, contents: string) => {
      fileStreams3[uid].write(contents);
    };

    globalThis["end"] = (uid: number) => {
      fileStreams3[uid].end();
    };

    // async (ssOpts: ScreenshotOptions, testName: string) => {
    //   const p = ssOpts.path as string;
    //   const dir = path.dirname(p);
    //   fs.mkdirSync(dir, {
    //     recursive: true,
    //   });
    //   if (!files[testName]) {
    //     files[testName] = new Set();
    //   }
    //   files[testName].add(ssOpts.path as string);

    //   const sPromise = page.screenshot({
    //     ...ssOpts,
    //     path: p,
    //   });

    //   if (!screenshots[testName]) {
    //     screenshots[testName] = [];
    //   }
    //   screenshots[testName].push(sPromise);
    //   // sPromise.then(())
    //   await sPromise;
    //   return sPromise;
    //   // page.evaluate(`window["screenshot done"]`);
    // };

    globalThis["customScreenShot"] = async (
      opts: { path: string },
      pageKey: string,
      testName: string
    ) => {
      const page = (await this.browser.pages()).find(
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
        (p) => p.mainFrame()._id === pageKey
      );

      const p = opts.path as string;
      const dir = path.dirname(p);
      fs.mkdirSync(dir, {
        recursive: true,
      });

      const recorder = await page?.screencast({
        ...opts,
        path: p,
      });

      recorders[opts.path] = recorder;

      return opts.path;
    };

    // globalThis["customclose"] = (p: string, testName: string) => {
    //   if (!files[testName]) {
    //     files[testName] = new Set();
    //   }

    //   fs.writeFileSync(
    //     p + "/manifest.json",
    //     JSON.stringify(Array.from(files[testName]))
    //   );
    //   delete files[testName];
    // };
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
  ////////////////////////////////////////////////////////////////////////////////

  async startPuppeteer(
    options: LaunchOptions,
    destfolder: string
  ): Promise<any> {
    this.browser = (await puppeteer.launch(options)) as any;
  }

  ////////////////////////////////////////////////////////////////////////////////

  shutDown() {
    console.log("shutting down...");
    this.shutdownMode = true;
    this.checkForShutdown();
  }

  checkForShutdown = () => {
    const anyRunning: boolean =
      Object.values(this.bigBoard).filter((x) => x.status === "running")
        .length > 0;
    if (anyRunning) {
    } else {
      this.browser.disconnect().then(() => {
        console.log("Goodbye");
        process.exit();
      });
    }
  };

  testIsNowRunning = (src: string) => {
    console.log("testIsNowRunning", src);
    this.bigBoard[src].status = "running";
  };

  testIsNowDone = (src: string) => {
    console.log("testIsNowDone", src);
    this.bigBoard[src].status = "waiting";
    if (this.shutdownMode) {
      this.checkForShutdown();
    }
  };

  launchNode = async (src: string, dest: string) => {
    console.log("! node", src);
    this.testIsNowRunning(src);

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
          fs: destFolder,
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

    const builtfile = dest;

    const webSideCares: Page[] = [];

    // await Promise.all(
    //   testConfig[3].map(async (sidecar) => {
    //     if (sidecar[1] === "web") {
    //       const s = await this.launchWebSideCar(
    //         sidecar[0],
    //         destinationOfRuntime(sidecar[0], "web", this.configs),
    //         sidecar
    //       );
    //       webSideCares.push(s);
    //       return s;
    //     }

    //     if (sidecar[1] === "node") {
    //       return this.launchNodeSideCar(
    //         sidecar[0],
    //         destinationOfRuntime(sidecar[0], "node", this.configs),
    //         sidecar
    //       );
    //     }
    //   })
    // );

    this.server[builtfile] = await import(
      `${builtfile}?cacheBust=${Date.now()}`
    ).then((module) => {
      return module.default.then((defaultModule) => {
        defaultModule
          .receiveTestResourceConfig(argz)
          .then(async ({ features, failed }: IFinalResults) => {
            this.receiveFeatures(features, destFolder, src);
            // console.log(`${src} completed with ${failed} errors`);
            statusMessagePretty(failed, src);
            this.receiveExitCode(src, failed);
          })
          .catch((e) => {
            console.log(`${src} errored with`, e);
          })
          .finally(() => {
            webSideCares.forEach((webSideCar) => webSideCar.close());
            this.testIsNowDone(src);
          });
      });
    });

    // console.log("portsToUse", portsToUse);
    for (let i = 0; i <= portsToUse.length; i++) {
      if (portsToUse[i]) {
        this.ports[portsToUse[i]] = "true"; //port is open again
      }
    }
  };

  launchWebSideCar = async (
    src: string,
    dest: string,
    testConfig: ITestTypes
  ): Promise<Page> => {
    const d = dest + ".mjs";
    console.log("launchWebSideCar", src, dest, d);
    const destFolder = dest.replace(".mjs", "");
    // const webArgz = JSON.stringify({
    //   name: dest,
    //   ports: [].toString(),
    //   fs: destFolder,
    //   browserWSEndpoint: this.browser.wsEndpoint(),
    // });

    const fileStreams2: fs.WriteStream[] = [];
    const doneFileStream2: Promise<any>[] = [];

    return new Promise((res, rej) => {
      this.browser
        .newPage()
        .then((page) => {
          // page.on("console", (msg) => {
          //   console.log("web > ", msg.args(), msg.text());
          //   // for (let i = 0; i < msg._args.length; ++i)
          //   //   console.log(`${i}: ${msg._args[i]}`);
          // });

          page.exposeFunction(
            "custom-screenshot",
            async (ssOpts: ScreenshotOptions, testName: string) => {
              // console.log("main.ts browser custom-screenshot", testName);
              const p = ssOpts.path as string;
              const dir = path.dirname(p);
              fs.mkdirSync(dir, {
                recursive: true,
              });
              files[testName].add(ssOpts.path as string);

              const sPromise = page.screenshot({
                ...ssOpts,
                path: p,
              });

              if (!screenshots[testName]) {
                screenshots[testName] = [];
              }
              screenshots[testName].push(sPromise);
              // sPromise.then(())
              await sPromise;
              return sPromise;
              // page.evaluate(`window["screenshot done"]`);
            }
          );

          page.exposeFunction(
            "writeFileSync",
            (fp: string, contents: string, testName: string) => {
              const dir = path.dirname(fp);

              fs.mkdirSync(dir, {
                recursive: true,
              });

              const p = new Promise<string>(async (res, rej) => {
                fs.writeFileSync(fp, contents);
                res(fp);
              });
              doneFileStream2.push(p);

              if (!files[testName]) {
                files[testName] = new Set();
              }
              files[testName].add(fp);
              return p;
            }
          );

          page.exposeFunction("existsSync", (fp: string, contents: string) => {
            return fs.existsSync(fp);
          });

          page.exposeFunction("mkdirSync", (fp: string) => {
            if (!fs.existsSync(fp)) {
              return fs.mkdirSync(fp, {
                recursive: true,
              });
            }
            return false;
          });

          page.exposeFunction(
            "createWriteStream",
            (fp: string, testName: string) => {
              const f = fs.createWriteStream(fp);

              // if (!files[testName]) {
              //   files[testName] = new Set();
              // }
              files[testName].add(fp);

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
            }
          );

          page.exposeFunction(
            "write",
            async (uid: number, contents: string) => {
              return fileStreams2[uid].write(contents);
            }
          );

          page.exposeFunction("end", async (uid: number) => {
            return fileStreams2[uid].end();
          });

          // page.exposeFunction("customclose", (p: string, testName: string) => {
          //   fs.writeFileSync(
          //     p + "/manifest.json",
          //     JSON.stringify(Array.from(files[testName]))
          //   );
          //   delete files[testName];

          //   Promise.all(screenshots[testName] || []).then(() => {
          //     delete screenshots[testName];
          //     // page.close();
          //   });
          // });

          return page;
        })
        .then(async (page) => {
          await page.goto(`file://${`${dest}.html`}`, {});
          res(page);
        });
    });
  };

  launchNodeSideCar = async (
    src: string,
    dest: string,
    testConfig: ITestTypes
  ) => {
    const d = dest + ".mjs";
    console.log("launchNodeSideCar", src, dest, d);

    const destFolder = dest.replace(".mjs", "");

    let argz = "";

    const testConfigResource = testConfig[2];

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
      // console.log("openPorts", openPorts);
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

    // console.log(
    //   "node builtfile",
    //   (await import(`${builtfile}?cacheBust=${Date.now()}`)).default
    // );
    this.server[builtfile] = await import(
      `${builtfile}?cacheBust=${Date.now()}`
    ).then((module) => {
      return module.default.then((defaultModule) => {
        // console.log("defaultModule", defaultModule);
        const s = new defaultModule();
        s.receiveTestResourceConfig(argz);
        // Object.create(defaultModule);

        // defaultModule
        //   .receiveTestResourceConfig(argz)
        //   .then((x) => {
        //     console.log("then", x);
        //     return x;
        //   })
        //   .catch((e) => {
        //     console.log("catch", e);
        //   });
      });
    });

    // console.log("portsToUse", portsToUse);
    for (let i = 0; i <= portsToUse.length; i++) {
      if (portsToUse[i]) {
        this.ports[portsToUse[i]] = "true"; //port is open again
      }
    }
  };

  launchWeb = (t: string, dest: string) => {
    console.log("! web", t);
    this.testIsNowRunning(t);

    // sidecars.map((sidecar) => {
    //   if (sidecar[1] === "node") {
    //     return this.launchNodeSideCar(
    //       sidecar[0],
    //       destinationOfRuntime(sidecar[0], "node", this.configs),
    //       sidecar
    //     );
    //   }
    // });

    const destFolder = dest.replace(".mjs", "");

    const webArgz = JSON.stringify({
      name: dest,
      ports: [].toString(),
      fs: destFolder,
      browserWSEndpoint: this.browser.wsEndpoint(),
    });

    const d = `${dest}?cacheBust=${Date.now()}`;

    const evaluation = `
    console.log("importing ${d}");
    import('${d}').then(async (x) => {
      console.log("imported", (await x.default));
      try {
        return await (await x.default).receiveTestResourceConfig(${webArgz})
      } catch (e) {
        console.log("fail", e)
      }
    })`;

    const fileStreams2: fs.WriteStream[] = [];
    const doneFileStream2: Promise<any>[] = [];

    const stdoutStream = fs.createWriteStream(`${destFolder}/stdout.log`);
    const stderrStream = fs.createWriteStream(`${destFolder}/stderr.log`);

    this.browser
      .newPage()
      .then((page) => {
        // page.on("console", (msg) => {
        //   // console.log("web > ", msg.args(), msg.text());
        // });

        page.exposeFunction(
          "screencast",
          async (ssOpts: ScreenshotOptions, testName: string) => {
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
            // sPromise.then(())
            await sPromise;
            return sPromise;
            // page.evaluate(`window["screenshot done"]`);
          }
        );

        page.exposeFunction(
          "customScreenShot",
          async (ssOpts: ScreenshotOptions, testName: string) => {
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
            // sPromise.then(())
            await sPromise;
            return sPromise;
            // page.evaluate(`window["screenshot done"]`);
          }
        );

        page.exposeFunction(
          "writeFileSync",
          (fp: string, contents: string, testName: string) => {
            return globalThis["writeFileSync"](fp, contents, testName);
            // const dir = path.dirname(fp);

            // fs.mkdirSync(dir, {
            //   recursive: true,
            // });

            // const p = new Promise<string>(async (res, rej) => {
            //   fs.writeFileSync(fp, contents);
            //   res(fp);
            // });
            // doneFileStream2.push(p);

            // if (!files[testName]) {
            //   files[testName] = new Set();
            // }
            // files[testName].add(fp);
            // return p;
          }
        );

        page.exposeFunction("existsSync", (fp: string, contents: string) => {
          return fs.existsSync(fp);
        });

        page.exposeFunction("mkdirSync", (fp: string) => {
          if (!fs.existsSync(fp)) {
            return fs.mkdirSync(fp, {
              recursive: true,
            });
          }
          return false;
        });

        page.exposeFunction(
          "createWriteStream",
          (fp: string, testName: string) => {
            const f = fs.createWriteStream(fp);

            if (!files[testName]) {
              files[testName] = new Set();
            }
            files[testName].add(fp);

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
          }
        );

        page.exposeFunction("write", async (uid: number, contents: string) => {
          return fileStreams2[uid].write(contents);
        });

        page.exposeFunction("end", async (uid: number) => {
          return fileStreams2[uid].end();
        });

        // page.exposeFunction("customclose", (p: string, testName: string) => {
        //   // console.log("closing", p);

        //   console.log("\t GOODBYE customclose");

        //   fs.writeFileSync(
        //     p + "/manifest.json",
        //     JSON.stringify(Array.from(files[testName]))
        //   );
        //   delete files[testName];

        //   // console.log("screenshots[testName]", screenshots[testName]);
        //   Promise.all(screenshots[testName] || []).then(() => {
        //     delete screenshots[testName];
        //   });

        //   // globalThis["writeFileSync"](
        //   //   p + "/manifest.json",
        //   //   // files.entries()
        //   //   JSON.stringify(Array.from(files[testName]))
        //   // );

        //   // console.log("closing doneFileStream2", doneFileStream2);
        //   // console.log("closing doneFileStream2", doneFileStream2);
        //   // Promise.all([...doneFileStream2, ...screenshots2]).then(() => {
        //   //   page.close();
        //   // });

        //   // Promise.all(screenshots).then(() => {
        //   //   page.close();
        //   // });
        //   // setTimeout(() => {
        //   //   console.log("Delayed for 1 second.");
        //   //   page.close();
        //   // }, 5000);

        //   // return page.close();
        // });

        page.exposeFunction("page", () => {
          return (page.mainFrame() as unknown as { _id: string })._id;
        });

        page.exposeFunction("click", (sel) => {
          return page.click(sel);
        });

        page.exposeFunction("focusOn", (sel) => {
          return page.focus(sel);
        });

        page.exposeFunction(
          "typeInto",
          async (value) => await page.keyboard.type(value)
        );

        page.exposeFunction("getValue", (selector) =>
          page.$eval(selector, (input) => input.getAttribute("value"))
        );

        page.exposeFunction(
          "getAttribute",
          async (selector: string, attribute: string) => {
            const attributeValue = await page.$eval(selector, (input) => {
              return input.getAttribute(attribute);
            });
            return attributeValue;
          }
        );

        page.exposeFunction("isDisabled", async (selector: string) => {
          const attributeValue = await page.$eval(
            selector,
            (input: HTMLButtonElement) => {
              return input.disabled;
            }
          );
          return attributeValue;
        });

        page.exposeFunction("$", async (selector: string) => {
          const x = page.$(selector);
          const y = await x;

          return y;
        });

        return page;
      })
      .then(async (page) => {
        const close = () => {
          if (!files[t]) {
            files[t] = new Set();
          }
          // files[t].add(filepath);

          fs.writeFileSync(
            destFolder + "/manifest.json",
            JSON.stringify(Array.from(files[t]))
          );
          delete files[t];

          Promise.all(screenshots[t] || []).then(() => {
            delete screenshots[t];
            page.close();

            this.testIsNowDone(t);
            stderrStream.close();
            stdoutStream.close();
          });
        };

        page.on("pageerror", (err: Error) => {
          console.debug(`Error from ${t}: [${err.name}] `);
          stderrStream.write(err.name);

          if (err.cause) {
            console.debug(`Error from ${t} cause: [${err.cause}] `);
            stderrStream.write(err.cause);
          }

          if (err.stack) {
            console.debug(`Error from stack ${t}: [${err.stack}] `);
            stderrStream.write(err.stack);
          }

          console.debug(`Error from message ${t}: [${err.message}] `);
          stderrStream.write(err.message);
          close();
        });
        page.on("console", (log: ConsoleMessage) => {
          // console.debug(`Log from ${t}: [${log.text()}] `);
          // console.debug(`Log from ${t}: [${JSON.stringify(log.location())}] `);
          // console.debug(
          //   `Log from ${t}: [${JSON.stringify(log.stackTrace())}] `
          // );
          stdoutStream.write(log.text());
          stdoutStream.write(JSON.stringify(log.location()));
          stdoutStream.write(JSON.stringify(log.stackTrace()));
        });
        await page.goto(`file://${`${destFolder}.html`}`, {});

        await page
          .evaluate(evaluation)
          .then(async ({ failed, features }: IFinalResults) => {
            this.receiveFeatures(features, destFolder, t);
            // console.log(`${t} completed with ${failed} errors`);
            statusMessagePretty(failed, t);
            this.receiveExitCode(t, failed);
          })
          .catch((e) => {
            console.log(`${t} errored with`, e);
          })
          .finally(() => {
            // this.testIsNowDone(t);
            close();
          });

        return page;
      });
  };

  receiveFeatures = (
    features: string[],
    destFolder: string,
    srcTest: string
  ) => {
    const featureDestination = path.resolve(
      process.cwd(),
      "docs",
      "features",
      "strings",
      srcTest.split(".").slice(0, -1).join(".") + ".features.txt"
    );

    features
      .reduce(async (mm, featureStringKey) => {
        const accum = await mm;

        const isUrl = isValidUrl(featureStringKey);

        if (isUrl) {
          const u = new URL(featureStringKey);

          if (u.protocol === "file:") {
            const newPath = `${process.cwd()}/docs/features/internal/${path.relative(
              process.cwd(),
              u.pathname
            )}`;

            await fs.promises.mkdir(path.dirname(newPath), { recursive: true });

            try {
              await fs.unlinkSync(newPath);
              // console.log(`Removed existing link at ${newPath}`);
            } catch (error) {
              if (error.code !== "ENOENT") {
                // throw error;
              }
            }

            fs.symlink(u.pathname, newPath, (err) => {
              if (err) {
                // console.error("Error creating symlink:", err);
              } else {
                // console.log("Symlink created successfully");
              }
            });
            accum.files.push(newPath);
          } else if (u.protocol === "http:" || u.protocol === "https:") {
            const newPath = `${process.cwd()}/docs/features/external${
              u.hostname
            }${u.pathname}`;
            const body = await this.configs.featureIngestor(featureStringKey);
            writeFileAndCreateDir(newPath, body);
            accum.files.push(newPath);
          }
        } else {
          await fs.promises.mkdir(path.dirname(featureDestination), {
            recursive: true,
          });
          // const newPath = `${process.cwd()}/docs/features/plain/${await sha256(
          //   featureStringKey
          // )}`;
          // writeFileAndCreateDir(
          //   `${featureDestination}/${await sha256(featureStringKey)}`,
          //   featureStringKey
          // );
          accum.strings.push(featureStringKey);
        }

        return accum;
      }, Promise.resolve({ files: [] as string[], strings: [] as string[] }))

      .then(({ files, strings }: { files: string[]; strings: string[] }) => {
        // writeFileAndCreateDir(`${featureDestination}`, JSON.stringify(strings));

        fs.writeFileSync(
          `${destFolder}/featurePrompt.txt`,
          files
            .map((f) => {
              return `/read ${f}`;
            })
            .join("\n")
        );
      });

    this.writeBigBoard();
  };

  receiveExitCode = (srcTest: string, failures: number) => {
    this.bigBoard[srcTest].runTimeError = failures;
    this.writeBigBoard();
  };

  writeBigBoard = () => {
    fs.writeFileSync(
      "./docs/bigBoard.json",
      JSON.stringify(this.bigBoard, null, 2)
    );

    //     fs.writeFileSync(
    //       "./docs/bigBoard.html",
    //       // JSON.stringify(this.bigBoard, null, 2)
    //       `
    // <!DOCTYPE html>
    // <html lang="en">

    // <head>
    //   <meta name="description" content="Webpage description goes here" />
    //   <meta charset="utf-8" />
    //   <title>kokomoBay - testeranto</title>
    //   <meta name="viewport" content="width=device-width, initial-scale=1" />
    //   <meta name="author" content="" />

    //   <link rel="stylesheet" href="/index.css" />
    //   <script type="module" src="/littleBoard.js"></script>

    // </head>

    // <body>
    //   <table>
    //     ${Object.keys(this.bigBoard)
    //       .map((v) => {
    //         return `<tr>
    //         <td>${v}</td>

    //         <td>${this.bigBoard[v].status}</td>
    //         <td>${this.bigBoard[v].runTimeError}</td>
    //         <td>
    //           <a href="/${this.configs.tests.find((t) => t[0] === v)[1]}/${v
    //           .split(".")
    //           .slice(0, -1)
    //           .join(".")}/littleBoard.html">more</a>
    //         </td>
    //       </tr>`;
    //       })
    //       .join("")}

    //   </table>

    // </body>

    // </html>
    //     `
    //     );
  };
}

async function writeFileAndCreateDir(filePath, data) {
  const dirPath = path.dirname(filePath);

  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
    await fs.appendFileSync(filePath, data);
  } catch (error) {
    console.error(`Error writing file: ${error}`);
  }
}

async function sha256(rawData) {
  const data =
    typeof rawData === "object" ? JSON.stringify(rawData) : String(rawData);

  const msgBuffer = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}
