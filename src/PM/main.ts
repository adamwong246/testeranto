import fs from "fs";
import path from "path";
import puppeteer, { Page, ScreenshotOptions } from "puppeteer-core";
import { PassThrough } from "stream";

import { IBuiltConfig, ITestTypes } from "../lib/types";

import { PM } from "./index.js";
import { destinationOfRuntime } from "../utils.js";
import { ITLog } from "../lib/index.js";

type IFPaths = string[];

const fPaths: IFPaths = [];
const fileStreams3: fs.WriteStream[] = [];
const files: Record<string, Set<string>> = {}; // = new Set<string>();
const screenshots: Record<string, Promise<Uint8Array>[]> = {};

export class PM_Main extends PM {
  customScreenShot(opts: object) {
    throw new Error("Method not implemented.");
  }
  configs: IBuiltConfig;
  ports: Record<number, boolean>;
  queue: any[];

  constructor(configs: IBuiltConfig) {
    super();
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

    globalThis["writeFileSync"] = (
      filepath: string,
      contents: string,
      testName: string
    ) => {
      console.log("globalThis-writeFileSync", filepath);

      // Create directories if they don't exist
      const dir = path.dirname(filepath.split("/").slice(0, -1).join("/"));

      fs.mkdirSync(dir, {
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

    globalThis["customScreenShot"] = async (
      opts: { path: string },
      page: Page
    ) => {
      // // fileStreams3[uid].write(contents);
      // // console.log("asd", opts.path.split("/").slice(0, -1).join("/"));

      // // const dir = path.dirname(opts.path.split("/").slice(0, -1).join("/"));
      // // console.log("dir", dir);
      // fs.mkdirSync(opts.path.split("/").slice(0, -1).join("/"), {
      //   recursive: true,
      // });

      // return page.screenshot(opts);

      console.log("main.ts node custom-screenshot", page);
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

    globalThis["customclose"] = (p: string, testName: string) => {
      if (!files[testName]) {
        files[testName] = new Set();
      }

      fs.writeFileSync(
        p + "/manifest.json",
        JSON.stringify(Array.from(files[testName]))
      );
      delete files[testName];
      // globalThis["writeFileSync"](
      //   p + "/manifest.json",
      //   // files.entries()
      //   JSON.stringify(Array.from(files[testName]))
      // );

      // fileStreams3[uid].end();
    };
    // page.exposeFunction("customclose", () => {
    //   console.log("closing doneFileStream2", doneFileStream2);
    //   // console.log("closing doneFileStream2", doneFileStream2);
    //   Promise.all([...doneFileStream2, ...screenshots2]).then(() => {
    //     page.close();
    //   });

    //   // page.close();
    //   // Promise.all(screenshots).then(() => {
    //   //   page.close();
    //   // });
    //   // setTimeout(() => {
    //   //   console.log("Delayed for 1 second.");
    //   //   page.close();
    //   // }, 5000);

    //   // return page.close();
    // });
  }

  async startPuppeteer(options: any, destfolder: string): Promise<any> {
    this.browser = (await puppeteer.launch(options)) as any;
    return this.browser;
  }

  launchNode = async (src: string, dest: string) => {
    console.log("launchNode", src);

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
      console.log("openPorts", openPorts);
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

    const builtfile = dest + ".mjs";

    await Promise.all(
      testConfig[3].map((sidecar) => {
        if (sidecar[1] === "web") {
          return this.launchWebSideCar(
            sidecar[0],
            destinationOfRuntime(sidecar[0], "web", this.configs),
            sidecar
          );
        }

        if (sidecar[1] === "node") {
          return this.launchNodeSideCar(
            sidecar[0],
            destinationOfRuntime(sidecar[0], "node", this.configs),
            sidecar
          );
        }
      })
    );

    this.server[builtfile] = await import(
      `${builtfile}?cacheBust=${Date.now()}`
    ).then((module) => {
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

    console.log("portsToUse", portsToUse);
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
  ) => {
    const d = dest + ".mjs";
    console.log("launchWebSideCar", src, dest, d);
    const destFolder = dest.replace(".mjs", "");
    const webArgz = JSON.stringify({
      name: dest,
      ports: [].toString(),
      fs: destFolder,
      browserWSEndpoint: this.browser.wsEndpoint(),
    });

    const evaluation = `
    console.log("importing ${dest}.mjs");
    import('${dest}.mjs').then(async (x) => {
      console.log("imported", x.default);
    })`;

    const fileStreams2: fs.WriteStream[] = [];
    const doneFileStream2: Promise<any>[] = [];

    return new Promise((res, rej) => {
      this.browser
        .newPage()
        .then((page) => {
          page.on("console", (msg) => {
            console.log("web > ", msg.args(), msg.text());
            // for (let i = 0; i < msg._args.length; ++i)
            //   console.log(`${i}: ${msg._args[i]}`);
          });

          page.exposeFunction(
            "custom-screenshot",
            async (ssOpts: ScreenshotOptions, testName: string) => {
              console.log("main.ts browser custom-screenshot", testName);
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

          page.exposeFunction(
            "write",
            async (uid: number, contents: string) => {
              return fileStreams2[uid].write(contents);
            }
          );

          page.exposeFunction("end", async (uid: number) => {
            return fileStreams2[uid].end();
          });

          page.exposeFunction("customclose", (p: string, testName: string) => {
            fs.writeFileSync(
              p + "/manifest.json",
              JSON.stringify(Array.from(files[testName]))
            );
            delete files[testName];

            Promise.all(screenshots[testName] || []).then(() => {
              delete screenshots[testName];
              page.close();
            });

            // globalThis["writeFileSync"](
            //   p + "/manifest.json",
            //   // files.entries()
            //   JSON.stringify(Array.from(files[testName]))
            // );

            // console.log("closing doneFileStream2", doneFileStream2);
            // console.log("closing doneFileStream2", doneFileStream2);
            // Promise.all([...doneFileStream2, ...screenshots2]).then(() => {
            //   page.close();
            // });

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
          page.on("console", (log) =>
            console.debug(`Log from client: [${log.text()}] `)
          );
          await page.goto(`file://${`${dest}.html`}`, {});
          res(page);

          // page.evaluate(evaluation).finally(() => {
          //   console.log("evaluation failed.", dest);
          // });

          // return page;
        });
    });
  };

  // launchNodeSideCar = async (src: string, dest: string) => {};
  launchNodeSideCar = async (
    src: string,
    dest: string,
    testConfig: ITestTypes
  ) => {
    const d = dest + ".mjs";
    console.log("launchNodeSideCar", src, dest, d);

    const destFolder = dest.replace(".mjs", "");

    let argz = "";

    // const testConfig = this.configs.tests.find((t) => {
    //   return t[0] === src;
    // });

    // if (!testConfig) {
    //   console.error("missing test config");
    //   process.exit(-1);
    // }
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
      console.log("openPorts", openPorts);
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
        console.log("defaultModule", defaultModule);
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

    console.log("portsToUse", portsToUse);
    for (let i = 0; i <= portsToUse.length; i++) {
      if (portsToUse[i]) {
        this.ports[portsToUse[i]] = "true"; //port is open again
      }
    }
  };

  launchWeb = (t: string, dest: string, sidecars: ITestTypes[]) => {
    console.log("launchWeb", t, dest);

    sidecars.map((sidecar) => {
      if (sidecar[1] === "node") {
        return this.launchNodeSideCar(
          sidecar[0],
          destinationOfRuntime(sidecar[0], "node", this.configs),
          sidecar
        );
      }
    });

    const destFolder = dest.replace(".mjs", "");

    const webArgz = JSON.stringify({
      name: dest,
      ports: [].toString(),
      fs: destFolder,
      browserWSEndpoint: this.browser.wsEndpoint(),
    });

    const evaluation = `
    console.log("importing ${dest}.mjs");
    import('${dest}.mjs').then(async (x) => {
      console.log("imported", x.default);
      try {
        await (await x.default).receiveTestResourceConfig(${webArgz})
      } catch (e) {
        console.log("fail", e)
      }
    })`;

    const fileStreams2: fs.WriteStream[] = [];
    const doneFileStream2: Promise<any>[] = [];

    this.browser
      .newPage()
      .then((page) => {
        page.on("console", (msg) => {
          console.log("web > ", msg.args(), msg.text());
          // for (let i = 0; i < msg._args.length; ++i)
          //   console.log(`${i}: ${msg._args[i]}`);
        });

        page.exposeFunction(
          "customScreenShot",
          async (ssOpts: ScreenshotOptions, testName: string) => {
            console.log("main.ts browser custom-screenshot", testName);
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

        page.exposeFunction("customclose", (p: string, testName: string) => {
          console.log("\t closing", p);

          fs.writeFileSync(
            p + "/manifest.json",
            JSON.stringify(Array.from(files[testName]))
          );
          delete files[testName];

          Promise.all(screenshots[testName] || []).then(() => {
            delete screenshots[testName];
            // page.close();
          });

          // globalThis["writeFileSync"](
          //   p + "/manifest.json",
          //   // files.entries()
          //   JSON.stringify(Array.from(files[testName]))
          // );

          // console.log("closing doneFileStream2", doneFileStream2);
          // console.log("closing doneFileStream2", doneFileStream2);
          // Promise.all([...doneFileStream2, ...screenshots2]).then(() => {
          //   page.close();
          // });

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
        page.on("console", (log) =>
          console.debug(`Log from client: [${log.text()}] `)
        );
        await page.goto(`file://${`${dest}.html`}`, {});

        page
          .evaluate(evaluation)
          .catch((e) => {
            console.log("evaluation failed.", dest);
            console.log(e);
          })
          .finally(() => {
            console.log("evaluation complete.", dest);
          });

        return page;
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
