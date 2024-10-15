"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const puppeteer_in_electron_1 = __importDefault(require("puppeteer-in-electron"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jsonc_1 = require("jsonc");
const remoteMain = require("@electron/remote/main");
remoteMain.initialize();
const main = async () => {
    const configs = jsonc_1.jsonc.parse((await fs_1.default.readFileSync("./testeranto.json")).toString());
    const loadReport = (configs) => {
        const win = new electron_1.BrowserWindow({
            show: true,
            webPreferences: {
                offscreen: false,
                devTools: true,
            }
        });
        win.loadFile(process.cwd() + `/${configs.outdir}/report.html`).then(async (x) => {
            // pie.connect(app, puppeteer).then(async (browser) => {
            //   pie.getPage(browser, win).then(async (page) => {
            //     await page.screenshot({
            //       path: 'electron-puppeteer-screenshot1.jpg'
            //     });
            //   })
            // })
        });
    };
    const launchNode = (t, changedFile) => {
        var _a;
        const a = JSON.stringify({
            scheduled: true,
            name: changedFile,
            ports: [],
            fs: path_1.default.resolve(process.cwd(), configs.outdir, "node", t[0]),
        });
        console.log("launchNode", changedFile, a);
        const child = electron_1.utilityProcess.fork(changedFile, [a], {});
        child.postMessage({ message: 'hello' });
        child.on('message', (data) => {
            console.log("from child", data); // hello world!
            launchWebSecondary(process.cwd() + data);
        });
        child.on('exit', (data) => {
            console.log("exit from child", data);
            fileStream.close();
        });
        // child.stdout
        // child..on("", (data) => {
        //   console.log("from child", data) // hello world!
        //   launchWebSecondary(process.cwd() + data);
        // })
        // Create a write stream for the file
        const fileStream = fs_1.default.createWriteStream('errors.txt');
        // Pipe the child process's stdout to the file
        (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.pipe(fileStream);
        // // Handle errors
        // child.on('error', (err) => {
        //   console.error('Error spawning child process:', err);
        // });
        // fileStream.on('error', (err) => {
        //   console.error('Error writing to file:', err);
        // });
        // // Log a message when the child process exits
        // child.on('close', (code) => {
        //   console.log(`Child process exited with code ${code}`);
        // });
        // console.log("child", child);
        // child.stdout?.on("data", (x) => {
        //   console.log("x", x)
        // })
    };
    const launchWebSecondary = (htmlFile) => {
        console.log("launchWebSecondary", htmlFile);
        const subWin = new electron_1.BrowserWindow({
            show: true,
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
                contextIsolation: false,
                preload: path_1.default.join(electron_1.app.getAppPath(), 'preload.js'),
                offscreen: false,
                devTools: false,
            }
        });
        remoteMain.enable(subWin.webContents);
        subWin.webContents.openDevTools();
        subWin.loadFile(htmlFile);
    };
    const launchWeb = (t, changedFile) => {
        console.log("launchWeb", changedFile);
        const subWin = new electron_1.BrowserWindow({
            show: true,
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
                contextIsolation: false,
                preload: path_1.default.join(electron_1.app.getAppPath(), 'preload.js'),
                offscreen: false,
                devTools: false,
            }
        });
        remoteMain.enable(subWin.webContents);
        // subWin.webContents.openDevTools()
        const htmlFile = changedFile.replace(".mjs", ".html");
        subWin.loadFile(htmlFile, {
            query: {
                requesting: encodeURIComponent(JSON.stringify({
                    name: changedFile,
                    ports: [].toString(),
                    fs: path_1.default.resolve(process.cwd(), configs.outdir, "web", t[0]),
                }))
            }
        });
    };
    const watcher = (t) => {
        return path_1.default.normalize(process.cwd() +
            `/${configs.outdir}/${t[1]}/${t[0].split('.').slice(0, -1).concat('mjs').join('.')}`);
    };
    const changer = (f) => {
        return path_1.default.normalize(process.cwd() + `/${configs.outdir}/${f}`);
    };
    puppeteer_in_electron_1.default.initialize(electron_1.app, 2999).then(async () => {
        electron_1.app.on("ready", () => {
            loadReport(configs);
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
        });
    });
    const browser = await puppeteer_in_electron_1.default.connect(electron_1.app, puppeteer_core_1.default);
};
main();
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
