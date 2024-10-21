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
const uuid_1 = require("uuid");
const nodeChildren = {};
const webChildren = {};
const node2web = {};
const web2node = {};
process.on("message", function (message) {
    console.log("message: " + message);
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
            },
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
    const launchNode = (src, dest) => {
        var _a, _b;
        console.log("launchNode", src);
        const destFolder = dest.replace(".mjs", "");
        const argz = JSON.stringify({
            scheduled: true,
            name: src,
            ports: [3333],
            // fs: path.resolve(configs.buildDir, "web", destFolder + "/"),
            // fs: destFolder,
            fs: ".",
        });
        // console.log("launchNode", src, dest, " -> ", destFolder, argz);
        const child = electron_1.utilityProcess.fork(dest + ".mjs", [argz], {
            cwd: destFolder,
            stdio: "pipe",
        });
        const nodeGuid = (0, uuid_1.v4)();
        nodeChildren[nodeGuid] = child;
        if (!fs_1.default.existsSync(destFolder)) {
            fs_1.default.mkdirSync(destFolder, { recursive: true });
        }
        const stdout = fs_1.default.createWriteStream(`${destFolder}/stdout.log`);
        const stderr = fs_1.default.createWriteStream(`${destFolder}/stderr.log`);
        child
            .on("message", (data) => {
            console.log("from child", JSON.stringify(data));
            if (data.launchWeb) {
                const guid = (0, uuid_1.v4)();
                const webChild = launchWebSecondary(process.cwd() + data.launchWeb);
                // child.postMessage({ webLaunched: guid });
                webChild.webContents.on("did-finish-load", () => {
                    // webChild.webContents.send("message", "hello world");
                    child.postMessage({ webLaunched: guid });
                    webChildren[guid] = webChild;
                    node2web[nodeGuid] = [...(node2web[nodeGuid] || []), guid];
                });
            }
            if (data.teardown) {
                webChildren[data.teardown].close();
                delete webChildren[data.teardown];
                node2web[nodeGuid] = node2web[nodeGuid].filter((x) => x !== data.teardown);
            }
        })
            .on("exit", (data) => {
            stdout.close();
            stderr.close();
        });
        (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.pipe(stdout);
        (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.pipe(stderr);
    };
    const launchWebSecondary = (htmlFile) => {
        console.log("launchWebSecondary", htmlFile);
        const subWin = new electron_1.BrowserWindow({
            show: true,
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
                contextIsolation: false,
                preload: path_1.default.join(electron_1.app.getAppPath(), "preload.js"),
                offscreen: false,
                devTools: true,
            },
        });
        remoteMain.enable(subWin.webContents);
        subWin.webContents.openDevTools();
        subWin.loadFile(htmlFile);
        return subWin;
        // const uuid = uuidv4();
        // windows[uuid] = subWin;
        // return uuid;
    };
    const launchWeb = (t, dest) => {
        console.log("launchWeb", t);
        const destFolder = dest.replace(".mjs", "");
        const subWin = new electron_1.BrowserWindow({
            show: true,
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
                contextIsolation: false,
                preload: path_1.default.join(electron_1.app.getAppPath(), "preload.js"),
                offscreen: false,
                devTools: true,
            },
        });
        webChildren[(0, uuid_1.v4)()] = subWin;
        remoteMain.enable(subWin.webContents);
        const webArgz = JSON.stringify({
            name: dest,
            ports: [].toString(),
            // fs: path.resolve(configs.buildDir, "web", destFolder + "/"),
            // fs: destFolder,
            fs: destFolder,
        });
        // console.log("webArgz", webArgz);
        subWin.loadFile(`${dest}.html`, {
            query: {
                requesting: encodeURIComponent(webArgz),
            },
        });
        if (!fs_1.default.existsSync(destFolder)) {
            fs_1.default.mkdirSync(destFolder, { recursive: true });
        }
        const stdout = fs_1.default.createWriteStream(`${destFolder}/stdout.log`);
        subWin.webContents.on("console-message", (event, level, message, line, sourceId) => {
            stdout.write(JSON.stringify({
                event,
                level,
                message: JSON.stringify(message),
                line,
                sourceId,
            }, null, 2));
            stdout.write("\n");
        });
        subWin.on("closed", () => {
            console.log(" ---- Bye Bye Electron ---- ");
            stdout.close();
        });
        electron_1.ipcMain.on("message", (message, data) => {
            console.log("ipcMain message: " + JSON.stringify(data));
            // process.exit();
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
        return path_1.default.normalize(`${configs.buildDir}/${runtime}/${test
            .split(".")
            .slice(0, -1)
            .concat("mjs")
            .join(".")}`);
    };
    const changer = (f) => {
        return path_1.default.normalize(`${configs.buildDir}/${f}`);
    };
    const changer2 = (f, r) => {
        return path_1.default
            .normalize(`${configs.buildDir}/${r}/${f}`)
            .split(".")
            .slice(0, -1)
            .join(".");
    };
    puppeteer_in_electron_1.default.initialize(electron_1.app, 2999).then(async () => {
        electron_1.app.on("ready", () => {
            loadReport(configs);
            console.log("running all the tests once initially");
            configs.tests.forEach(([test, runtime, secondaryArtifacts]) => {
                if (runtime === "node") {
                    launchNode(test, changer2(test, "node"));
                }
                else if (runtime === "web") {
                    launchWeb(test, changer2(test, "web"));
                }
                else {
                    console.error("runtime makes no sense", runtime);
                }
            });
            console.log("ready and watching for changes...", configs.buildDir);
            fs_1.default.watch(configs.buildDir, {
                recursive: true,
            }, (eventType, changedFile) => {
                if (changedFile) {
                    configs.tests.forEach(([test, runtime, secondaryArtifacts]) => {
                        // console.log(eventType, changedFile, test);
                        if (eventType === "change") {
                            // console.log(
                            //   eventType,
                            //   changedFile,
                            //   test
                            //     .replace("./", "node/")
                            //     .split(".")
                            //     .slice(0, -1)
                            //     .concat("mjs")
                            //     .join(".")
                            // );
                            if (changedFile ===
                                test
                                    .replace("./", "node/")
                                    .split(".")
                                    .slice(0, -1)
                                    .concat("mjs")
                                    .join(".")) {
                                launchNode(test, changer2(test, "node"));
                            }
                            if (changedFile ===
                                test
                                    .replace("./", "web/")
                                    .split(".")
                                    .slice(0, -1)
                                    .concat("mjs")
                                    .join(".")) {
                                launchNode(test, changer2(test, "web"));
                            }
                        }
                        //   if(changedFile ===)
                        //   // if (watcher(test, runtime) === changer(test)) {
                        //   //   if (runtime === "node") {
                        //   //     launchNode(test, changer2(test, "node"));
                        //   //   } else if (runtime === "web") {
                        //   //     launchWeb(test, changer2(test, "web"));
                        //   //   } else {
                        //   //     console.error("runtime makes no sense", runtime);
                        //   //   }
                        //   // }
                    });
                }
            });
        });
    });
    await puppeteer_in_electron_1.default.connect(electron_1.app, puppeteer_core_1.default);
};
main();
