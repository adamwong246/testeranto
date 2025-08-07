"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_Main = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const node_child_process_1 = require("node:child_process");
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const net_1 = __importDefault(require("net"));
const fs_1 = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const ansi_colors_2 = __importDefault(require("ansi-colors"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const utils_1 = require("../utils");
const queue_js_1 = require("../utils/queue.js");
const PM_WithEslintAndTsc_js_1 = require("./PM_WithEslintAndTsc.js");
const changes = {};
const fileHashes = {};
const files = {};
const screenshots = {};
async function fileHash(filePath, algorithm = "md5") {
    return new Promise((resolve, reject) => {
        const hash = node_crypto_1.default.createHash(algorithm);
        const fileStream = fs_1.default.createReadStream(filePath);
        fileStream.on("data", (data) => {
            hash.update(data);
        });
        fileStream.on("end", () => {
            const fileHash = hash.digest("hex");
            resolve(fileHash);
        });
        fileStream.on("error", (error) => {
            reject(`Error reading file: ${error.message}`);
        });
    });
}
const statusMessagePretty = (failures, test, runtime) => {
    if (failures === 0) {
        console.log(ansi_colors_2.default.green(ansi_colors_2.default.inverse(`${runtime} > ${test} completed successfully`)));
    }
    else {
        console.log(ansi_colors_2.default.red(ansi_colors_2.default.inverse(`${runtime} > ${test} failed ${failures} times`)));
    }
};
async function writeFileAndCreateDir(filePath, data) {
    const dirPath = path_1.default.dirname(filePath);
    try {
        await fs_1.default.promises.mkdir(dirPath, { recursive: true });
        await fs_1.default.writeFileSync(filePath, data);
    }
    catch (error) {
        console.error(`Error writing file: ${error}`);
    }
}
const filesHash = async (files, algorithm = "md5") => {
    return new Promise((resolve, reject) => {
        resolve(files.reduce(async (mm, f) => {
            return (await mm) + (await fileHash(f));
        }, Promise.resolve("")));
    });
};
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    }
    catch (err) {
        return false;
    }
}
// Wait for file to exist, checks every 2 seconds by default
async function pollForFile(path, timeout = 2000) {
    const intervalObj = setInterval(function () {
        const file = path;
        const fileExists = fs_1.default.existsSync(file);
        if (fileExists) {
            clearInterval(intervalObj);
        }
    }, timeout);
}
class PM_Main extends PM_WithEslintAndTsc_js_1.PM_WithEslintAndTsc {
    constructor(configs, name, mode) {
        super(configs, name, mode);
        this.getRunnables = (tests, testName, payload = {
            nodeEntryPoints: {},
            nodeEntryPointSidecars: {},
            webEntryPoints: {},
            webEntryPointSidecars: {},
            pureEntryPoints: {},
            pureEntryPointSidecars: {},
        }) => {
            return (0, utils_1.getRunnables)(tests, testName, payload);
        };
        this.launchPure = async (src, dest) => {
            console.log(ansi_colors_2.default.green(ansi_colors_2.default.inverse(`pure < ${src}`)));
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src
                .split(".")
                .slice(0, -1)
                .join(".")}/pure`;
            if (!fs_1.default.existsSync(reportDest)) {
                fs_1.default.mkdirSync(reportDest, { recursive: true });
            }
            const destFolder = dest.replace(".mjs", "");
            let argz = "";
            const testConfig = this.configs.tests.find((t) => {
                return t[0] === src;
            });
            if (!testConfig) {
                console.log(ansi_colors_2.default.inverse("missing test config! Exiting ungracefully!"));
                process.exit(-1);
            }
            const testConfigResource = testConfig[2];
            const portsToUse = [];
            if (testConfigResource.ports === 0) {
                argz = JSON.stringify({
                    scheduled: true,
                    name: src,
                    ports: portsToUse,
                    fs: reportDest,
                    browserWSEndpoint: this.browser.wsEndpoint(),
                });
            }
            else if (testConfigResource.ports > 0) {
                const openPorts = Object.entries(this.ports).filter(([portnumber, status]) => status === "");
                if (openPorts.length >= testConfigResource.ports) {
                    for (let i = 0; i < testConfigResource.ports; i++) {
                        portsToUse.push(openPorts[i][0]);
                        this.ports[openPorts[i][0]] = src; // port is now claimed
                    }
                    argz = JSON.stringify({
                        scheduled: true,
                        name: src,
                        ports: portsToUse,
                        fs: destFolder,
                        browserWSEndpoint: this.browser.wsEndpoint(),
                    });
                }
                else {
                    this.queue.push(src);
                    return;
                }
            }
            else {
                console.error("negative port makes no sense", src);
                process.exit(-1);
            }
            const builtfile = dest;
            // const webSideCares: Page[] = [];
            // fs.writeFileSync(
            //   `${reportDest}/stdlog.txt`,
            //   "THIS FILE IS AUTO GENERATED. IT IS PURPOSEFULLY LEFT BLANK."
            // );
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
            try {
                await Promise.resolve(`${`${builtfile}?cacheBust=${Date.now()}`}`).then(s => __importStar(require(s))).then((module) => {
                    return module.default
                        .then((defaultModule) => {
                        defaultModule
                            .receiveTestResourceConfig(argz)
                            .then(async (results) => {
                            // this.receiveFeatures(results.features, destFolder, src, "pure");
                            // this.receiveFeaturesV2(reportDest, src, "pure");
                            statusMessagePretty(results.fails, src, "pure");
                            this.bddTestIsNowDone(src, results.fails);
                        })
                            .catch((e1) => {
                            console.log(ansi_colors_2.default.red(`launchPure - ${src} errored with: ${e1}`));
                            this.bddTestIsNowDone(src, -1);
                            statusMessagePretty(-1, src, "pure");
                        });
                        // .finally(() => {
                        //   // webSideCares.forEach((webSideCar) => webSideCar.close());
                        // });
                    })
                        .catch((e2) => {
                        console.log(ansi_colors_1.default.red(`pure ! ${src} failed to execute. No "tests.json" file was generated. Check ${reportDest}/logs.txt for more info`));
                        this.writeFileSync(`${reportDest}/logs.txt`, e2.stack, src);
                        this.bddTestIsNowDone(src, -1);
                        statusMessagePretty(-1, src, "pure");
                        // console.error(e);
                    })
                        .finally((x) => {
                        // const fileSet = files[src] || new Set();
                        // fs.writeFileSync(
                        //   reportDest + "/manifest.json",
                        //   JSON.stringify(Array.from(fileSet))
                        // );
                    });
                });
            }
            catch (e3) {
                console.log(ansi_colors_2.default.red(ansi_colors_2.default.inverse(`${src} 1 errored with: ${e3}. Check ${reportDest}/logs.txt for more info`)));
                this.writeFileSync(`${reportDest}/logs.txt`, e3.stack, src);
                this.bddTestIsNowDone(src, -1);
                statusMessagePretty(-1, src, "pure");
                console.log("III) PURE IS EXITING BADLY WITH error", e3);
            }
            for (let i = 0; i <= portsToUse.length; i++) {
                if (portsToUse[i]) {
                    this.ports[portsToUse[i]] = ""; //port is open again
                }
            }
        };
        this.launchNode = async (src, dest) => {
            console.log(ansi_colors_2.default.green(ansi_colors_2.default.inverse(`node < ${src}`)));
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src
                .split(".")
                .slice(0, -1)
                .join(".")}/node`;
            if (!fs_1.default.existsSync(reportDest)) {
                fs_1.default.mkdirSync(reportDest, { recursive: true });
            }
            // const destFolder = dest.replace(".mjs", "");
            let testResources = "";
            const testConfig = this.configs.tests.find((t) => {
                return t[0] === src;
            });
            if (!testConfig) {
                console.log(ansi_colors_2.default.inverse(`missing test config! Exiting ungracefully for '${src}'`));
                process.exit(-1);
            }
            const testConfigResource = testConfig[2];
            const portsToUse = [];
            if (testConfigResource.ports === 0) {
                const t = {
                    name: src,
                    // ports: portsToUse.map((v) => Number(v)),
                    ports: [],
                    fs: reportDest,
                    browserWSEndpoint: this.browser.wsEndpoint(),
                };
                testResources = JSON.stringify(t);
            }
            else if (testConfigResource.ports > 0) {
                const openPorts = Object.entries(this.ports).filter(([portnumber, portopen]) => portopen === "");
                if (openPorts.length >= testConfigResource.ports) {
                    for (let i = 0; i < testConfigResource.ports; i++) {
                        portsToUse.push(openPorts[i][0]);
                        this.ports[openPorts[i][0]] = src; // port is now claimed
                    }
                    testResources = JSON.stringify({
                        scheduled: true,
                        name: src,
                        ports: portsToUse,
                        fs: reportDest,
                        browserWSEndpoint: this.browser.wsEndpoint(),
                    });
                }
                else {
                    console.log(ansi_colors_2.default.red(`node: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again run a port is available`));
                    this.queue.push(src);
                    return;
                }
            }
            else {
                console.error("negative port makes no sense", src);
                process.exit(-1);
            }
            const builtfile = dest;
            let haltReturns = false;
            const ipcfile = "/tmp/tpipe_" + Math.random();
            const child = (0, node_child_process_1.spawn)("node", 
            // "node",
            [
                // "--inspect-brk",
                builtfile,
                testResources,
                ipcfile,
            ], {
                stdio: ["pipe", "pipe", "pipe", "ipc"],
            });
            let buffer = new Buffer("");
            const server = net_1.default.createServer((socket) => {
                const queue = new queue_js_1.Queue();
                socket.on("data", (data) => {
                    buffer = Buffer.concat([buffer, data]);
                    for (let b = 0; b < buffer.length + 1; b++) {
                        const c = buffer.slice(0, b);
                        let d;
                        try {
                            d = JSON.parse(c.toString());
                            queue.enqueue(d);
                            buffer = buffer.slice(b, buffer.length + 1);
                            b = 0;
                        }
                        catch (e) {
                            // b++;
                        }
                    }
                    while (queue.size() > 0) {
                        const message = queue.dequeue();
                        if (message) {
                            // set up the "node" listeners
                            this.mapping().forEach(async ([command, func]) => {
                                if (message[0] === command) {
                                    const x = message.slice(1, -1);
                                    const r = await this[command](...x);
                                    if (!haltReturns) {
                                        child.send(JSON.stringify({
                                            payload: r,
                                            key: message[message.length - 1],
                                        }));
                                    }
                                }
                            });
                        }
                    }
                });
            });
            const oStream = fs_1.default.createWriteStream(`${reportDest}/logs.txt`);
            const errFile = `${reportDest}/logs.txt`;
            if (fs_1.default.existsSync(errFile)) {
                fs_1.default.rmSync(errFile);
            }
            server.listen(ipcfile, () => {
                var _a, _b;
                (_a = child.stderr) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                    oStream.write(`stderr > ${data}`);
                });
                (_b = child.stdout) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
                    oStream.write(`stdout > ${data}`);
                });
                child.on("error", (err) => { });
                child.on("close", (code) => {
                    // oStream.close();
                    server.close();
                    if (!files[src]) {
                        files[src] = new Set();
                    }
                    // files[src].add(filepath);
                    // fs.writeFileSync(
                    //   reportDest + "/manifest.json",
                    //   JSON.stringify(Array.from(files[src]))
                    // );
                    if (code === 255) {
                        console.log(ansi_colors_1.default.red(`node ! ${src} failed to execute. No "tests.json" file was generated. Check ${reportDest}/logs.txt for more info`));
                        this.bddTestIsNowDone(src, -1);
                        statusMessagePretty(-1, src, "node");
                        oStream.close();
                        return;
                    }
                    else if (code === 0) {
                        this.bddTestIsNowDone(src, 0);
                        statusMessagePretty(0, src, "node");
                    }
                    else {
                        this.bddTestIsNowDone(src, code);
                        statusMessagePretty(code, src, "node");
                    }
                    haltReturns = true;
                });
                child.on("exit", (code) => {
                    haltReturns = true;
                    for (let i = 0; i <= portsToUse.length; i++) {
                        if (portsToUse[i]) {
                            this.ports[portsToUse[i]] = ""; //port is open again
                        }
                    }
                });
                child.on("error", (e) => {
                    console.log("error");
                    haltReturns = true;
                    console.log(ansi_colors_2.default.red(ansi_colors_2.default.inverse(`${src} errored with: ${e.name}. Check ${errFile} for more info`)));
                    this.writeFileSync(`${reportDest}/logs.txt`, e.toString(), src);
                    this.bddTestIsNowDone(src, -1);
                    statusMessagePretty(-1, src, "node");
                });
            });
        };
        this.launchWebSideCar = async (testConfig) => {
            const src = testConfig[0];
            const dest = src.split(".").slice(0, -1).join(".");
            // const d = dest + ".mjs";
            const destFolder = dest.replace(".mjs", "");
            console.log(ansi_colors_2.default.green(ansi_colors_2.default.inverse(`launchWebSideCar ${src}`)));
            const fileStreams2 = [];
            const doneFileStream2 = [];
            const oStream = fs_1.default.createWriteStream(`${destFolder}/logs.txt`);
            return new Promise((res, rej) => {
                this.browser
                    .newPage()
                    .then(async (page) => {
                    this.mapping().forEach(async ([command, func]) => {
                        page.exposeFunction(command, func);
                    });
                    const close = () => {
                        if (!files[src]) {
                            files[src] = new Set();
                        }
                        // files[src].add(filepath);
                        // fs.writeFileSync(
                        //   destFolder + "/manifest.json",
                        //   JSON.stringify(Array.from(files[src]))
                        // );
                        delete files[src];
                        Promise.all(screenshots[src] || []).then(() => {
                            delete screenshots[src];
                            page.close();
                            oStream.close();
                        });
                    };
                    page.on("pageerror", (err) => {
                        console.debug(`Error from ${src}: [${err.name}] `);
                        oStream.write(err.name);
                        oStream.write("\n");
                        if (err.cause) {
                            console.debug(`Error from ${src} cause: [${err.cause}] `);
                            oStream.write(err.cause);
                            oStream.write("\n");
                        }
                        if (err.stack) {
                            console.debug(`Error from stack ${src}: [${err.stack}] `);
                            oStream.write(err.stack);
                            oStream.write("\n");
                        }
                        console.debug(`Error from message ${src}: [${err.message}] `);
                        oStream.write(err.message);
                        oStream.write("\n");
                        this.bddTestIsNowDone(src, -1);
                        close();
                    });
                    page.on("console", (log) => {
                        oStream.write(log.text());
                        oStream.write(JSON.stringify(log.location()));
                        oStream.write(JSON.stringify(log.stackTrace()));
                        oStream.write("\n");
                    });
                    await page.goto(`file://${`${destFolder}.html`}`, {});
                    const webArgz = JSON.stringify({
                        name: dest,
                        ports: [].toString(),
                        fs: dest,
                        browserWSEndpoint: this.browser.wsEndpoint(),
                    });
                    const d = `${dest}?cacheBust=${Date.now()}`;
                    const evaluation = `
    import('${d}').then(async (x) => {

      try {
        return await (await x.default).receiveTestResourceConfig(${webArgz})
      } catch (e) {
        console.log("fail", e.toString())
      }
    })`;
                    await page
                        .evaluate(evaluation)
                        .then(async ({ fails, failed, features }) => {
                        // this.receiveFeatures(features, destFolder, src, "web");
                        // this.receiveFeaturesV2(reportDest, src, "web");
                        statusMessagePretty(fails, src, "web");
                        this.bddTestIsNowDone(src, fails);
                    })
                        .catch((e) => {
                        console.log(ansi_colors_2.default.red(ansi_colors_2.default.inverse(`launchWebSidecar - ${src} errored with: ${e}`)));
                    })
                        .finally(() => {
                        this.bddTestIsNowDone(src, -1);
                        close();
                    });
                    return page;
                    // return page;
                })
                    .then(async (page) => {
                    await page.goto(`file://${`${dest}.html`}`, {});
                    /* @ts-ignore:next-line */
                    res([Math.random(), page]);
                });
            });
        };
        this.launchNodeSideCar = async (sidecar) => {
            const src = sidecar[0];
            const dest = process.cwd() + `/testeranto/bundles/node/${this.name}/${sidecar[0]}`;
            const d = dest + ".mjs";
            console.log(ansi_colors_2.default.green(ansi_colors_2.default.inverse(`launchNodeSideCar ${sidecar[0]}`)));
            const destFolder = dest.replace(".ts", "");
            const reportDest = `testeranto/reports/${this.name}/${src
                .split(".")
                .slice(0, -1)
                .join(".")}/node`;
            const argz = {
                name: sidecar[0],
                ports: [],
                fs: destFolder,
                browserWSEndpoint: this.browser.wsEndpoint(),
            };
            const testReq = sidecar[2];
            const portsToUse = [];
            if (testReq.ports === 0) {
                // argz = {
                //   name: sidecar[0],
                //   ports: portsToUse,
                //   fs: destFolder,
                //   browserWSEndpoint: this.browser.wsEndpoint(),
                // };
            }
            else if (testReq.ports > 0) {
                const openPorts = Object.entries(this.ports).filter(([portnumber, portopen]) => portopen === "");
                if (openPorts.length >= testReq.ports) {
                    for (let i = 0; i < testReq.ports; i++) {
                        portsToUse.push(openPorts[i][0]);
                        this.ports[openPorts[i][0]] = src; // port is now closed
                    }
                    argz.ports = portsToUse;
                    const builtfile = destFolder + ".mjs";
                    let haltReturns = false;
                    let buffer = new Buffer("");
                    const server = net_1.default.createServer((socket) => {
                        socket.on("data", (data) => {
                            buffer = Buffer.concat([buffer, data]);
                            const messages = [];
                            for (let b = 0; b < buffer.length + 1; b++) {
                                const c = buffer.slice(0, b);
                                let d;
                                try {
                                    d = JSON.parse(c.toString());
                                    messages.push(d);
                                    buffer = buffer.slice(b, buffer.length + 1);
                                    b = 0;
                                }
                                catch (e) {
                                    // b++;
                                }
                            }
                            messages.forEach(async (payload) => {
                                this.mapping().forEach(async ([command, func]) => {
                                    if (payload[0] === command) {
                                        const x = payload.slice(1, -1);
                                        const r = await this[command](...x);
                                        if (!haltReturns) {
                                            child.send(JSON.stringify({
                                                payload: r,
                                                key: payload[payload.length - 1],
                                            }));
                                        }
                                    }
                                });
                            });
                        });
                    });
                    const oStream = fs_1.default.createWriteStream(`${reportDest}/logs.txt`);
                    const child = (0, node_child_process_1.spawn)("node", [builtfile, JSON.stringify(argz)], {
                        stdio: ["pipe", "pipe", "pipe", "ipc"],
                        // silent: true
                    });
                    const p = "/tmp/tpipe" + Math.random();
                    const errFile = `${reportDest}/logs.txt`;
                    server.listen(p, () => {
                        var _a, _b;
                        (_a = child.stderr) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                            oStream.write(`stderr > ${data}`);
                        });
                        (_b = child.stdout) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
                            oStream.write(`stdout > ${data}`);
                        });
                        child.on("close", (code) => {
                            oStream.close();
                            server.close();
                            haltReturns = true;
                        });
                        child.on("exit", (code) => {
                            haltReturns = true;
                            for (let i = 0; i <= portsToUse.length; i++) {
                                if (portsToUse[i]) {
                                    this.ports[portsToUse[i]] = ""; //port is open again
                                }
                            }
                        });
                        child.on("error", (e) => {
                            if (fs_1.default.existsSync(p)) {
                                fs_1.default.rmSync(p);
                            }
                            haltReturns = true;
                            console.log(ansi_colors_2.default.red(ansi_colors_2.default.inverse(`launchNodeSideCar - ${src} errored with: ${e.name}. Check ${errFile}for more info`)));
                            this.writeFileSync(`${reportDest}/logs.txt`, e.toString(), src);
                            // this.bddTestIsNowDone(src, -1);
                            // statusMessagePretty(-1, src);
                        });
                    });
                    child.send({ path: p });
                    const r = Math.random();
                    this.nodeSidecars[r] = child;
                    return [r, argz];
                }
                else {
                    console.log(ansi_colors_2.default.red(`cannot ${src} because there are no open ports. the job will be unqueued`));
                    this.queue.push(sidecar[0]);
                    return [Math.random(), argz];
                }
            }
            else {
                console.error("negative port makes no sense", sidecar[0]);
                process.exit(-1);
            }
        };
        this.stopPureSideCar = async (uid) => {
            console.log(ansi_colors_2.default.green(ansi_colors_2.default.inverse(`stopPureSideCar ${uid}`)));
            await this.sidecars[uid].shutdown();
            return;
        };
        this.launchPureSideCar = async (sidecar) => {
            console.log(ansi_colors_2.default.green(ansi_colors_2.default.inverse(`launchPureSideCar ${sidecar[0]}`)));
            const r = Math.random();
            const dest = process.cwd() + `/testeranto/bundles/pure/${this.name}/${sidecar[0]}`;
            const builtfile = dest.split(".").slice(0, -1).concat("mjs").join(".");
            const destFolder = dest.replace(".mjs", "");
            let argz;
            const z = sidecar[2];
            const testConfigResource = sidecar[2];
            const src = sidecar[0];
            const portsToUse = [];
            if (testConfigResource.ports === 0) {
                argz = {
                    // scheduled: true,
                    name: src,
                    ports: portsToUse,
                    fs: destFolder,
                    browserWSEndpoint: this.browser.wsEndpoint(),
                };
            }
            else if (testConfigResource.ports > 0) {
                const openPorts = Object.entries(this.ports).filter(([portnumber, portopen]) => portopen === "");
                if (openPorts.length >= testConfigResource.ports) {
                    for (let i = 0; i < testConfigResource.ports; i++) {
                        portsToUse.push(openPorts[i][0]);
                        this.ports[openPorts[i][0]] = src; // port is now claimed
                    }
                    argz = {
                        // scheduled: true,
                        name: src,
                        // ports: [3333],
                        ports: portsToUse,
                        fs: ".",
                        browserWSEndpoint: this.browser.wsEndpoint(),
                    };
                }
                else {
                    this.queue.push(src);
                    return;
                }
            }
            else {
                console.error("negative port makes no sense", src);
                process.exit(-1);
            }
            // const builtfile = dest + ".mjs";
            await Promise.resolve(`${`${builtfile}?cacheBust=${Date.now()}`}`).then(s => __importStar(require(s))).then((module) => {
                this.pureSidecars[r] = module.default;
                this.pureSidecars[r].start(argz);
            });
            return [r, argz];
            // for (let i = 0; i <= portsToUse.length; i++) {
            //   if (portsToUse[i]) {
            //     this.ports[portsToUse[i]] = "true"; //port is open again
            //   }
            // }
        };
        this.launchWeb = async (src, dest) => {
            console.log(ansi_colors_2.default.green(ansi_colors_2.default.inverse(`web < ${src}`)));
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src
                .split(".")
                .slice(0, -1)
                .join(".")}/web`;
            if (!fs_1.default.existsSync(reportDest)) {
                fs_1.default.mkdirSync(reportDest, { recursive: true });
            }
            const destFolder = dest.replace(".mjs", "");
            const webArgz = JSON.stringify({
                name: src,
                ports: [].toString(),
                fs: reportDest,
                browserWSEndpoint: this.browser.wsEndpoint(),
            });
            const d = `${dest}?cacheBust=${Date.now()}`;
            const ofile = `${reportDest}/logs.txt`;
            const oStream = fs_1.default.createWriteStream(ofile);
            this.browser
                .newPage()
                .then((page) => {
                this.mapping().forEach(async ([command, func]) => {
                    if (command === "page") {
                        page.exposeFunction(command, (x) => {
                            if (x) {
                                return func(x);
                            }
                            else {
                                return func(page.mainFrame()._id);
                            }
                        });
                    }
                    else {
                        return page.exposeFunction(command, func);
                    }
                });
                return page;
            })
                .then(async (page) => {
                const close = () => {
                    if (!files[src]) {
                        files[src] = new Set();
                    }
                    // files[t].add(filepath);
                    // fs.writeFileSync(
                    //   destFolder + "/manifest.json",
                    //   JSON.stringify(Array.from(files[src]))
                    // );
                    delete files[src];
                    Promise.all(screenshots[src] || []).then(() => {
                        delete screenshots[src];
                        page.close();
                        oStream.close();
                    });
                    return;
                };
                page.on("pageerror", (err) => {
                    console.log(ansi_colors_1.default.red(`web ! ${src} failed to execute No "tests.json" file was generated. Check ${reportDest}/logs.txt for more info`));
                    oStream.write(err.name);
                    oStream.write("\n");
                    if (err.cause) {
                        oStream.write(err.cause);
                        oStream.write("\n");
                    }
                    if (err.stack) {
                        oStream.write(err.stack);
                        oStream.write("\n");
                    }
                    if (err.message) {
                        oStream.write(err.message);
                        oStream.write("\n");
                    }
                    this.bddTestIsNowDone(src, -1);
                    close();
                });
                page.on("console", (log) => {
                    // console.log("console message: ", log.text());
                    if (oStream.closed) {
                        console.log("missed console message: ", log.text());
                        return;
                    }
                    else {
                        oStream.write(log.text());
                        oStream.write("\n");
                        oStream.write(JSON.stringify(log.location()));
                        oStream.write("\n");
                        oStream.write(JSON.stringify(log.stackTrace()));
                        oStream.write("\n");
                    }
                });
                await page.goto(`file://${`${destFolder}.html`}`, {});
                await page
                    .evaluate(`
import('${d}').then(async (x) => {
  try {
    return await (await x.default).receiveTestResourceConfig(${webArgz})
  } catch (e) {
    console.log("web run failure", e.toString())
  }
})
`)
                    .then(async ({ fails, failed, features }) => {
                    statusMessagePretty(fails, src, "web");
                    this.bddTestIsNowDone(src, fails);
                    // close();
                })
                    .catch((e) => {
                    console.log(ansi_colors_2.default.red(ansi_colors_2.default.inverse(e.stack)));
                    console.log(ansi_colors_2.default.red(ansi_colors_2.default.inverse(`web ! ${src} failed to execute. No "tests.json" file was generated. Check ${reportDest}/logs.txt for more info`)));
                    this.bddTestIsNowDone(src, -1);
                })
                    .finally(() => {
                    // process.exit(-1);
                    close();
                });
                return page;
            });
        };
        this.receiveFeaturesV2 = (reportDest, srcTest, platform) => {
            const featureDestination = path_1.default.resolve(process.cwd(), "reports", "features", "strings", srcTest.split(".").slice(0, -1).join(".") + ".features.txt");
            const testReport = JSON.parse(fs_1.default.readFileSync(`${reportDest}/tests.json`).toString());
            testReport.features
                .reduce(async (mm, featureStringKey) => {
                const accum = await mm;
                const isUrl = isValidUrl(featureStringKey);
                if (isUrl) {
                    const u = new URL(featureStringKey);
                    if (u.protocol === "file:") {
                        const newPath = `${process.cwd()}/testeranto/features/internal/${path_1.default.relative(process.cwd(), u.pathname)}`;
                        // await fs.promises.mkdir(path.dirname(newPath), { recursive: true });
                        // try {
                        //   await fs.unlinkSync(newPath);
                        //   // console.log(`Removed existing link at ${newPath}`);
                        // } catch (error) {
                        //   if (error.code !== "ENOENT") {
                        //     // throw error;
                        //   }
                        // }
                        // fs.symlink(u.pathname, newPath, (err) => {
                        //   if (err) {
                        //     // console.error("Error creating symlink:", err);
                        //   } else {
                        //     // console.log("Symlink created successfully");
                        //   }
                        // });
                        accum.files.push(u.pathname);
                    }
                    else if (u.protocol === "http:" || u.protocol === "https:") {
                        const newPath = `${process.cwd()}/testeranto/features/external/${u.hostname}${u.pathname}`;
                        const body = await this.configs.featureIngestor(featureStringKey);
                        writeFileAndCreateDir(newPath, body);
                        accum.files.push(newPath);
                    }
                }
                else {
                    await fs_1.default.promises.mkdir(path_1.default.dirname(featureDestination), {
                        recursive: true,
                    });
                    accum.strings.push(featureStringKey);
                }
                return accum;
            }, Promise.resolve({ files: [], strings: [] }))
                .then(({ files, strings }) => {
                // Markdown files must be referenced in the prompt but string style features are already present in the test.json file
                fs_1.default.writeFileSync(`testeranto/reports/${this.name}/${srcTest
                    .split(".")
                    .slice(0, -1)
                    .join(".")}/${platform}/featurePrompt.txt`, files
                    .map((f) => {
                    return `/read ${f}`;
                })
                    .join("\n"));
            });
            // const f: Record<string, string> = {};
            testReport.givens.forEach((g) => {
                if (g.failed === true) {
                    this.summary[srcTest].failingFeatures[g.key] = g.features;
                }
            });
            // this.summary[srcTest].failingFeatures = f;
            this.writeBigBoard();
        };
        this.checkForShutdown = () => {
            // console.log(ansiC.inverse(JSON.stringify(this.summary, null, 2)));
            this.checkQueue();
            console.log(ansi_colors_2.default.inverse(`The following jobs are awaiting resources: ${JSON.stringify(this.queue)}`));
            console.log(ansi_colors_2.default.inverse(`The status of ports: ${JSON.stringify(this.ports)}`));
            this.writeBigBoard();
            if (this.mode === "dev")
                return;
            let inflight = false;
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].prompt === "?") {
                    console.log(ansi_colors_2.default.blue(ansi_colors_2.default.inverse(`🕕 prompt ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].runTimeErrors === "?") {
                    console.log(ansi_colors_2.default.blue(ansi_colors_2.default.inverse(`🕕 runTimeError ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].staticErrors === "?") {
                    console.log(ansi_colors_2.default.blue(ansi_colors_2.default.inverse(`🕕 staticErrors ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].typeErrors === "?") {
                    console.log(ansi_colors_2.default.blue(ansi_colors_2.default.inverse(`🕕 typeErrors ${k}`)));
                    inflight = true;
                }
            });
            this.writeBigBoard();
            if (!inflight) {
                this.browser.disconnect().then(() => {
                    console.log(ansi_colors_2.default.inverse(`${this.name} has been tested. Goodbye.`));
                    process.exit();
                });
            }
        };
        this.launchers = {};
        this.ports = {};
        this.queue = [];
        this.nodeSidecars = {};
        this.webSidecars = {};
        this.pureSidecars = {};
        this.configs.ports.forEach((element) => {
            this.ports[element] = ""; // set ports as open
        });
    }
    async stopSideCar(uid) {
        console.log(ansi_colors_2.default.green(ansi_colors_2.default.inverse(`stopSideCar ${uid}`)));
        Object.entries(this.pureSidecars).forEach(async ([k, v]) => {
            if (Number(k) === uid) {
                await this.pureSidecars[Number(k)].stop();
                delete this.pureSidecars[Number(k)];
            }
        });
        Object.entries(this.nodeSidecars).forEach(async ([k, v]) => {
            if (Number(k) === uid) {
                await this.nodeSidecars[Number(k)].send("stop");
                delete this.nodeSidecars[Number(k)];
            }
        });
        Object.entries(this.webSidecars).forEach(async ([k, v]) => {
            if (Number(k) === uid) {
                (await this.browser.pages()).forEach(async (p) => {
                    if (p.mainFrame()._id === k) {
                        await this.webSidecars[Number(k)].close();
                        delete this.webSidecars[Number(k)];
                    }
                });
            }
        });
        return;
    }
    async launchSideCar(n, name) {
        const c = this.configs.tests.find(([v, r]) => {
            return v === name;
        });
        const s = c[3][n];
        const r = s[1];
        if (r === "node") {
            return this.launchNodeSideCar(s);
        }
        else if (r === "web") {
            return this.launchWebSideCar(s);
        }
        else if (r === "pure") {
            return this.launchPureSideCar(s);
        }
        else {
            throw `unknown runtime ${r}`;
        }
    }
    mapping() {
        return [
            ["$", this.$],
            ["click", this.click],
            ["closePage", this.closePage],
            ["createWriteStream", this.createWriteStream],
            ["customclose", this.customclose],
            ["customScreenShot", this.customScreenShot.bind(this)],
            ["end", this.end],
            ["existsSync", this.existsSync],
            ["focusOn", this.focusOn],
            ["getAttribute", this.getAttribute],
            ["getInnerHtml", this.getInnerHtml],
            // ["setValue", this.setValue],
            ["goto", this.goto.bind(this)],
            ["isDisabled", this.isDisabled],
            ["launchSideCar", this.launchSideCar.bind(this)],
            ["mkdirSync", this.mkdirSync],
            ["newPage", this.newPage],
            ["page", this.page],
            ["pages", this.pages],
            ["screencast", this.screencast],
            ["screencastStop", this.screencastStop],
            ["stopSideCar", this.stopSideCar.bind(this)],
            ["typeInto", this.typeInto],
            ["waitForSelector", this.waitForSelector],
            ["write", this.write],
            ["writeFileSync", this.writeFileSync],
        ];
    }
    async start() {
        // set up the "pure" listeners
        this.mapping().forEach(async ([command, func]) => {
            globalThis[command] = func;
        });
        if (!fs_1.default.existsSync(`testeranto/reports/${this.name}`)) {
            fs_1.default.mkdirSync(`testeranto/reports/${this.name}`);
        }
        const executablePath = "/opt/homebrew/bin/chromium";
        try {
            this.browser = await puppeteer_core_1.default.launch({
                slowMo: 1,
                waitForInitialPage: false,
                executablePath,
                headless: true,
                defaultViewport: null, // Disable default 800x600 viewport
                dumpio: false,
                devtools: false,
                args: [
                    "--allow-file-access-from-files",
                    "--allow-insecure-localhost",
                    "--allow-running-insecure-content",
                    "--auto-open-devtools-for-tabs",
                    "--disable-dev-shm-usage",
                    "--disable-extensions",
                    "--disable-features=site-per-process",
                    "--disable-gpu",
                    "--disable-setuid-sandbox",
                    "--disable-site-isolation-trials",
                    "--disable-web-security",
                    "--no-first-run",
                    "--no-sandbox",
                    "--no-startup-window",
                    "--reduce-security-for-testing",
                    "--remote-allow-origins=*",
                    "--start-maximized",
                    "--unsafely-treat-insecure-origin-as-secure=*",
                    `--remote-debugging-port=3234`,
                    // "--disable-features=IsolateOrigins,site-per-process",
                    // "--disable-features=IsolateOrigins",
                    // "--disk-cache-dir=/dev/null",
                    // "--disk-cache-size=1",
                    // "--no-zygote",
                    // "--remote-allow-origins=ws://localhost:3234",
                    // "--single-process",
                    // "--start-maximized",
                    // "--unsafely-treat-insecure-origin-as-secure",
                    // "--unsafely-treat-insecure-origin-as-secure=ws://192.168.0.101:3234",
                ],
            });
        }
        catch (e) {
            console.error(e);
            console.error("could not start chrome via puppeter. Check this path: ", executablePath);
        }
        const { nodeEntryPoints, webEntryPoints, pureEntryPoints } = this.getRunnables(this.configs.tests, this.name);
        [
            [
                nodeEntryPoints,
                this.launchNode,
                "node",
                (w) => {
                    this.nodeMetafileWatcher = w;
                },
            ],
            [
                webEntryPoints,
                this.launchWeb,
                "web",
                (w) => {
                    this.webMetafileWatcher = w;
                },
            ],
            [
                pureEntryPoints,
                this.launchPure,
                "pure",
                (w) => {
                    this.importMetafileWatcher = w;
                },
            ],
        ].forEach(async ([eps, launcher, runtime, watcher]) => {
            const metafile = `./testeranto/bundles/${runtime}/${this.name}/metafile.json`;
            await pollForFile(metafile);
            Object.entries(eps).forEach(async ([inputFile, outputFile]) => {
                // await pollForFile(outputFile);\
                this.launchers[inputFile] = () => launcher(inputFile, outputFile);
                this.launchers[inputFile]();
                try {
                    (0, fs_1.watch)(outputFile, async (e, filename) => {
                        const hash = await fileHash(outputFile);
                        if (fileHashes[inputFile] !== hash) {
                            fileHashes[inputFile] = hash;
                            console.log(ansi_colors_2.default.yellow(ansi_colors_2.default.inverse(`< ${e} ${filename}`)));
                            // launcher(inputFile, outputFile);
                            this.launchers[inputFile]();
                        }
                    });
                }
                catch (e) {
                    console.error(e);
                }
            });
            this.metafileOutputs(runtime);
            watcher((0, fs_1.watch)(metafile, async (e, filename) => {
                console.log(ansi_colors_2.default.yellow(ansi_colors_2.default.inverse(`< ${e} ${filename} (${runtime})`)));
                this.metafileOutputs(runtime);
            }));
        });
        // Object.keys(this.configs.externalTests).forEach((et) => {
        //   this.launchExternalTest(et, this.configs.externalTests[et]);
        // });
    }
    // async launchExternalTest(
    //   externalTestName: string,
    //   externalTest: {
    //     watch: string[];
    //     exec: string;
    //   }
    // ) {
    //   // fs.mkdirSync(`testeranto/externalTests/${externalTestName}`);
    //   // exec(externalTest.exec, (error, stdout, stderr) => {
    //   //   if (error) {
    //   //     fs.writeFileSync(
    //   //       `testeranto/externalTests/${externalTestName}/exitcode.txt`,
    //   //       `${error.name}\n${error.message}\n${error.code}\n`
    //   //     );
    //   //   } else {
    //   //     fs.writeFileSync(
    //   //       `testeranto/externalTests/${externalTestName}/exitcode.txt`,
    //   //       `0`
    //   //     );
    //   //   }
    //   //   fs.writeFileSync(
    //   //     `testeranto/externalTests/${externalTestName}/stdout.txt`,
    //   //     stdout
    //   //   );
    //   //   fs.writeFileSync(
    //   //     `testeranto/externalTests/${externalTestName}/stderr.txt`,
    //   //     stderr
    //   //   );
    //   // });
    // }
    async stop() {
        console.log(ansi_colors_2.default.inverse("Testeranto-Run is shutting down gracefully..."));
        this.mode = "once";
        this.nodeMetafileWatcher.close();
        this.webMetafileWatcher.close();
        this.importMetafileWatcher.close();
        this.checkForShutdown();
    }
    async metafileOutputs(platform) {
        const metafile = JSON.parse(fs_1.default
            .readFileSync(`./testeranto/bundles/${platform}/${this.name}/metafile.json`)
            .toString()).metafile;
        if (!metafile)
            return;
        const outputs = metafile.outputs;
        Object.keys(outputs).forEach(async (k) => {
            const pattern = `testeranto/bundles/${platform}/${this.name}/${this.configs.src}`;
            if (!k.startsWith(pattern)) {
                return false;
            }
            const addableFiles = Object.keys(outputs[k].inputs).filter((i) => {
                if (!fs_1.default.existsSync(i))
                    return false;
                if (i.startsWith("node_modules"))
                    return false;
                if (i.startsWith("./node_modules"))
                    return false;
                return true;
            });
            const f = `${k.split(".").slice(0, -1).join(".")}/`;
            if (!fs_1.default.existsSync(f)) {
                fs_1.default.mkdirSync(f);
            }
            const entrypoint = outputs[k].entryPoint;
            if (entrypoint) {
                const changeDigest = await filesHash(addableFiles);
                if (changeDigest === changes[entrypoint]) {
                    // skip
                }
                else {
                    changes[entrypoint] = changeDigest;
                    this.tscCheck({
                        platform,
                        addableFiles,
                        entrypoint: entrypoint,
                    });
                    this.eslintCheck(entrypoint, platform, addableFiles);
                    this.makePrompt(entrypoint, addableFiles, platform);
                }
            }
        });
    }
    checkQueue() {
        const x = this.queue.pop();
        if (!x) {
            ansi_colors_2.default.inverse(`The following queue is empty`);
            return;
        }
        const test = this.configs.tests.find((t) => t[0] === x);
        if (!test)
            throw `test is undefined ${x}`;
        // const [src, runtime, ...xx]: [string, IRunTime, ...any] = test;
        this.launchers[test[0]]();
    }
}
exports.PM_Main = PM_Main;
