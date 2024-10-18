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
process.on("message", function (message) {
    console.log('message: ' + message);
    process.exit();
});
const remoteMain = require("@electron/remote/main");
remoteMain.initialize();
const main = async () => {
    const configs = jsonc_1.jsonc.parse((await fs_1.default.readFileSync("./docs/testeranto.json")).toString());
    const loadReport = (configs) => {
        const win = new electron_1.BrowserWindow({
            show: true,
            webPreferences: {
                offscreen: false,
                devTools: true,
            }
        });
        win.loadFile(`/${configs.buildDir}/report.html`).then(async (x) => {
            // pie.connect(app, puppeteer).then(async (browser) => {
            //   pie.getPage(browser, win).then(async (page) => {
            //     await page.screenshot({
            //       path: 'electron-puppeteer-screenshot1.jpg'
            //     });
            //   })
            // })
        });
    };
    // const launchNode = (t: string, x: string) => {
    const launchNode = (src, dest) => {
        var _a, _b;
        const destFolder = dest.replace(".mjs", "");
        const argz = JSON.stringify({
            scheduled: true,
            name: src,
            ports: [],
            fs: path_1.default.resolve(configs.buildDir, "node", destFolder),
        });
        console.log("launchNode", src, dest, " -> ", destFolder, argz);
        const child = electron_1.utilityProcess.fork(dest, [argz], { stdio: 'pipe' });
        if (!fs_1.default.existsSync(destFolder)) {
            fs_1.default.mkdirSync(destFolder, { recursive: true });
        }
        const stdout = fs_1.default.createWriteStream(`${destFolder}/stdout.log`);
        const stderr = fs_1.default.createWriteStream(`${destFolder}/stderr.log`);
        child.on('message', (data) => {
            console.log("from child", data);
            launchWebSecondary(process.cwd() + data);
        }).on('exit', (data) => {
            fs_1.default.writeFileSync(`${destFolder}/stdout.log`, data.toString());
            stdout.close();
            stderr.close();
        });
        (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.pipe(stdout);
        (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.pipe(stderr);
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
    const launchWeb = (t, dest) => {
        console.log("launchWeb", t, dest);
        const destFolder = dest.replace(".mjs", "");
        const subWin = new electron_1.BrowserWindow({
            show: true,
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
        // subWin.webContents.openDevTools()
        const htmlFile = dest.split(".").slice(0, -1).concat("html").join(".");
        subWin.loadFile(htmlFile, {
            query: {
                requesting: encodeURIComponent(JSON.stringify({
                    name: dest,
                    ports: [].toString(),
                    fs: path_1.default.resolve(configs.buildDir, "web", destFolder),
                }))
            }
        });
        // subWin.webContents.
        // const child = utilityProcess.fork(dest, [argz], { stdio: 'pipe' });
        if (!fs_1.default.existsSync(destFolder)) {
            fs_1.default.mkdirSync(destFolder, { recursive: true });
        }
        const stdout = fs_1.default.createWriteStream(`${destFolder}/stdout.log`);
        // const stderr = fs.createWriteStream(`${destFolder}/stderr.log`);
        subWin.webContents.on('console-message', (event, level, message, line, sourceId) => {
            stdout.write(JSON.stringify({
                event,
                level,
                message: JSON.stringify(message),
                line,
                sourceId
            }, null, 2));
            stdout.write('\n');
        });
        subWin.on('closed', () => {
            console.log(' ---- Bye Bye Electron ---- ');
            stdout.close();
        });
        // child.on('message', (data) => {
        //   console.log("from child", data);
        //   launchWebSecondary(process.cwd() + data);
        // }).on('exit', (data) => {
        //   fs.writeFileSync(`${destFolder}/stdout.log`, data.toString());
        //   stdout.close();
        //   stderr.close();
        // })
        // child.stdout?.pipe(stdout);
        // child.stderr?.pipe(stderr);
    };
    const watcher = (test, runtime) => {
        return path_1.default.normalize(`${configs.buildDir}/${runtime}/${test.split('.').slice(0, -1).concat('mjs').join('.')}`);
    };
    const changer = (f) => {
        return path_1.default.normalize(`${configs.buildDir}/${f}`);
    };
    const changer2 = (f, r) => {
        return path_1.default.normalize(`${configs.buildDir}/${r}/${f}`).replace(".ts", ".mjs");
    };
    puppeteer_in_electron_1.default.initialize(electron_1.app, 2999).then(async () => {
        electron_1.app.on("ready", () => {
            loadReport(configs);
            console.log("running all the tests once initially");
            ;
            configs.modules.forEach((t) => {
                if (t.runtime === "node") {
                    launchNode(t.test, changer2(t.test, "node"));
                }
                else if (t.runtime === "web") {
                    launchWeb(t.test, changer2(t.test, "web"));
                }
                else {
                    console.error("runtime makes no sense", t.runtime);
                }
            });
            console.log("ready and watching for changes...", configs.buildDir);
            fs_1.default.watch(configs.buildDir, {
                recursive: true,
            }, (eventType, changedFile) => {
                console.log(eventType, changedFile);
                if (changedFile) {
                    configs.modules.forEach((t) => {
                        if (watcher(t.test, t.runtime) === changer(changedFile)) {
                            if (t.runtime === "node") {
                                launchNode(t.test, changer(changedFile));
                            }
                            else if (t.runtime === "web") {
                                launchWeb(t.test, changer(changedFile));
                            }
                            else {
                                console.error("runtime makes no sense", t.runtime);
                            }
                        }
                    });
                }
            });
        });
    });
    await puppeteer_in_electron_1.default.connect(electron_1.app, puppeteer_core_1.default);
};
main();
