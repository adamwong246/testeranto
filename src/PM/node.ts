// import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
// import puppeteer from "puppeteer-core/lib/esm/puppeteer/puppeteer-core";
import puppeteer from "puppeteer-core";

// import { Browser } from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser";
import { Browser } from "puppeteer-core";
import { PassThrough } from "stream";
import { ITLog, ITTestResourceConfiguration } from "../lib";
import { PM } from "./index.js";
import { PuppeteerLaunchOptions } from "puppeteer-core/lib/esm/puppeteer";

type IFPaths = string[];
const fPaths: IFPaths = [];

type PuppetMasterServer = Record<string, Promise<any>>;

export function addPageBinding(
  type: string,
  name: string,
  prefix: string
): void {
  // Depending on the frame loading state either Runtime.evaluate or
  // Page.addScriptToEvaluateOnNewDocument might succeed. Let's check that we
  // don't re-wrap Puppeteer's binding.
  if (globalThis[name]) {
    return;
  }

  // We replace the CDP binding with a Puppeteer binding.
  Object.assign(globalThis, {
    [name](...args: unknown[]): Promise<unknown> {
      // This is the Puppeteer binding.
      const callPuppeteer = globalThis[name];
      callPuppeteer.args ??= new Map();
      callPuppeteer.callbacks ??= new Map();

      const seq = (callPuppeteer.lastSeq ?? 0) + 1;
      callPuppeteer.lastSeq = seq;
      callPuppeteer.args.set(seq, args);

      // Needs to be the same as CDP_BINDING_PREFIX.
      globalThis[prefix + name](
        JSON.stringify({
          type,
          name,
          seq,
          args,
          isTrivial: !args.some((value) => {
            return value instanceof Node;
          }),
        })
      );

      return new Promise((resolve, reject) => {
        callPuppeteer.callbacks.set(seq, {
          resolve(value: unknown) {
            callPuppeteer.args.delete(seq);
            resolve(value);
          },
          reject(value?: unknown) {
            callPuppeteer.args.delete(seq);
            reject(value);
          },
        });
      });
    },
  });
}

export class PM_Node extends PM {
  server: PuppetMasterServer;
  testResourceConfiguration: ITTestResourceConfiguration;

  constructor(t: ITTestResourceConfiguration) {
    super();
    this.server = {};
    this.testResourceConfiguration = t;
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

  writeFileSync(fp: string, contents: string) {
    return globalThis["writeFileSync"](
      this.testResourceConfiguration.fs + "/" + fp,
      contents
    );
  }

  createWriteStream(filepath: string): any {
    return globalThis["createWriteStream"](
      this.testResourceConfiguration.fs + "/" + filepath
    );
  }

  end(writeObject: { uid: number }) {
    return globalThis["end"](writeObject.uid);
  }
  // write(accessObject: { uid: number; }, contents: string): boolean {
  //   throw new Error("Method not implemented.");
  // }
  // existsSync(destFolder: string): boolean {
  //   return fs.existsSync(destFolder);
  // }

  // async mkdirSync(destFolder: string) {
  //   if (!fs.existsSync(destFolder)) {
  //     return fs.mkdirSync(destFolder, { recursive: true });
  //   }
  //   return false;
  // }

  // writeFileSync(fp: string, contents: string) {
  //   fs.writeFileSync(fp, contents);
  // }

  // createWriteStream(filepath: string): fs.WriteStream {
  //   return fs.createWriteStream(filepath);
  // }

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
  startPuppeteer(options?: any): Promise<any> {
    console.log("start1");
    return puppeteer.connect(options).then((b) => {
      this.browser = b;
    });
    // return new Promise<Browser>((res, rej) => {
    //   // this.browser = await puppeteer.connect(options);
    //   // console.log("start2", this.browser);
    //   // console.log("mark5", this.browser);
    //   // res(this.browser);
    // });
  }

  // launchNode = (src: string, dest: string) => {
  //   console.log("launchNode", src);
  //   // childProcesses[src] = "running";
  //   const destFolder = dest.replace(".mjs", "");

  //   const argz = JSON.stringify({
  //     scheduled: true,
  //     name: src,
  //     ports: [3333],
  //     // fs: path.resolve(configs.buildDir, "web", destFolder + "/"),
  //     // fs: destFolder,
  //     fs: ".",
  //   });

  //   const builtfile = dest + ".mjs";
  //   console.log("importing and running ", builtfile);
  //   // import(builtfile).then(async (v) => {
  //   //   console.log("v", (await v.default).receiveTestResourceConfig(argz));
  //   // });

  //   // console.log("launchNode", src, dest, " -> ", destFolder, argz);

  //   // const child = utilityProcess.fork(dest + ".mjs", [argz], {
  //   //   cwd: destFolder,
  //   //   stdio: "pipe",
  //   // });
  //   // const nodeGuid = uuidv4();
  //   // nodeChildren[nodeGuid] = child;

  //   // if (!fs.existsSync(destFolder)) {
  //   //   fs.mkdirSync(destFolder, { recursive: true });
  //   // }

  //   // fs.rmSync(`${destFolder}/stdout.log`, { force: true });
  //   // fs.rmSync(`${destFolder}/stderr.log`, { force: true });
  //   // const stdout = fs.createWriteStream(`${destFolder}/stdout.log`);
  //   // const stderr = fs.createWriteStream(`${destFolder}/stderr.log`);

  //   // child
  //   //   .on("message", (data) => {
  //   //     console.log("from child", JSON.stringify(data));
  //   //     if (data.launchWeb) {
  //   //       const guid = uuidv4();
  //   //       const webChild = launchWebSecondary(process.cwd() + data.launchWeb);
  //   //       // child.postMessage({ webLaunched: guid });

  //   //       webChild.webContents.on("did-finish-load", () => {
  //   //         // webChild.webContents.send("message", "hello world");
  //   //         child.postMessage({ webLaunched: guid });
  //   //         webChildren[guid] = webChild;
  //   //         node2web[nodeGuid] = [...(node2web[nodeGuid] || []), guid];
  //   //       });
  //   //     }
  //   //     if (data.teardown) {
  //   //       webChildren[data.teardown].close();
  //   //       delete webChildren[data.teardown];
  //   //       node2web[nodeGuid] = node2web[nodeGuid].filter(
  //   //         (x) => x !== data.teardown
  //   //       );
  //   //     }
  //   //   })
  //   //   .on("exit", (data) => {
  //   //     stdout.close();
  //   //     stderr.close();
  //   //     console.log(`ending node ${src}`);
  //   //     onDone(src);
  //   //   });

  //   // child.stdout?.pipe(stdout);
  //   // child.stderr?.pipe(stderr);
  // };

  // const launchWebSecondary = (htmlFile: string): BrowserWindow => {
  //   console.log("launchWebSecondary", htmlFile);
  //   const subWin = new BrowserWindow({
  //     show: false,

  //     webPreferences: {
  //       nodeIntegration: true,
  //       nodeIntegrationInWorker: true,
  //       contextIsolation: false,
  //       preload: path.join(app.getAppPath(), "preload.js"),
  //       offscreen: false,
  //       devTools: true,
  //     },
  //   });
  //   remoteMain.enable(subWin.webContents);
  //   subWin.webContents.openDevTools();
  //   subWin.loadFile(htmlFile);
  //   return subWin;

  //   // const uuid = uuidv4();
  //   // windows[uuid] = subWin;
  //   // return uuid;
  // };

  // const launchWeb = (t: string, dest: string) => {
  //   console.log("launchWeb", t);
  //   childProcesses[t] = "running";
  //   const destFolder = dest.replace(".mjs", "");

  //   const subWin = new BrowserWindow({
  //     show: true,
  //     webPreferences: {
  //       nodeIntegration: true,
  //       nodeIntegrationInWorker: true,
  //       contextIsolation: false,
  //       preload: path.join(app.getAppPath(), "preload.js"),
  //       offscreen: false,
  //       devTools: true,
  //     },
  //   });

  //   webChildren[uuidv4()] = subWin;

  //   remoteMain.enable(subWin.webContents);

  //   const webArgz = JSON.stringify({
  //     name: dest,
  //     ports: [].toString(),
  //     fs: destFolder,
  //   });

  //   // console.log("webArgz", webArgz);
  //   subWin.loadFile(`${dest}.html`, {
  //     query: {
  //       requesting: encodeURIComponent(webArgz),
  //     },
  //   });

  //   if (!fs.existsSync(destFolder)) {
  //     fs.mkdirSync(destFolder, { recursive: true });
  //   }
  //   const stdout = fs.createWriteStream(`${destFolder}/stdout.log`);

  //   subWin.webContents.on(
  //     "console-message",
  //     (event, level, message, line, sourceId) => {
  //       stdout.write(
  //         JSON.stringify(
  //           {
  //             event,
  //             level,
  //             message: JSON.stringify(message),
  //             line,
  //             sourceId,
  //           },
  //           null,
  //           2
  //         )
  //       );
  //       stdout.write("\n");
  //     }
  //   );
  //   subWin.on("closed", () => {
  //     stdout.close();
  //     console.log(`ending web ${t}`);
  //     // childProcesses[t] = "done";
  //     onDone(t);
  //   });
  //   ipcMain.on("message", (message, data) => {
  //     console.log("ipcMain message: " + JSON.stringify(data));
  //     // process.exit();
  //   });
  // };

  // return await import("${dest}.mjs");

  // launchWeb = (t: string, dest: string) => {
  //   console.log("launchWeb", t);
  //   // // childProcesses[t] = "running";
  //   // const destFolder = dest.replace(".mjs", "");

  //   // const webArgz = JSON.stringify({
  //   //   name: dest,
  //   //   ports: [].toString(),
  //   //   fs: destFolder,
  //   // });

  //   // const evaluation = `import('file:///Users/adam/Code/kokomoBay/docs/web/src/LoginPage/react/web.test.mjs').then(async (x) => {
  //   //   return (await x.default).receiveTestResourceConfig(${webArgz})
  //   // })`;

  //   // // console.log("evaluation", evaluation);

  //   // const y = browser
  //   //   .newPage()
  //   //   .then(async (page) => {
  //   //     // const codeString = "1 + 1";
  //   //     await page.goto(
  //   //       // "file:///Users/adam/Code/kokomoBay/docs/web/src/LoginPage/react/web.test.html"
  //   //       `file://${`${dest}.html`}`
  //   //     );
  //   //     //         page.url
  //   //     //         page.setContent(`

  //   //     // <!DOCTYPE html>
  //   //     // <html lang="en">

  //   //     // <head>

  //   //     // </head>

  //   //     // <body>
  //   //     //   <h1>/Users/adam/Code/kokomoBay/docs/web/src/LoginPage/react/web.test.html</h1>
  //   //     //   <div id="root">

  //   //     //   </div>
  //   //     // </body>

  //   //     // <footer></footer>

  //   //     // </html>
  //   //     // `);
  //   //     // return await page.evaluate((code) => eval(code), evaluation);

  //   //     return await page.evaluate(evaluation);
  //   //     // return await page.evaluate(async () => {
  //   //     //   return await import(dest);
  //   //     // });
  //   //   })
  //   //   .then((x) => {
  //   //     console.log("mark1", x);
  //   //   });
  //   // .then((x) => {
  //   //   console.log("mark0", x);
  //   // })
  //   // .catch((z) => {
  //   //   console.log("mark2", z);
  //   // });

  //   //   const subWin = new BrowserWindow({
  //   //     show: true,
  //   //     webPreferences: {
  //   //       nodeIntegration: true,
  //   //       nodeIntegrationInWorker: true,
  //   //       contextIsolation: false,
  //   //       preload: path.join(app.getAppPath(), "preload.js"),
  //   //       offscreen: false,
  //   //       devTools: true,
  //   //     },
  //   //   });

  //   //   webChildren[uuidv4()] = subWin;

  //   //   remoteMain.enable(subWin.webContents);

  //   //   // console.log("webArgz", webArgz);
  //   //   subWin.loadFile(`${dest}.html`, {
  //   //     query: {
  //   //       requesting: encodeURIComponent(webArgz),
  //   //     },
  //   //   });

  //   //   if (!fs.existsSync(destFolder)) {
  //   //     fs.mkdirSync(destFolder, { recursive: true });
  //   //   }
  //   //   const stdout = fs.createWriteStream(`${destFolder}/stdout.log`);

  //   //   subWin.webContents.on(
  //   //     "console-message",
  //   //     (event, level, message, line, sourceId) => {
  //   //       stdout.write(
  //   //         JSON.stringify(
  //   //           {
  //   //             event,
  //   //             level,
  //   //             message: JSON.stringify(message),
  //   //             line,
  //   //             sourceId,
  //   //           },
  //   //           null,
  //   //           2
  //   //         )
  //   //       );
  //   //       stdout.write("\n");
  //   //     }
  //   //   );
  //   //   subWin.on("closed", () => {
  //   //     stdout.close();
  //   //     console.log(`ending web ${t}`);
  //   //     // childProcesses[t] = "done";
  //   //     onDone(t);
  //   //   });
  //   //   ipcMain.on("message", (message, data) => {
  //   //     console.log("ipcMain message: " + JSON.stringify(data));
  //   //     // process.exit();
  //   //   });
  // };
}

// class PuppetMasterServer extends AbstractPuppetMaster {
//   // constructor(...z: []) {
//   //   super(...z);
//   // }
//   // // pages(): Promise<Page[]>;
//   // pages(): Promise<Page[]> {
//   //   return new Promise<Page[]>((res, rej) => {
//   //     res(super.pages());
//   //   });
//   // }
// }
