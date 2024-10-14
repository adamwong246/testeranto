"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// const electron = require('electron')
// const path = require('path')
// const BrowserWindow = electron.remote.BrowserWindow
const puppeteer_in_electron_1 = __importDefault(require("puppeteer-in-electron"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const remoteMain = require("@electron/remote/main");
/* add this before the enable function */
remoteMain.initialize();
const watcher = (t) => {
    // return `/${t[1]}/${t[0].split('.').slice(0, -1).concat('mjs').join('.')}`;
    return path_1.default.normalize(process.cwd() + `/dist/${t[1]}/${t[0].split('.').slice(0, -1).concat('mjs').join('.')}`);
};
const changer = (f) => {
    // return `/${t[1]}/${t[0].split('.').slice(0, -1).concat('mjs').join('.')}`;
    return path_1.default.normalize(process.cwd() + `/dist/${f}`);
};
const launchNode = (t, changedFile) => {
    var _a;
    console.log("launchNode", changedFile);
    const child = electron_1.utilityProcess.fork(changedFile, [
        JSON.stringify({
            scheduled: true,
            name: changedFile,
            ports: [],
            fs: path_1.default.resolve(process.cwd(), "dist", 
            // config.outdir,
            "node", t[0]),
        })
    ]);
    console.log("child", child);
    (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (x) => {
        console.log("x", x);
    });
};
const launchWeb = (t, changedFile) => {
    console.log("launchWeb", changedFile);
    const subWin = new electron_1.BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            preload: path_1.default.join(electron_1.app.getAppPath(), 'preload.js'),
            offscreen: false,
            devTools: true,
        }
    });
    remoteMain.enable(subWin.webContents);
    subWin.webContents.openDevTools();
    // subWin.on("close")
    const htmlFile = changedFile.replace(".mjs", ".html");
    subWin.loadFile(htmlFile, {
        query: {
            requesting: encodeURIComponent(JSON.stringify({
                name: changedFile,
                ports: [].toString(),
                fs: path_1.default.resolve(process.cwd(), "dist", 
                // config.outdir,
                "web", t[0]),
            }))
        }
    });
};
const main = async () => {
    const configs = JSON.parse((await fs_1.default.readFileSync("./testeranto.json")).toString());
    puppeteer_in_electron_1.default.initialize(electron_1.app, 2999).then(async () => {
        electron_1.app.on("ready", () => {
            const win = new electron_1.BrowserWindow({
                show: true,
                webPreferences: {
                    offscreen: false,
                    devTools: true,
                }
            });
            win.loadFile(process.cwd() + "/dist/report.html").then(async (x) => {
                puppeteer_in_electron_1.default.connect(electron_1.app, puppeteer_core_1.default).then(async (browser) => {
                    console.log("pages", await browser.pages());
                    console.log("configs", configs);
                    puppeteer_in_electron_1.default.getPage(browser, win).then(async (page) => {
                        console.log("page", page);
                        await page.screenshot({
                            path: 'electron-puppeteer-screenshot.jpg'
                        });
                    });
                });
            });
            fs_1.default.watch(configs.outdir, {
                recursive: true,
            }, (eventType, changedFile) => {
                if (changedFile) {
                    configs.tests.forEach((t) => {
                        if (watcher(t) === changer(changedFile)) {
                            if (t[1] === "node") {
                                launchNode(t, changer(changedFile));
                            }
                            else {
                                launchWeb(t, changer(changedFile));
                            }
                        }
                    });
                }
            });
            // configs.tests.forEach((t) => {
            //   const watch = process.cwd() + `/dist/${t[1]}/${t[0].split('.').slice(0, -1).concat('mjs').join('.')}`;
            //   console.log("watching", watch);
            //   if (t[1] === "node") {
            //     // const watch = process.cwd() + `${t[1]}/${t[0].replace(".mts", ".mjs")}`;
            //     fs.watch(watch, { persistent: true }, function (event, filename) {
            //       console.log('event is: ' + event, filename);
            //       if (filename) {
            //         console.log('filename provided: ' + filename);
            //       } else {
            //         console.log('filename not provided');
            //       }
            //     });
            //   } else if (t[1] === "web") {
            //     // const watch = process.cwd() + `${t[1]}/${t[0].replace(".mts", ".mjs")}`;
            //     fs.watch(watch, { persistent: true }, function (event, filename) {
            //       console.log('event is: ' + event);
            //         .then(async (x) => {
            //           // pie.connect(app, puppeteer).then(async (browser) => {
            //           //   console.log("pages", await browser.pages())
            //           //   console.log("tests", tests);
            //           //   // pie.getPage(browser, subWin).then(async (page) => {
            //           //   //   console.log("page", page);
            //           //   //   await page.screenshot({
            //           //   //     path: 'electron-puppeteer-screenshot.jpg'
            //           //   //   });
            //           //   // })
            //           // })
            //         })
            //       if (filename) {
            //         console.log('filename provided: ' + filename);
            //       } else {
            //         console.log('filename not provided');
            //       }
            //     });
            //   }
            // })
        });
    });
    // const browser = await pie.connect(app, puppeteer);
    // win.webContents.openDevTools()
    // const url = "https://www.google.com/";
    // await win.loadURL(url);
    // console.log("pie", pie);
    // console.log("win", win);
    // const browser = await pie.connect(app, puppeteer);
    // console.log(await browser.pages());
    // const page = await pie.getPage(browser, win);
    // console.log(page.url());
    // window.destroy();
};
main();
// export { };
// process.stdin.re
// const window = new BrowserWindow();
// const url = "https://example.com/";
// await window.loadURL(url);
// const page = await pie.getPage(browser, window);
// console.log(page.url());
// window.destroy();
// let win: BrowserWindow;
// pie.initialize(app).then(async () => {
//   const browser = await pie.connect(app, puppeteer)
//   console.log("pie", pie);
//   pie.getPage(browser, win).then(async (page) => {
//     console.log("page", page);
//     await page.screenshot({
//       path: 'electron-puppeteer-screenshot.jpg'
//     });
//   })
// })
// function createWindow() {
//   // const browser = await pie.connect(app, puppeteer);
//   win = new BrowserWindow({
//     show: true,
//     webPreferences: {
//       // offscreen: true,
//       devTools: true,
//       nodeIntegration: true,
//       nodeIntegrationInWorker: true,
//       contextIsolation: false,
//       preload: path.join(app.getAppPath(), 'preload.js'),
//       sandbox: false
//     },
//     width: 800,
//     height: 600,
//   });
//   const u = url.format({
//     pathname: path.join(process.cwd(), process.argv[2]),
//     protocol: "file:",
//     slashes: true,
//     query: {
//       requesting: encodeURIComponent(process.argv[3]),
//     }
//   });
//   console.log("loading", u);
//   win.loadURL(u);
//   // debugger
//   win.webContents.openDevTools()
//   // const page = await pie.getPage(browser, window);
//   // console.log(page.url());
//   // window.destroy();
// }
// ipcMain.handle('web-log', (x, message: string) => {
//   console.log("web-log)", message);
// });
// ipcMain.handle('web-error', (x, message: string) => {
//   console.log("web-error)", message);
// });
// ipcMain.handle('web-warn', (x, message: string) => {
//   console.log("web-warn)", message);
// });
// ipcMain.handle('web-info', (x, message: string) => {
//   console.log("web-info)", message);
// });
// ipcMain.handle('quit-app', (x, failed: number) => {
//   console.log("quit-app", failed);
//   app.exit(failed);
// });
// process.stdin.on("data", (configTests) => {
//   main(JSON.parse(configTests.toString()) as ITestTypes[]);
// });
// const watchables = (tests: ITestTypes[]) => {
//   return tests.map((t) => {
//     return [t[1], `dist/${t[1]}/${t[0].replace(".mts", ".mjs")}`]
//   })
// }
