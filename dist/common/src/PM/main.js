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
const PM_WithHelpo_js_1 = require("./PM_WithHelpo.js");
const node_path_1 = __importDefault(require("node:path"));
const files = {};
const screenshots = {};
class PM_Main extends PM_WithHelpo_js_1.PM_WithHelpo {
    constructor() {
        super(...arguments);
        this.launchPure = async (src, dest) => {
            console.log(ansi_colors_2.default.green(ansi_colors_2.default.inverse(`pure < ${src}`)));
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
                                // Ensure the test results are properly processed
                                // The receiveTestResourceConfig should handle creating tests.json
                                (0, utils_js_1.statusMessagePretty)(results.fails, src, "pure");
                                this.bddTestIsNowDone(src, results.fails);
                                return results.fails;
                            });
                        })
                            .catch((e2) => {
                            console.log(ansi_colors_1.default.red(`pure ! ${src} failed to execute. No "tests.json" file was generated. Check the logs for more info`));
                            // Create a minimal tests.json even on failure
                            const testsJsonPath = `${reportDest}/tests.json`;
                            if (!fs_1.default.existsSync(testsJsonPath)) {
                                fs_1.default.writeFileSync(testsJsonPath, JSON.stringify({
                                    tests: [],
                                    features: [],
                                    givens: [],
                                    fullPath: src,
                                }, null, 2));
                            }
                            logs.exit.write(e2.stack);
                            logs.exit.write(-1);
                            this.bddTestIsNowDone(src, -1);
                            (0, utils_js_1.statusMessagePretty)(-1, src, "pure");
                            throw e2;
                        });
                    });
                }
                catch (e3) {
                    // Create a minimal tests.json even on uncaught errors
                    const testsJsonPath = `${reportDest}/tests.json`;
                    if (!fs_1.default.existsSync(testsJsonPath)) {
                        fs_1.default.writeFileSync(testsJsonPath, JSON.stringify({
                            tests: [],
                            features: [],
                            givens: [],
                            fullPath: src,
                        }, null, 2));
                    }
                    logs.writeExitCode(-1, e3);
                    console.log(ansi_colors_2.default.red(ansi_colors_2.default.inverse(`${src} 1 errored with: ${e3}. Check logs for more info`)));
                    logs.exit.write(e3.stack);
                    logs.exit.write("-1");
                    this.bddTestIsNowDone(src, -1);
                    (0, utils_js_1.statusMessagePretty)(-1, src, "pure");
                    throw e3;
                }
                finally {
                    // Generate prompt files for Pure tests
                    await this.generatePromptFiles(reportDest, src);
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
            console.log(ansi_colors_2.default.green(ansi_colors_2.default.inverse(`node < ${src}`)));
            const processId = `node-${src}-${Date.now()}`;
            const command = `node test: ${src}`;
            const nodePromise = (async () => {
                try {
                    const { reportDest, testResources, portsToUse } = await this.setupTestEnvironment(src, "node");
                    const builtfile = dest;
                    const ipcfile = "/tmp/tpipe_" + Math.random();
                    const logs = (0, utils_js_1.createLogStreams)(reportDest, "node");
                    let buffer = Buffer.from("");
                    const queue = new queue_js_1.Queue();
                    const onData = (data) => {
                        buffer = Buffer.concat([buffer, data]);
                        // Process complete JSON messages
                        for (let b = 0; b < buffer.length + 1; b++) {
                            const c = buffer.slice(0, b);
                            try {
                                const d = JSON.parse(c.toString());
                                queue.enqueue(d);
                                buffer = buffer.slice(b);
                                b = 0;
                            }
                            catch (e) {
                                // Continue processing
                            }
                        }
                        // Process messages
                        while (queue.size() > 0) {
                            const message = queue.dequeue();
                            if (message) {
                                this.mapping().forEach(async ([command, func]) => {
                                    if (message[0] === command) {
                                        const args = message.slice(1, -1);
                                        try {
                                            const result = await this[command](...args);
                                            child.send(JSON.stringify({
                                                payload: result,
                                                key: message[message.length - 1],
                                            }));
                                        }
                                        catch (error) {
                                            console.error(`Error handling command ${command}:`, error);
                                        }
                                    }
                                });
                            }
                        }
                    };
                    const server = await this.createIpcServer(onData, ipcfile);
                    const child = (0, node_child_process_1.spawn)("node", [builtfile, testResources, ipcfile], {
                        stdio: ["pipe", "pipe", "pipe", "ipc"],
                    });
                    try {
                        await this.handleChildProcess(child, logs, reportDest, src, "node");
                        // Generate prompt files for Node tests
                        await this.generatePromptFiles(reportDest, src);
                    }
                    finally {
                        server.close();
                        this.cleanupPorts(portsToUse);
                    }
                }
                catch (error) {
                    if (error.message !== "No ports available") {
                        throw error;
                    }
                }
            })();
            this.addPromiseProcess(processId, nodePromise, command, "bdd-test", src, "node");
        };
        this.launchWeb = async (src, dest) => {
            console.log(ansi_colors_2.default.green(ansi_colors_2.default.inverse(`web < ${src}`)));
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
                            // Create a minimal tests.json even on failure
                            const testsJsonPath = `${reportDest}/tests.json`;
                            if (!fs_1.default.existsSync(testsJsonPath)) {
                                fs_1.default.writeFileSync(testsJsonPath, JSON.stringify({
                                    tests: [],
                                    features: [],
                                    givens: [],
                                    fullPath: src,
                                }, null, 2));
                            }
                            this.bddTestIsNowDone(src, -1);
                            reject(e);
                        })
                            .finally(async () => {
                            // Generate prompt files for Web tests
                            await this.generatePromptFiles(reportDest, src);
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
            console.log(ansi_colors_2.default.green(ansi_colors_2.default.inverse(`python < ${src}`)));
            const processId = `python-${src}-${Date.now()}`;
            const command = `python test: ${src}`;
            const pythonPromise = (async () => {
                try {
                    const { reportDest, testResources, portsToUse } = await this.setupTestEnvironment(src, "python");
                    const logs = (0, utils_js_1.createLogStreams)(reportDest, "python");
                    // Determine Python command
                    const venvPython = `./venv/bin/python3`;
                    const pythonCommand = fs_1.default.existsSync(venvPython)
                        ? venvPython
                        : "python3";
                    const ipcfile = "/tmp/tpipe_python_" + Math.random();
                    const child = (0, node_child_process_1.spawn)(pythonCommand, [src, testResources, ipcfile], {
                        stdio: ["pipe", "pipe", "pipe", "ipc"],
                    });
                    // IPC server setup is similar to Node
                    let buffer = Buffer.from("");
                    const queue = new queue_js_1.Queue();
                    const onData = (data) => {
                        buffer = Buffer.concat([buffer, data]);
                        for (let b = 0; b < buffer.length + 1; b++) {
                            const c = buffer.slice(0, b);
                            try {
                                const d = JSON.parse(c.toString());
                                queue.enqueue(d);
                                buffer = buffer.slice(b);
                                b = 0;
                            }
                            catch (e) {
                                // Continue processing
                            }
                        }
                        while (queue.size() > 0) {
                            const message = queue.dequeue();
                            if (message) {
                                this.mapping().forEach(async ([command, func]) => {
                                    if (message[0] === command) {
                                        const args = message.slice(1, -1);
                                        try {
                                            const result = await this[command](...args);
                                            child.send(JSON.stringify({
                                                payload: result,
                                                key: message[message.length - 1],
                                            }));
                                        }
                                        catch (error) {
                                            console.error(`Error handling command ${command}:`, error);
                                        }
                                    }
                                });
                            }
                        }
                    };
                    const server = await this.createIpcServer(onData, ipcfile);
                    try {
                        await this.handleChildProcess(child, logs, reportDest, src, "python");
                        // Generate prompt files for Python tests
                        await this.generatePromptFiles(reportDest, src);
                    }
                    finally {
                        server.close();
                        this.cleanupPorts(portsToUse);
                    }
                }
                catch (error) {
                    if (error.message !== "No ports available") {
                        throw error;
                    }
                }
            })();
            this.addPromiseProcess(processId, pythonPromise, command, "bdd-test", src, "python");
        };
        this.launchGolang = async (src, dest) => {
            console.log(ansi_colors_2.default.green(ansi_colors_2.default.inverse(`goland < ${src}`)));
            const processId = `golang-${src}-${Date.now()}`;
            const command = `golang test: ${src}`;
            const golangPromise = (async () => {
                try {
                    const { reportDest, testResources, portsToUse } = await this.setupTestEnvironment(src, "golang");
                    const logs = (0, utils_js_1.createLogStreams)(reportDest, "golang");
                    // Create IPC file path
                    const ipcfile = "/tmp/tpipe_golang_" + Math.random().toString(36).substring(2);
                    let buffer = Buffer.from("");
                    const queue = new queue_js_1.Queue();
                    const onData = (data) => {
                        buffer = Buffer.concat([buffer, data]);
                        // Process complete JSON messages
                        for (let b = 0; b < buffer.length + 1; b++) {
                            const c = buffer.slice(0, b);
                            try {
                                const d = JSON.parse(c.toString());
                                queue.enqueue(d);
                                buffer = buffer.slice(b);
                                b = 0;
                            }
                            catch (e) {
                                // Continue processing
                            }
                        }
                        // Process messages
                        while (queue.size() > 0) {
                            const message = queue.dequeue();
                            if (message) {
                                this.mapping().forEach(async ([command, func]) => {
                                    if (message[0] === command) {
                                        const args = message.slice(1, -1);
                                        try {
                                            const result = await this[command](...args);
                                            // Send response back through IPC
                                            // This would need to be implemented based on your IPC protocol
                                        }
                                        catch (error) {
                                            console.error(`Error handling command ${command}:`, error);
                                        }
                                    }
                                });
                            }
                        }
                    };
                    // Create IPC server like in launchNode
                    const server = await this.createIpcServer(onData, ipcfile);
                    // For Go tests, we need to run from the directory containing the go.mod file
                    // Find the nearest go.mod file by walking up the directory tree
                    let currentDir = node_path_1.default.dirname(src);
                    let goModDir = null;
                    while (currentDir !== node_path_1.default.parse(currentDir).root) {
                        if (fs_1.default.existsSync(node_path_1.default.join(currentDir, "go.mod"))) {
                            goModDir = currentDir;
                            break;
                        }
                        currentDir = node_path_1.default.dirname(currentDir);
                    }
                    if (!goModDir) {
                        console.error(`Could not find go.mod file for test ${src}`);
                        // Try running from the test file's directory as a fallback
                        goModDir = node_path_1.default.dirname(src);
                        console.error(`Falling back to: ${goModDir}`);
                    }
                    // Get the relative path to the test file from the go.mod directory
                    const relativeTestPath = node_path_1.default.relative(goModDir, src);
                    // Run go test from the directory containing go.mod
                    const child = (0, node_child_process_1.spawn)("go", ["test", "-v", "-json", "./" + node_path_1.default.dirname(relativeTestPath)], {
                        stdio: ["pipe", "pipe", "pipe"],
                        env: Object.assign(Object.assign({}, process.env), { TEST_RESOURCES: testResources, IPC_FILE: ipcfile, GO111MODULE: "on" }),
                        cwd: goModDir,
                    });
                    await this.handleChildProcess(child, logs, reportDest, src, "golang");
                    // Generate prompt files for Golang tests
                    await this.generatePromptFiles(reportDest, src);
                    // Ensure tests.json exists by parsing the go test JSON output
                    await this.processGoTestOutput(reportDest, src);
                    // Clean up
                    server.close();
                    try {
                        fs_1.default.unlinkSync(ipcfile);
                    }
                    catch (e) {
                        // Ignore errors during cleanup
                    }
                    this.cleanupPorts(portsToUse);
                }
                catch (error) {
                    if (error.message !== "No ports available") {
                        throw error;
                    }
                }
            })();
            this.addPromiseProcess(processId, golangPromise, command, "bdd-test", src, "golang");
        };
    }
    async setupTestEnvironment(src, runtime) {
        this.bddTestIsRunning(src);
        const reportDest = `testeranto/reports/${this.name}/${src
            .split(".")
            .slice(0, -1)
            .join(".")}/${runtime}`;
        if (!fs_1.default.existsSync(reportDest)) {
            fs_1.default.mkdirSync(reportDest, { recursive: true });
        }
        const testConfig = this.configs.tests.find((t) => t[0] === src);
        if (!testConfig) {
            console.log(ansi_colors_2.default.inverse(`missing test config! Exiting ungracefully for '${src}'`));
            process.exit(-1);
        }
        const testConfigResource = testConfig[2];
        const portsToUse = [];
        let testResources = "";
        if (testConfigResource.ports === 0) {
            testResources = JSON.stringify({
                name: src,
                ports: [],
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
                console.log(ansi_colors_2.default.red(`${runtime}: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again when a port is available`));
                this.queue.push(src);
                throw new Error("No ports available");
            }
        }
        else {
            console.error("negative port makes no sense", src);
            process.exit(-1);
        }
        return {
            reportDest,
            testConfig,
            testConfigResource,
            portsToUse,
            testResources,
        };
    }
    cleanupPorts(portsToUse) {
        portsToUse.forEach((port) => {
            this.ports[port] = "";
        });
    }
    createIpcServer(onData, ipcfile) {
        return new Promise((resolve, reject) => {
            const server = net_1.default.createServer((socket) => {
                socket.on("data", onData);
            });
            server.listen(ipcfile, (err) => {
                if (err)
                    reject(err);
                else
                    resolve(server);
            });
            server.on("error", reject);
        });
    }
    handleChildProcess(child, logs, reportDest, src, runtime) {
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
                    (0, utils_js_1.statusMessagePretty)(0, src, runtime);
                    resolve();
                }
                else {
                    console.log(ansi_colors_1.default.red(`${runtime} ! ${src} failed to execute. Check ${reportDest}/stderr.log for more info`));
                    this.bddTestIsNowDone(src, exitCode);
                    (0, utils_js_1.statusMessagePretty)(exitCode, src, runtime);
                    reject(new Error(`Process exited with code ${exitCode}`));
                }
            });
            child.on("error", (e) => {
                console.log(ansi_colors_2.default.red(ansi_colors_2.default.inverse(`${src} errored with: ${e.name}. Check error logs for more info`)));
                this.bddTestIsNowDone(src, -1);
                (0, utils_js_1.statusMessagePretty)(-1, src, runtime);
                reject(e);
            });
        });
    }
    async processGoTestOutput(reportDest, src) {
        const testsJsonPath = `${reportDest}/tests.json`;
        // Parse the stdout.log to extract test results from JSON output
        const stdoutPath = `${reportDest}/stdout.log`;
        if (fs_1.default.existsSync(stdoutPath)) {
            try {
                const stdoutContent = fs_1.default.readFileSync(stdoutPath, "utf-8");
                const lines = stdoutContent.split("\n").filter((line) => line.trim());
                const testResults = {
                    tests: [],
                    features: [],
                    givens: [],
                    fullPath: node_path_1.default.resolve(process.cwd(), src),
                };
                // Parse each JSON line from go test output
                for (const line of lines) {
                    try {
                        const event = JSON.parse(line);
                        if (event.Action === "pass" || event.Action === "fail") {
                            testResults.tests.push({
                                name: event.Test || event.Package,
                                status: event.Action === "pass" ? "passed" : "failed",
                                time: event.Elapsed ? `${event.Elapsed}s` : "0s",
                            });
                        }
                    }
                    catch (e) {
                        // Skip non-JSON lines
                    }
                }
                fs_1.default.writeFileSync(testsJsonPath, JSON.stringify(testResults, null, 2));
                return;
            }
            catch (error) {
                console.error("Error processing go test output:", error);
            }
        }
        // Fallback: create a basic tests.json if processing fails
        const basicTestResult = {
            tests: [],
            features: [],
            givens: [],
            fullPath: node_path_1.default.resolve(process.cwd(), src),
        };
        fs_1.default.writeFileSync(testsJsonPath, JSON.stringify(basicTestResult, null, 2));
    }
    async generatePromptFiles(reportDest, src) {
        try {
            // Ensure the report directory exists
            if (!fs_1.default.existsSync(reportDest)) {
                fs_1.default.mkdirSync(reportDest, { recursive: true });
            }
            // Create message.txt
            const messagePath = `${reportDest}/message.txt`;
            const messageContent = `There are 3 types of test reports.
1) bdd (highest priority)
2) type checker
3) static analysis (lowest priority)

"tests.json" is the detailed result of the bdd tests.
if these files do not exist, then something has gone badly wrong and needs to be addressed.

"type_errors.txt" is the result of the type checker.
if this file does not exist, then type check passed without errors;

"lint_errors.txt" is the result of the static analysis.
if this file does not exist, then static analysis passed without errors;

BDD failures are the highest priority. Focus on passing BDD tests before addressing other concerns.
Do not add error throwing/catching to the tests themselves.`;
            fs_1.default.writeFileSync(messagePath, messageContent);
            // Create prompt.txt
            const promptPath = `${reportDest}/prompt.txt`;
            const promptContent = `/read node_modules/testeranto/docs/index.md
/read node_modules/testeranto/docs/style.md
/read node_modules/testeranto/docs/testing.ai.txt
/read node_modules/testeranto/src/CoreTypes.ts

/read ${reportDest}/tests.json
/read ${reportDest}/type_errors.txt
/read ${reportDest}/lint_errors.txt

/read ${reportDest}/stdout.log
/read ${reportDest}/stderr.log
/read ${reportDest}/exit.log
/read ${reportDest}/message.txt`;
            fs_1.default.writeFileSync(promptPath, promptContent);
        }
        catch (error) {
            console.error(`Failed to generate prompt files for ${src}:`, error);
        }
    }
    getGolangSourceFiles(src) {
        // Get all .go files in the same directory as the test
        const testDir = node_path_1.default.dirname(src);
        const files = [];
        try {
            const dirContents = fs_1.default.readdirSync(testDir);
            dirContents.forEach((file) => {
                if (file.endsWith(".go")) {
                    files.push(node_path_1.default.join(testDir, file));
                }
            });
        }
        catch (error) {
            console.error(`Error reading directory ${testDir}:`, error);
        }
        // Always include the main test file
        if (!files.includes(src)) {
            files.push(src);
        }
        return files;
    }
}
exports.PM_Main = PM_Main;
