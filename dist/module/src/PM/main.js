/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { spawn } from "node:child_process";
import ansiColors from "ansi-colors";
import net from "net";
import fs, { watch } from "fs";
import path from "path";
import puppeteer, { executablePath } from "puppeteer-core";
import ansiC from "ansi-colors";
import url from "url";
import mime from "mime-types";
import { getRunnables, webEvaluator } from "../utils";
import { Queue } from "../utils/queue.js";
import { PM_WithWebSocket } from "./PM_WithWebSocket.js";
import { fileHash, createLogStreams, statusMessagePretty, filesHash, isValidUrl, pollForFile, writeFileAndCreateDir, puppeteerConfigs, } from "./utils.js";
const changes = {};
const fileHashes = {};
const files = {};
const screenshots = {};
export class PM_Main extends PM_WithWebSocket {
    constructor(configs, name, mode) {
        super(configs, name, mode);
        this.logStreams = {};
        this.clients = new Set();
        this.runningProcesses = new Map();
        this.processLogs = new Map();
        this.allProcesses = new Map();
        this.launchPure = async (src, dest) => {
            console.log(ansiC.green(ansiC.inverse(`pure < ${src}`)));
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src
                .split(".")
                .slice(0, -1)
                .join(".")}/pure`;
            if (!fs.existsSync(reportDest)) {
                fs.mkdirSync(reportDest, { recursive: true });
            }
            const destFolder = dest.replace(".mjs", "");
            let argz = "";
            const testConfig = this.configs.tests.find((t) => {
                return t[0] === src;
            });
            if (!testConfig) {
                console.log(ansiC.inverse("missing test config! Exiting ungracefully!"));
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
            const logs = createLogStreams(reportDest, "pure");
            try {
                await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
                    return module.default
                        .then((defaultModule) => {
                        defaultModule
                            .receiveTestResourceConfig(argz)
                            .then(async (results) => {
                            statusMessagePretty(results.fails, src, "pure");
                            this.bddTestIsNowDone(src, results.fails);
                        })
                            .catch((e1) => {
                            console.log(ansiC.red(`launchPure - ${src} errored with: ${e1.stack}`));
                            this.bddTestIsNowDone(src, -1);
                            statusMessagePretty(-1, src, "pure");
                        });
                    })
                        .catch((e2) => {
                        console.log(ansiColors.red(`pure ! ${src} failed to execute. No "tests.json" file was generated. Check the logs for more info`));
                        logs.exit.write(e2.stack);
                        logs.exit.write(-1);
                        this.bddTestIsNowDone(src, -1);
                        statusMessagePretty(-1, src, "pure");
                    });
                });
            }
            catch (e3) {
                logs.writeExitCode(-1, e3);
                console.log(ansiC.red(ansiC.inverse(`${src} 1 errored with: ${e3}. Check logs for more info`)));
                logs.exit.write(e3.stack);
                logs.exit.write("-1");
                this.bddTestIsNowDone(src, -1);
                statusMessagePretty(-1, src, "pure");
            }
            for (let i = 0; i <= portsToUse.length; i++) {
                if (portsToUse[i]) {
                    this.ports[portsToUse[i]] = ""; // port is open again
                }
            }
        };
        this.launchNode = async (src, dest) => {
            console.log(ansiC.green(ansiC.inverse(`node < ${src}`)));
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src
                .split(".")
                .slice(0, -1)
                .join(".")}/node`;
            if (!fs.existsSync(reportDest)) {
                fs.mkdirSync(reportDest, { recursive: true });
            }
            let testResources = "";
            const testConfig = this.configs.tests.find((t) => {
                return t[0] === src;
            });
            if (!testConfig) {
                console.log(ansiC.inverse(`missing test config! Exiting ungracefully for '${src}'`));
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
                        portsToUse.push(openPorts[i][0]); // Convert string port to number
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
                    console.log(ansiC.red(`node: cannot run ${src} because there are no open ports ATM. This job will be enqueued and run again run a port is available`));
                    this.queue.push(src);
                    return [Math.random(), argz]; // Add this return
                }
            }
            else {
                console.error("negative port makes no sense", src);
                process.exit(-1);
            }
            const builtfile = dest;
            let haltReturns = false;
            const ipcfile = "/tmp/tpipe_" + Math.random();
            const child = spawn("node", [
                // "--inspect-brk",
                builtfile,
                testResources,
                ipcfile,
            ], {
                stdio: ["pipe", "pipe", "pipe", "ipc"],
            });
            let buffer = new Buffer("");
            const server = net.createServer((socket) => {
                const queue = new Queue();
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
            const logs = createLogStreams(reportDest, "node");
            server.listen(ipcfile, () => {
                var _a, _b;
                // Only handle stdout/stderr for node runtime
                (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                    var _a;
                    (_a = logs.stdout) === null || _a === void 0 ? void 0 : _a.write(data); // Add null check
                });
                (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
                    var _a;
                    (_a = logs.stderr) === null || _a === void 0 ? void 0 : _a.write(data); // Add null check
                });
                child.on("error", (err) => { });
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
                    if (!files[src]) {
                        files[src] = new Set();
                    }
                    if (exitCode === 255) {
                        console.log(ansiColors.red(`node ! ${src} failed to execute. No "tests.json" file was generated. Check ${reportDest}/stderr.log for more info`));
                        this.bddTestIsNowDone(src, -1);
                        statusMessagePretty(-1, src, "node");
                        return;
                    }
                    else if (exitCode === 0) {
                        this.bddTestIsNowDone(src, 0);
                        statusMessagePretty(0, src, "node");
                    }
                    else {
                        this.bddTestIsNowDone(src, exitCode);
                        statusMessagePretty(exitCode, src, "node");
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
                    console.log(ansiC.red(ansiC.inverse(`${src} errored with: ${e.name}. Check error logs for more info`)));
                    this.bddTestIsNowDone(src, -1);
                    statusMessagePretty(-1, src, "node");
                });
            });
        };
        this.launchWeb = async (src, dest) => {
            console.log(ansiC.green(ansiC.inverse(`web < ${src}`)));
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src
                .split(".")
                .slice(0, -1)
                .join(".")}/web`;
            if (!fs.existsSync(reportDest)) {
                fs.mkdirSync(reportDest, { recursive: true });
            }
            const destFolder = dest.replace(".mjs", "");
            const webArgz = JSON.stringify({
                name: src,
                ports: [].toString(),
                fs: reportDest,
                browserWSEndpoint: this.browser.wsEndpoint(),
            });
            const d = `${dest}?cacheBust=${Date.now()}`;
            const logs = createLogStreams(reportDest, "web");
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
                    logs.writeExitCode(0); // Web tests exit with 0 unless there's an error
                    logs.closeAll();
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
                    return;
                };
                page.on("pageerror", (err) => {
                    logs.writeExitCode(-1, err);
                    console.log(ansiColors.red(`web ! ${src} failed to execute No "tests.json" file was generated. Check ${reportDest}/error.log for more info`));
                    this.bddTestIsNowDone(src, -1);
                    close();
                });
                await page.goto(`file://${`${destFolder}.html`}`, {});
                await page
                    .evaluate(webEvaluator(d, webArgz))
                    .then(async ({ fails, failed, features }) => {
                    statusMessagePretty(fails, src, "web");
                    this.bddTestIsNowDone(src, fails);
                })
                    .catch((e) => {
                    console.log(ansiC.red(ansiC.inverse(e.stack)));
                    console.log(ansiC.red(ansiC.inverse(`web ! ${src} failed to execute. No "tests.json" file was generated. Check logs for more info`)));
                    this.bddTestIsNowDone(src, -1);
                })
                    .finally(() => {
                    close();
                });
                return page;
            });
        };
        this.launchPitono = async (src, dest) => {
            console.log(ansiC.green(ansiC.inverse(`pitono < ${src}`)));
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src
                .split(".")
                .slice(0, -1)
                .join(".")}/pitono`;
            if (!fs.existsSync(reportDest)) {
                fs.mkdirSync(reportDest, { recursive: true });
            }
            const logs = createLogStreams(reportDest, "node"); // Use node-style logs for pitono
            try {
                // Execute the Python test using the pitono runner
                const { PitonoRunner } = await import("./pitonoRunner");
                const runner = new PitonoRunner(this.configs, this.name);
                await runner.run();
                this.bddTestIsNowDone(src, 0);
                statusMessagePretty(0, src, "pitono");
            }
            catch (error) {
                logs.writeExitCode(-1, error);
                console.log(ansiC.red(ansiC.inverse(`${src} errored with: ${error}. Check logs for more info`)));
                this.bddTestIsNowDone(src, -1);
                statusMessagePretty(-1, src, "pitono");
            }
        };
        this.launchGolingvu = async (src, dest) => {
            throw "not yet implemented";
        };
        this.receiveFeaturesV2 = (reportDest, srcTest, platform) => {
            const featureDestination = path.resolve(process.cwd(), "reports", "features", "strings", srcTest.split(".").slice(0, -1).join(".") + ".features.txt");
            const testReportPath = `${reportDest}/tests.json`;
            if (!fs.existsSync(testReportPath)) {
                console.error(`tests.json not found at: ${testReportPath}`);
                return;
            }
            const testReport = JSON.parse(fs.readFileSync(testReportPath, "utf8"));
            // Add full path information to each test
            if (testReport.tests) {
                testReport.tests.forEach((test) => {
                    // Add the full path to each test
                    test.fullPath = path.resolve(process.cwd(), srcTest);
                });
            }
            // Add full path to the report itself
            testReport.fullPath = path.resolve(process.cwd(), srcTest);
            // Write the modified report back
            fs.writeFileSync(testReportPath, JSON.stringify(testReport, null, 2));
            testReport.features
                .reduce(async (mm, featureStringKey) => {
                const accum = await mm;
                const isUrl = isValidUrl(featureStringKey);
                if (isUrl) {
                    const u = new URL(featureStringKey);
                    if (u.protocol === "file:") {
                        const newPath = `${process.cwd()}/testeranto/features/internal/${path.relative(process.cwd(), u.pathname)}`;
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
                    await fs.promises.mkdir(path.dirname(featureDestination), {
                        recursive: true,
                    });
                    accum.strings.push(featureStringKey);
                }
                return accum;
            }, Promise.resolve({ files: [], strings: [] }))
                .then(({ files, strings }) => {
                // Markdown files must be referenced in the prompt but string style features are already present in the tests.json file
                fs.writeFileSync(`testeranto/reports/${this.name}/${srcTest
                    .split(".")
                    .slice(0, -1)
                    .join(".")}/${platform}/featurePrompt.txt`, files
                    .map((f) => {
                    return `/read ${f}`;
                })
                    .join("\n"));
            });
            testReport.givens.forEach((g) => {
                if (g.failed === true) {
                    this.summary[srcTest].failingFeatures[g.key] = g.features;
                }
            });
            this.writeBigBoard();
        };
        this.checkForShutdown = () => {
            this.checkQueue();
            console.log(ansiC.inverse(`The following jobs are awaiting resources: ${JSON.stringify(this.queue)}`));
            console.log(ansiC.inverse(`The status of ports: ${JSON.stringify(this.ports)}`));
            this.writeBigBoard();
            if (this.mode === "dev")
                return;
            let inflight = false;
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].prompt === "?") {
                    console.log(ansiC.blue(ansiC.inverse(`🕕 prompt ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].runTimeErrors === "?") {
                    console.log(ansiC.blue(ansiC.inverse(`🕕 runTimeError ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].staticErrors === "?") {
                    console.log(ansiC.blue(ansiC.inverse(`🕕 staticErrors ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].typeErrors === "?") {
                    console.log(ansiC.blue(ansiC.inverse(`🕕 typeErrors ${k}`)));
                    inflight = true;
                }
            });
            this.writeBigBoard();
            if (!inflight) {
                if (this.browser) {
                    if (this.browser) {
                        this.browser.disconnect().then(() => {
                            console.log(ansiC.inverse(`${this.name} has been tested. Goodbye.`));
                            process.exit();
                        });
                    }
                }
            }
        };
        this.launchers = {};
        this.ports = {};
        this.queue = [];
        // this.nodeSidecars = {};
        // this.webSidecars = {};
        // this.pureSidecars = {};
        this.configs.ports.forEach((element) => {
            this.ports[element] = ""; // set ports as open
        });
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
            // ["launchSideCar", this.launchSideCar.bind(this)],
            ["mkdirSync", this.mkdirSync],
            ["newPage", this.newPage],
            ["page", this.page],
            ["pages", this.pages],
            ["screencast", this.screencast],
            ["screencastStop", this.screencastStop],
            // ["stopSideCar", this.stopSideCar.bind(this)],
            ["typeInto", this.typeInto],
            ["waitForSelector", this.waitForSelector],
            ["write", this.write],
            ["writeFileSync", this.writeFileSync],
        ];
    }
    async start() {
        this.mapping().forEach(async ([command, func]) => {
            globalThis[command] = func;
        });
        if (!fs.existsSync(`testeranto/reports/${this.name}`)) {
            fs.mkdirSync(`testeranto/reports/${this.name}`);
        }
        try {
            this.browser = await puppeteer.launch(puppeteerConfigs);
        }
        catch (e) {
            console.error(e);
            console.error("could not start chrome via puppeter. Check this path: ", executablePath);
        }
        const { nodeEntryPoints, webEntryPoints, pureEntryPoints, pitonoEntryPoints, } = getRunnables(this.configs.tests, this.name);
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
            [
                pitonoEntryPoints,
                this.launchPitono,
                "pitono",
                (w) => {
                    this.pitonoMetafileWatcher = w;
                },
            ],
        ].forEach(async ([eps, launcher, runtime, watcher]) => {
            let metafile;
            if (runtime === "pitono") {
                metafile = `./testeranto/metafiles/python/core.json`;
                const metafileDir = path.dirname(metafile);
                if (!fs.existsSync(metafileDir)) {
                    fs.mkdirSync(metafileDir, { recursive: true });
                }
            }
            else {
                metafile = `./testeranto/metafiles/${runtime}/${this.name}.json`;
            }
            // Only poll for file if it's not a pitono runtime
            if (runtime !== "pitono") {
                await pollForFile(metafile);
            }
            Object.entries(eps).forEach(async ([inputFile, outputFile]) => {
                this.launchers[inputFile] = () => launcher(inputFile, outputFile);
                this.launchers[inputFile]();
                try {
                    watch(outputFile, async (e, filename) => {
                        const hash = await fileHash(outputFile);
                        if (fileHashes[inputFile] !== hash) {
                            fileHashes[inputFile] = hash;
                            console.log(ansiC.yellow(ansiC.inverse(`< ${e} ${filename}`)));
                            this.launchers[inputFile]();
                        }
                    });
                }
                catch (e) {
                    console.error(e);
                }
            });
            this.metafileOutputs(runtime);
            // For pitono, we need to wait for the file to be created
            if (runtime === "pitono") {
                // Use polling to wait for the file to exist
                const checkFileExists = () => {
                    if (fs.existsSync(metafile)) {
                        console.log(ansiC.green(ansiC.inverse(`Pitono metafile found: ${metafile}`)));
                        // Set up the watcher once the file exists
                        watcher(watch(metafile, async (e, filename) => {
                            console.log(ansiC.yellow(ansiC.inverse(`< ${e} ${filename} (${runtime})`)));
                            this.metafileOutputs(runtime);
                        }));
                        // Read the metafile immediately
                        this.metafileOutputs(runtime);
                    }
                    else {
                        // Check again after a delay
                        setTimeout(checkFileExists, 1000);
                    }
                };
                // Start checking for the file
                checkFileExists();
            }
            else {
                // For other runtimes, only set up watcher if the file exists
                if (fs.existsSync(metafile)) {
                    watcher(watch(metafile, async (e, filename) => {
                        console.log(ansiC.yellow(ansiC.inverse(`< ${e} ${filename} (${runtime})`)));
                        this.metafileOutputs(runtime);
                    }));
                }
            }
        });
    }
    async stop() {
        console.log(ansiC.inverse("Testeranto-Run is shutting down gracefully..."));
        this.mode = "once";
        this.nodeMetafileWatcher.close();
        this.webMetafileWatcher.close();
        this.importMetafileWatcher.close();
        if (this.pitonoMetafileWatcher) {
            this.pitonoMetafileWatcher.close();
        }
        Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());
        this.wss.close(() => {
            console.log("WebSocket server closed");
        });
        this.clients.forEach((client) => {
            client.terminate();
        });
        this.clients.clear();
        this.httpServer.close(() => {
            console.log("HTTP server closed");
        });
        this.checkForShutdown();
    }
    async metafileOutputs(platform) {
        let metafilePath;
        if (platform === "pitono") {
            metafilePath = `./testeranto/metafiles/python/core.json`;
        }
        else {
            metafilePath = `./testeranto/metafiles/${platform}/${this.name}.json`;
        }
        // Check if the file exists
        if (!fs.existsSync(metafilePath)) {
            if (platform === "pitono") {
                console.log(ansiC.yellow(ansiC.inverse(`Pitono metafile not found yet: ${metafilePath}`)));
            }
            return;
        }
        let metafile;
        try {
            const fileContent = fs.readFileSync(metafilePath).toString();
            const parsedData = JSON.parse(fileContent);
            // Handle different metafile structures
            if (platform === "pitono") {
                // Pitono metafile might be the entire content or have a different structure
                metafile = parsedData.metafile || parsedData;
            }
            else {
                metafile = parsedData.metafile;
            }
            if (!metafile) {
                console.log(ansiC.yellow(ansiC.inverse(`No metafile found in ${metafilePath}`)));
                return;
            }
        }
        catch (error) {
            console.error(`Error reading metafile at ${metafilePath}:`, error);
            return;
        }
        const outputs = metafile.outputs;
        Object.keys(outputs).forEach(async (k) => {
            const pattern = `testeranto/bundles/${platform}/${this.name}/${this.configs.src}`;
            if (!k.startsWith(pattern)) {
                return false;
            }
            const addableFiles = Object.keys(outputs[k].inputs).filter((i) => {
                if (!fs.existsSync(i))
                    return false;
                if (i.startsWith("node_modules"))
                    return false;
                if (i.startsWith("./node_modules"))
                    return false;
                return true;
            });
            const f = `${k.split(".").slice(0, -1).join(".")}/`;
            if (!fs.existsSync(f)) {
                fs.mkdirSync(f);
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
    // this method is so horrible. Don't drink and vibe-code kids
    requestHandler(req, res) {
        const parsedUrl = url.parse(req.url || "/");
        let pathname = parsedUrl.pathname || "/";
        if (pathname === "/") {
            pathname = "/index.html";
        }
        let filePath = pathname.substring(1);
        // Determine which directory to serve from
        if (filePath.startsWith("reports/")) {
            filePath = `testeranto/${filePath}`;
        }
        else if (filePath.startsWith("metafiles/")) {
            filePath = `testeranto/${filePath}`;
        }
        else if (filePath === "projects.json") {
            filePath = `testeranto/${filePath}`;
        }
        else {
            // For frontend assets, try multiple possible locations
            // First, try the dist directory
            const possiblePaths = [
                `dist/${filePath}`,
                `testeranto/dist/${filePath}`,
                `../dist/${filePath}`,
                `./${filePath}`,
            ];
            // Find the first existing file
            let foundPath = null;
            for (const possiblePath of possiblePaths) {
                if (fs.existsSync(possiblePath)) {
                    foundPath = possiblePath;
                    break;
                }
            }
            if (foundPath) {
                filePath = foundPath;
            }
            else {
                // If no file found, serve index.html for SPA routing
                const indexPath = this.findIndexHtml();
                if (indexPath) {
                    fs.readFile(indexPath, (err, data) => {
                        if (err) {
                            res.writeHead(404, { "Content-Type": "text/plain" });
                            res.end("404 Not Found");
                            return;
                        }
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(data);
                    });
                    return;
                }
                else {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("404 Not Found");
                    return;
                }
            }
        }
        // Check if file exists
        fs.exists(filePath, (exists) => {
            if (!exists) {
                // For SPA routing, serve index.html if the path looks like a route
                if (!pathname.includes(".") && pathname !== "/") {
                    const indexPath = this.findIndexHtml();
                    if (indexPath) {
                        fs.readFile(indexPath, (err, data) => {
                            if (err) {
                                res.writeHead(404, { "Content-Type": "text/plain" });
                                res.end("404 Not Found");
                                return;
                            }
                            res.writeHead(200, { "Content-Type": "text/html" });
                            res.end(data);
                        });
                        return;
                    }
                    else {
                        // Serve a simple message if index.html is not found
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(`
              <html>
                <body>
                  <h1>Testeranto is running</h1>
                  <p>Frontend files are not built yet. Run 'npm run build' to build the frontend.</p>
                </body>
              </html>
            `);
                        return;
                    }
                }
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 Not Found");
                return;
            }
            // Read and serve the file
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("500 Internal Server Error");
                    return;
                }
                // Get MIME type
                const mimeType = mime.lookup(filePath) || "application/octet-stream";
                res.writeHead(200, { "Content-Type": mimeType });
                res.end(data);
            });
        });
    }
    // this method is also horrible
    findIndexHtml() {
        const possiblePaths = [
            "dist/index.html",
            "testeranto/dist/index.html",
            "../dist/index.html",
            "./index.html",
        ];
        for (const path of possiblePaths) {
            if (fs.existsSync(path)) {
                return path;
            }
        }
        return null;
    }
    broadcast(message) {
        const data = typeof message === "string" ? message : JSON.stringify(message);
        this.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(data);
            }
        });
    }
    checkQueue() {
        const x = this.queue.pop();
        if (!x) {
            ansiC.inverse(`The following queue is empty`);
            return;
        }
        const test = this.configs.tests.find((t) => t[0] === x);
        if (!test)
            throw `test is undefined ${x}`;
        this.launchers[test[0]]();
    }
}
