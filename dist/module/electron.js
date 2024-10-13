import { app, BrowserWindow, utilityProcess } from "electron";
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
process.stdin.on("data", (configTests) => {
    main(JSON.parse(configTests.toString()));
});
// const watchables = (tests: ITestTypes[]) => {
//   return tests.map((t) => {
//     return [t[1], `dist/${t[1]}/${t[0].replace(".mts", ".mjs")}`]
//   })
// }
const main = (tests) => {
    console.log("tests", tests);
    pie.initialize(app, 2999).then(async () => {
        app.on("ready", () => {
            const win = new BrowserWindow({
                show: true,
                webPreferences: {
                    offscreen: false,
                    devTools: true,
                }
            });
            win.loadFile(process.cwd() + "/dist/report.html").then(async (x) => {
                pie.connect(app, puppeteer).then(async (browser) => {
                    console.log("pages", await browser.pages());
                    console.log("tests", tests);
                    pie.getPage(browser, win).then(async (page) => {
                        console.log("page", page);
                        await page.screenshot({
                            path: 'electron-puppeteer-screenshot.jpg'
                        });
                    });
                });
            });
            const watcher = (t) => {
                return `/${t[1]}/${t[0].split('.').slice(0, -1).concat('mjs').join('.')}`;
            };
            tests.forEach((t) => {
                const watch = process.cwd() + `/dist/${t[1]}/${t[0].split('.').slice(0, -1).concat('mjs').join('.')}`;
                console.log("watching", watch);
                if (t[1] === "node") {
                    // const watch = process.cwd() + `${t[1]}/${t[0].replace(".mts", ".mjs")}`;
                    fs.watch(watch, function (event, filename) {
                        var _a;
                        console.log('event is: ' + event, filename);
                        const child = utilityProcess.fork(watch, [
                            JSON.stringify({
                                scheduled: true,
                                name: watch,
                                ports: [],
                                fs: path.resolve(process.cwd(), "dist", 
                                // config.outdir,
                                "node", t[0]),
                            })
                        ]);
                        console.log("child", child);
                        (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (x) => {
                            console.log("x", x);
                        });
                        if (filename) {
                            console.log('filename provided: ' + filename);
                        }
                        else {
                            console.log('filename not provided');
                        }
                    });
                }
                else if (t[1] === "web") {
                    // const watch = process.cwd() + `${t[1]}/${t[0].replace(".mts", ".mjs")}`;
                    fs.watch(watch, function (event, filename) {
                        console.log('event is: ' + event);
                        const subWin = new BrowserWindow({
                            show: true,
                            webPreferences: {
                                nodeIntegration: true,
                                nodeIntegrationInWorker: true,
                                contextIsolation: false,
                                preload: path.join(app.getAppPath(), 'preload.js'),
                                offscreen: false,
                                devTools: true,
                            }
                        });
                        const htmlFile = watch.replace(".mjs", ".html");
                        subWin.loadFile(htmlFile, {
                            query: {
                                requesting: encodeURIComponent(JSON.stringify({
                                    name: watch,
                                    ports: [].toString(),
                                    fs: path.resolve(process.cwd(), "dist", 
                                    // config.outdir,
                                    "web", t[0]),
                                }))
                            }
                        })
                            .then(async (x) => {
                            // pie.connect(app, puppeteer).then(async (browser) => {
                            //   console.log("pages", await browser.pages())
                            //   console.log("tests", tests);
                            //   // pie.getPage(browser, subWin).then(async (page) => {
                            //   //   console.log("page", page);
                            //   //   await page.screenshot({
                            //   //     path: 'electron-puppeteer-screenshot.jpg'
                            //   //   });
                            //   // })
                            // })
                        });
                        if (filename) {
                            console.log('filename provided: ' + filename);
                        }
                        else {
                            console.log('filename not provided');
                        }
                    });
                }
            });
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
// console.log("mark3")
// main();
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
