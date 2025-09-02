"use strict";
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
const node_child_process_1 = require("node:child_process");
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const net_1 = __importDefault(require("net"));
const fs_1 = __importDefault(require("fs"));
const ansi_colors_2 = __importDefault(require("ansi-colors"));
const utils_1 = require("../utils");
const queue_js_1 = require("../utils/queue.js");
const utils_js_1 = require("./utils.js");
const PM_WithProcesses_js_1 = require("./PM_WithProcesses.js");
const files = {};
const screenshots = {};
class PM_Main extends PM_WithProcesses_js_1.PM_WithProcesses {
    constructor() {
        super(...arguments);
        this.launchPure = async (src, dest) => {
            const processId = `pure-${src}-${Date.now()}`;
            const command = `pure test: ${src}`;
            // Create the promise
            const purePromise = (async () => {
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
                        return [Math.random(), argz];
                    }
                }
                else {
                    console.error("negative port makes no sense", src);
                    process.exit(-1);
                }
                const builtfile = dest;
                const logs = (0, utils_js_1.createLogStreams)(reportDest, "pure");
                try {
                    await Promise.resolve(`${`${builtfile}?cacheBust=${Date.now()}`}`).then(s => __importStar(require(s))).then((module) => {
                        return module.default
                            .then((defaultModule) => {
                            return defaultModule
                                .receiveTestResourceConfig(argz)
                                .then(async (results) => {
                                (0, utils_js_1.statusMessagePretty)(results.fails, src, "pure");
                                this.bddTestIsNowDone(src, results.fails);
                                return results.fails;
                            });
                        })
                            .catch((e2) => {
                            console.log(ansi_colors_1.default.red(`pure ! ${src} failed to execute. No "tests.json" file was generated. Check the logs for more info`));
                            logs.exit.write(e2.stack);
                            logs.exit.write(-1);
                            this.bddTestIsNowDone(src, -1);
                            (0, utils_js_1.statusMessagePretty)(-1, src, "pure");
                            throw e2;
                        });
                    });
                }
                catch (e3) {
                    logs.writeExitCode(-1, e3);
                    console.log(ansi_colors_2.default.red(ansi_colors_2.default.inverse(`${src} 1 errored with: ${e3}. Check logs for more info`)));
                    logs.exit.write(e3.stack);
                    logs.exit.write("-1");
                    this.bddTestIsNowDone(src, -1);
                    (0, utils_js_1.statusMessagePretty)(-1, src, "pure");
                    throw e3;
                }
                finally {
                    for (let i = 0; i <= portsToUse.length; i++) {
                        if (portsToUse[i]) {
                            this.ports[portsToUse[i]] = ""; // port is open again
                        }
                    }
                }
            })();
            // Add to process manager
            this.addPromiseProcess(processId, purePromise, command, "bdd-test", src, "pure");
        };
        this.launchNode = async (src, dest) => {
            const processId = `node-${src}-${Date.now()}`;
            const command = `node test: ${src}`;
            // Create the promise
            const nodePromise = (async () => {
                this.bddTestIsRunning(src);
                const reportDest = `testeranto/reports/${this.name}/${src
                    .split(".")
                    .slice(0, -1)
                    .join(".")}/node`;
                if (!fs_1.default.existsSync(reportDest)) {
                    fs_1.default.mkdirSync(reportDest, { recursive: true });
                }
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
                        return [Math.random(), testResources];
                    }
                }
                else {
                    console.error("negative port makes no sense", src);
                    process.exit(-1);
                }
                const builtfile = dest;
                let haltReturns = false;
                const ipcfile = "/tmp/tpipe_" + Math.random();
                const child = (0, node_child_process_1.spawn)("node", [builtfile, testResources, ipcfile], {
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
                const logs = (0, utils_js_1.createLogStreams)(reportDest, "node");
                return new Promise((resolve, reject) => {
                    server.listen(ipcfile, () => {
                        var _a, _b;
                        (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                            var _a;
                            (_a = logs.stdout) === null || _a === void 0 ? void 0 : _a.write(data);
                        });
                        (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
                            var _a;
                            (_a = logs.stderr) === null || _a === void 0 ? void 0 : _a.write(data);
                        });
                        child.on("close", (code) => {
                            const exitCode = code === null ? -1 : code;
                            if (exitCode < 0) {
                                logs.writeExitCode(exitCode, new Error("Process crashed or was terminated"));
                            }
                            else {
                                logs.writeExitCode(exitCode);
                            }
                            logs.closeAll();
                            server.close();
                            if (exitCode === 255) {
                                console.log(ansi_colors_1.default.red(`node ! ${src} failed to execute. No "tests.json" file was generated. Check ${reportDest}/stderr.log for more info`));
                                this.bddTestIsNowDone(src, -1);
                                (0, utils_js_1.statusMessagePretty)(-1, src, "node");
                                reject(new Error(`Process exited with code ${exitCode}`));
                            }
                            else if (exitCode === 0) {
                                this.bddTestIsNowDone(src, 0);
                                (0, utils_js_1.statusMessagePretty)(0, src, "node");
                                resolve();
                            }
                            else {
                                this.bddTestIsNowDone(src, exitCode);
                                (0, utils_js_1.statusMessagePretty)(exitCode, src, "node");
                                reject(new Error(`Process exited with code ${exitCode}`));
                            }
                            haltReturns = true;
                        });
                        child.on("error", (e) => {
                            console.log("error");
                            haltReturns = true;
                            console.log(ansi_colors_2.default.red(ansi_colors_2.default.inverse(`${src} errored with: ${e.name}. Check error logs for more info`)));
                            this.bddTestIsNowDone(src, -1);
                            (0, utils_js_1.statusMessagePretty)(-1, src, "node");
                            reject(e);
                        });
                    });
                }).finally(() => {
                    for (let i = 0; i <= portsToUse.length; i++) {
                        if (portsToUse[i]) {
                            this.ports[portsToUse[i]] = ""; //port is open again
                        }
                    }
                });
            })();
            // Add to process manager
            this.addPromiseProcess(processId, nodePromise, command, "bdd-test", src, "node");
        };
        this.launchWeb = async (src, dest) => {
            const processId = `web-${src}-${Date.now()}`;
            const command = `web test: ${src}`;
            // Create the promise
            const webPromise = (async () => {
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
                const logs = (0, utils_js_1.createLogStreams)(reportDest, "web");
                return new Promise((resolve, reject) => {
                    this.browser
                        .newPage()
                        .then((page) => {
                        page.on("console", (log) => {
                            var _a, _b, _c, _d;
                            const msg = `${log.text()}\n`;
                            switch (log.type()) {
                                case "info":
                                    (_a = logs.info) === null || _a === void 0 ? void 0 : _a.write(msg);
                                    break;
                                case "warn":
                                    (_b = logs.warn) === null || _b === void 0 ? void 0 : _b.write(msg);
                                    break;
                                case "error":
                                    (_c = logs.error) === null || _c === void 0 ? void 0 : _c.write(msg);
                                    break;
                                case "debug":
                                    (_d = logs.debug) === null || _d === void 0 ? void 0 : _d.write(msg);
                                    break;
                                default:
                                    break;
                            }
                        });
                        page.on("close", () => {
                            logs.writeExitCode(0);
                            logs.closeAll();
                        });
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
                            delete files[src];
                            Promise.all(screenshots[src] || []).then(() => {
                                delete screenshots[src];
                                page.close();
                            });
                        };
                        page.on("pageerror", (err) => {
                            logs.writeExitCode(-1, err);
                            console.log(ansi_colors_1.default.red(`web ! ${src} failed to execute No "tests.json" file was generated. Check ${reportDest}/error.log for more info`));
                            this.bddTestIsNowDone(src, -1);
                            close();
                            reject(err);
                        });
                        await page.goto(`file://${`${destFolder}.html`}`, {});
                        await page
                            .evaluate((0, utils_1.webEvaluator)(d, webArgz))
                            .then(async ({ fails, failed, features }) => {
                            (0, utils_js_1.statusMessagePretty)(fails, src, "web");
                            this.bddTestIsNowDone(src, fails);
                            resolve();
                        })
                            .catch((e) => {
                            console.log(ansi_colors_2.default.red(ansi_colors_2.default.inverse(e.stack)));
                            console.log(ansi_colors_2.default.red(ansi_colors_2.default.inverse(`web ! ${src} failed to execute. No "tests.json" file was generated. Check logs for more info`)));
                            this.bddTestIsNowDone(src, -1);
                            reject(e);
                        })
                            .finally(() => {
                            close();
                        });
                    })
                        .catch((error) => {
                        reject(error);
                    });
                });
            })();
            // Add to process manager
            this.addPromiseProcess(processId, webPromise, command, "bdd-test", src, "web");
        };
        this.launchPython = async (src, dest) => {
            const processId = `python-${src}-${Date.now()}`;
            const command = `python test: ${src}`;
            const pythonPromise = (async () => {
                this.bddTestIsRunning(src);
                const reportDest = `testeranto/reports/${this.name}/${src
                    .split(".")
                    .slice(0, -1)
                    .join(".")}/python`;
                if (!fs_1.default.existsSync(reportDest)) {
                    fs_1.default.mkdirSync(reportDest, { recursive: true });
                }
                let testResources = "";
                const testConfig = this.configs.tests.find((t) => t[0] === src);
                if (!testConfig) {
                    console.log(ansi_colors_1.default.inverse(`missing test config! Exiting ungracefully for '${src}'`));
                    process.exit(-1);
                }
                const testConfigResource = testConfig[2];
                const portsToUse = [];
                if (testConfigResource.ports === 0) {
                    testResources = JSON.stringify({
                        scheduled: true,
                        name: src,
                        ports: portsToUse,
                        fs: reportDest,
                        browserWSEndpoint: this.browser.wsEndpoint(),
                    });
                }
                else if (testConfigResource.ports > 0) {
                    const openPorts = Object.entries(this.ports).filter(([, status]) => status === "");
                    if (openPorts.length >= testConfigResource.ports) {
                        for (let i = 0; i < testConfigResource.ports; i++) {
                            portsToUse.push(openPorts[i][0]);
                            this.ports[openPorts[i][0]] = src;
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
                        console.log(ansi_colors_1.default.red(`python: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again when a port is available`));
                        this.queue.push(src);
                        return;
                    }
                }
                else {
                    console.error("negative port makes no sense", src);
                    process.exit(-1);
                }
                const logs = (0, utils_js_1.createLogStreams)(reportDest, "python");
                // For Python, we'll just run the script directly and pass test resources as an argument
                // Python tests need to handle their own IPC if needed
                const child = (0, node_child_process_1.spawn)("python3", [src, testResources], {
                    stdio: ["pipe", "pipe", "pipe"],
                });
                return new Promise((resolve, reject) => {
                    var _a, _b;
                    (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                        var _a;
                        (_a = logs.stdout) === null || _a === void 0 ? void 0 : _a.write(data);
                    });
                    (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
                        var _a;
                        (_a = logs.stderr) === null || _a === void 0 ? void 0 : _a.write(data);
                    });
                    child.on("close", (code) => {
                        const exitCode = code === null ? -1 : code;
                        if (exitCode < 0) {
                            logs.writeExitCode(exitCode, new Error("Process crashed or was terminated"));
                        }
                        else {
                            logs.writeExitCode(exitCode);
                        }
                        logs.closeAll();
                        if (exitCode === 0) {
                            this.bddTestIsNowDone(src, 0);
                            (0, utils_js_1.statusMessagePretty)(0, src, "python");
                            resolve();
                        }
                        else {
                            console.log(ansi_colors_1.default.red(`python ! ${src} failed to execute. Check ${reportDest}/stderr.log for more info`));
                            this.bddTestIsNowDone(src, exitCode);
                            (0, utils_js_1.statusMessagePretty)(exitCode, src, "python");
                            reject(new Error(`Process exited with code ${exitCode}`));
                        }
                    });
                    child.on("error", (e) => {
                        console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`python: ${src} errored with: ${e.name}. Check error logs for more info`)));
                        this.bddTestIsNowDone(src, -1);
                        (0, utils_js_1.statusMessagePretty)(-1, src, "python");
                        reject(e);
                    });
                }).finally(() => {
                    portsToUse.forEach(port => {
                        this.ports[port] = "";
                    });
                });
            })();
            this.addPromiseProcess(processId, pythonPromise, command, "bdd-test", src, "python");
        };
        this.launchGolang = async (src, dest) => {
            const processId = `golang-${src}-${Date.now()}`;
            const command = `golang test: ${src}`;
            const golangPromise = (async () => {
                this.bddTestIsRunning(src);
                const reportDest = `testeranto/reports/${this.name}/${src
                    .split(".")
                    .slice(0, -1)
                    .join(".")}/golang`;
                if (!fs_1.default.existsSync(reportDest)) {
                    fs_1.default.mkdirSync(reportDest, { recursive: true });
                }
                let testResources = "";
                const testConfig = this.configs.tests.find((t) => t[0] === src);
                if (!testConfig) {
                    console.log(ansi_colors_1.default.inverse(`golang: missing test config! Exiting ungracefully for '${src}'`));
                    process.exit(-1);
                }
                const testConfigResource = testConfig[2];
                const portsToUse = [];
                if (testConfigResource.ports === 0) {
                    testResources = JSON.stringify({
                        scheduled: true,
                        name: src,
                        ports: portsToUse,
                        fs: reportDest,
                        browserWSEndpoint: this.browser.wsEndpoint(),
                    });
                }
                else if (testConfigResource.ports > 0) {
                    const openPorts = Object.entries(this.ports).filter(([, status]) => status === "");
                    if (openPorts.length >= testConfigResource.ports) {
                        for (let i = 0; i < testConfigResource.ports; i++) {
                            portsToUse.push(openPorts[i][0]);
                            this.ports[openPorts[i][0]] = src;
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
                        console.log(ansi_colors_1.default.red(`golang: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again when a port is available`));
                        this.queue.push(src);
                        return;
                    }
                }
                else {
                    console.error("negative port makes no sense", src);
                    process.exit(-1);
                }
                // Compile the Go test first
                const buildDir = path.dirname(dest);
                const binaryName = path.basename(dest, '.go');
                const binaryPath = path.join(buildDir, binaryName);
                const logs = (0, utils_js_1.createLogStreams)(reportDest, "golang");
                // First, compile the Go program
                const compileProcess = (0, node_child_process_1.spawn)("go", ["build", "-o", binaryPath, dest]);
                return new Promise((resolve, reject) => {
                    var _a, _b;
                    (_a = compileProcess.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                        var _a;
                        (_a = logs.stdout) === null || _a === void 0 ? void 0 : _a.write(data);
                    });
                    (_b = compileProcess.stderr) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
                        var _a;
                        (_a = logs.stderr) === null || _a === void 0 ? void 0 : _a.write(data);
                    });
                    compileProcess.on("close", (compileCode) => {
                        var _a, _b;
                        if (compileCode !== 0) {
                            console.log(ansi_colors_1.default.red(`golang ! ${src} failed to compile. Check ${reportDest}/stderr.log for more info`));
                            this.bddTestIsNowDone(src, compileCode || -1);
                            (0, utils_js_1.statusMessagePretty)(compileCode || -1, src, "golang");
                            reject(new Error(`Compilation failed with code ${compileCode}`));
                            return;
                        }
                        // Now run the compiled binary
                        const child = (0, node_child_process_1.spawn)(binaryPath, [testResources], {
                            stdio: ["pipe", "pipe", "pipe"],
                        });
                        (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                            var _a;
                            (_a = logs.stdout) === null || _a === void 0 ? void 0 : _a.write(data);
                        });
                        (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
                            var _a;
                            (_a = logs.stderr) === null || _a === void 0 ? void 0 : _a.write(data);
                        });
                        child.on("close", (code) => {
                            const exitCode = code === null ? -1 : code;
                            if (exitCode < 0) {
                                logs.writeExitCode(exitCode, new Error("Process crashed or was terminated"));
                            }
                            else {
                                logs.writeExitCode(exitCode);
                            }
                            logs.closeAll();
                            if (exitCode === 0) {
                                this.bddTestIsNowDone(src, 0);
                                (0, utils_js_1.statusMessagePretty)(0, src, "golang");
                                resolve();
                            }
                            else {
                                console.log(ansi_colors_1.default.red(`golang ! ${src} failed to execute. Check ${reportDest}/stderr.log for more info`));
                                this.bddTestIsNowDone(src, exitCode);
                                (0, utils_js_1.statusMessagePretty)(exitCode, src, "golang");
                                reject(new Error(`Process exited with code ${exitCode}`));
                            }
                        });
                        child.on("error", (e) => {
                            console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`golang: ${src} errored with: ${e.name}. Check error logs for more info`)));
                            this.bddTestIsNowDone(src, -1);
                            (0, utils_js_1.statusMessagePretty)(-1, src, "golang");
                            reject(e);
                        });
                    });
                    compileProcess.on("error", (e) => {
                        console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`golang: ${src} compilation errored with: ${e.name}. Check error logs for more info`)));
                        this.bddTestIsNowDone(src, -1);
                        (0, utils_js_1.statusMessagePretty)(-1, src, "golang");
                        reject(e);
                    });
                }).finally(() => {
                    portsToUse.forEach(port => {
                        this.ports[port] = "";
                    });
                });
            })();
            this.addPromiseProcess(processId, golangPromise, command, "bdd-test", src, "golang");
        };
    }
}
exports.PM_Main = PM_Main;
