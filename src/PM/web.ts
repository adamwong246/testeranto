import { PassThrough } from "stream";
import { ITLog, ITTestResourceConfiguration } from "../lib";
import { PM } from "./index.js";
import puppeteer from "puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js";

// type IFPaths = string[];
// const fPaths: IFPaths = [];

type PuppetMasterServer = Record<string, Promise<any>>;

export class PM_Web extends PM {
  server: PuppetMasterServer;
  // testResourceConfiguration: ITTestResourceConfiguration;

  constructor(t: ITTestResourceConfiguration) {
    super();
    this.server = {};
    this.testResourceConfiguration = t;
  }

  existsSync(destFolder: string): boolean {
    return window["existsSync"](destFolder);
  }

  mkdirSync() {
    return window["mkdirSync"](this.testResourceConfiguration.fs + "/");
  }

  write(writeObject: { uid: number }, contents: string) {
    return window["write"](writeObject.uid, contents);
  }

  writeFileSync(fp: string, contents: string) {
    console.log("WEB writeFileSync", fp);
    return window["writeFileSync"](
      this.testResourceConfiguration.fs + "/" + fp,
      contents
    );
  }

  createWriteStream(filepath: string): any {
    return window["createWriteStream"](
      this.testResourceConfiguration.fs + "/" + filepath
    );
  }

  end(writeObject: { uid: number }) {
    return window["end"](writeObject.uid);
  }

  customclose() {
    return window["customclose"]();
  }

  testArtiFactoryfileWriter(tLog: ITLog, callback: (Promise) => void) {
    return (fPath, value: string | Buffer | PassThrough) => {
      callback(
        new Promise<void>((res, rej) => {
          tLog("testArtiFactory =>", fPath);

          // const cleanPath = path.resolve(fPath);
          // fPaths.push(cleanPath.replace(process.cwd(), ``));

          // const targetDir = cleanPath.split("/").slice(0, -1).join("/");

          // fs.mkdir(targetDir, { recursive: true }, async (error) => {
          //   if (error) {
          //     console.error(`❗️testArtiFactory failed`, targetDir, error);
          //   }

          //   fs.writeFileSync(
          //     path.resolve(
          //       targetDir.split("/").slice(0, -1).join("/"),
          //       "manifest"
          //     ),
          //     fPaths.join(`\n`),
          //     {
          //       encoding: "utf-8",
          //     }
          //   );

          //   if (Buffer.isBuffer(value)) {
          //     fs.writeFileSync(fPath, value, "binary");
          //     res();
          //   } else if (`string` === typeof value) {
          //     fs.writeFileSync(fPath, value.toString(), {
          //       encoding: "utf-8",
          //     });
          //     res();
          //   } else {
          //     /* @ts-ignore:next-line */
          //     const pipeStream: PassThrough = value;
          //     const myFile = fs.createWriteStream(fPath);
          //     pipeStream.pipe(myFile);
          //     pipeStream.on("close", () => {
          //       myFile.close();
          //       res();
          //     });
          //   }
          // });
        })
      );
    };
  }

  // launch(options?: PuppeteerLaunchOptions): Promise<Browser>;
  startPuppeteer(options, destFolder: string): Promise<any> {
    return fetch(`http://localhost:3234/json/version`)
      .then((v) => {
        return v.json();
      })
      .then((json) => {
        console.log("found endpoint", json.webSocketDebuggerUrl);
        return puppeteer
          .connect(
            {
              browserWSEndpoint: json.webSocketDebuggerUrl,
            }
            // options
            // { browserWSEndpoint: "ws://localhost:3234/devtools/browser/RANDOM" }
          )
          .then((b) => {
            this.browser = b;
            const handler2 = {
              get(target, prop, receiver) {
                if (prop === "screenshot") {
                  console.log("foobar1");
                  return (x) => {
                    console.log("WEB custom-screenshot", x);
                    window["custom-screenshot"]({
                      ...x,
                      path: destFolder + "/" + x.path,
                    });
                  };
                } else if (prop === "mainFrame") {
                  return () => target[prop](...arguments);
                } else {
                  return Reflect.get(...arguments);
                }
              },
            };
            console.log("foobar2");
            const handler1 = {
              get(target, prop, receiver) {
                if (prop === "pages") {
                  console.log("foobar1");
                  return async () => {
                    return target.pages().then((pages) => {
                      return pages.map((p) => {
                        return new Proxy(p, handler2);
                      });
                    });
                    // return (await target.pages()).map((page) => {
                    //   return new Proxy(page, handler2);
                    // });
                  };
                }

                return Reflect.get(...arguments);
              },
            };

            console.log("this.browser", this.browser);
            // console.log("this.browser.pages", this.browser.pages);
            const proxy3 = new Proxy(this.browser, handler1);
            this.browser = proxy3;
            // console.log("this.browser.pages2", this.browser.pages);
          });
      });
    // console.log("connecting to ws://localhost:3234/devtools/browser/RANDOM");

    // return puppeteer
    //   .connect({
    //     ...options,
    //   })
    //   .finally(() => {
    //     console.log("idk");
    //   });
    // return new Promise<Browser>(async (res, rej) => {
    //   console.log("connecting with options", options);
    //   this.browser = await puppeteer.connect({
    //     ...options,
    //   });
    //   res(this.browser);
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
  //   console.log("launchWeb", t, dest);
  //   // childProcesses[t] = "running";
  //   const destFolder = dest.replace(".mjs", "");

  //   const webArgz = JSON.stringify({
  //     name: dest,
  //     ports: [].toString(),
  //     fs: destFolder,
  //   });

  //   const evaluation = `import('${dest}.mjs').then(async (x) => {
  //     console.log(x);
  //   })`;

  //   // console.log("evaluation", evaluation);

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
