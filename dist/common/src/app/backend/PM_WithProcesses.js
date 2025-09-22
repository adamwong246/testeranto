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
exports.PM_WithProcesses = void 0;
const fs_1 = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const puppeteer_core_1 = __importStar(require("puppeteer-core"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const utils_js_1 = require("../../PM/utils.js");
const utils_js_2 = require("./utils.js");
const PM_WithTCP_js_1 = require("./PM_WithTCP.js");
const makePrompt_js_1 = require("./makePrompt.js");
const changes = {};
class PM_WithProcesses extends PM_WithTCP_js_1.PM_WithTCP {
    constructor(configs, name, mode) {
        super(configs, name, mode);
        this.summary = {};
        this.logStreams = {};
        this.writeBigBoard = () => {
            // note: this path is different from the one used by front end
            const summaryPath = `./testeranto/reports/${this.projectName}/summary.json`;
            const summaryData = JSON.stringify(this.summary, null, 2);
            fs_1.default.writeFileSync(summaryPath, summaryData);
            // Broadcast the update
            this.webSocketBroadcastMessage({
                type: "summaryUpdate",
                data: this.summary,
            });
        };
        this.receiveFeaturesV2 = (reportDest, srcTest, platform) => {
            const featureDestination = path_1.default.resolve(process.cwd(), "reports", "features", "strings", srcTest.split(".").slice(0, -1).join(".") + ".features.txt");
            const testReportPath = `${reportDest}/tests.json`;
            if (!fs_1.default.existsSync(testReportPath)) {
                console.error(`tests.json not found at: ${testReportPath}`);
                return;
            }
            const testReport = JSON.parse(fs_1.default.readFileSync(testReportPath, "utf8"));
            // Add full path information to each test
            if (testReport.tests) {
                testReport.tests.forEach((test) => {
                    // Add the full path to each test
                    test.fullPath = path_1.default.resolve(process.cwd(), srcTest);
                });
            }
            // Add full path to the report itself
            testReport.fullPath = path_1.default.resolve(process.cwd(), srcTest);
            // Write the modified report back
            fs_1.default.writeFileSync(testReportPath, JSON.stringify(testReport, null, 2));
            testReport.features
                .reduce(async (mm, featureStringKey) => {
                const accum = await mm;
                const isUrl = (0, utils_js_1.isValidUrl)(featureStringKey);
                if (isUrl) {
                    const u = new URL(featureStringKey);
                    if (u.protocol === "file:") {
                        accum.files.push(u.pathname);
                    }
                    else if (u.protocol === "http:" || u.protocol === "https:") {
                        const newPath = `${process.cwd()}/testeranto/features/external/${u.hostname}${u.pathname}`;
                        const body = await this.configs.featureIngestor(featureStringKey);
                        (0, utils_js_1.writeFileAndCreateDir)(newPath, body);
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
                .then(({ files }) => {
                // Markdown files must be referenced in the prompt but string style features are already present in the tests.json file
                fs_1.default.writeFileSync(`testeranto/reports/${this.projectName}/${srcTest
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
                    // @ts-ignore
                    this.summary[srcTest].failingFeatures[g.key] = g.features;
                }
            });
            this.writeBigBoard();
        };
        // onBuildDone(): void {
        //   console.log("Build processes completed");
        //   // The builds are done, which means the files are ready to be watched
        //   // This matches the original behavior where builds completed before PM_Main started
        //   // Start Git watcher for development mode
        //   this.startGitWatcher();
        // }
        this.checkForShutdown = () => {
            this.checkQueue();
            console.log(ansi_colors_1.default.inverse(`The following jobs are awaiting resources: ${JSON.stringify(this.queue)}`));
            console.log(ansi_colors_1.default.inverse(`The status of ports: ${JSON.stringify(this.ports)}`));
            this.writeBigBoard();
            if (this.mode === "dev")
                return;
            let inflight = false;
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].prompt === "?") {
                    console.log(ansi_colors_1.default.blue(ansi_colors_1.default.inverse(`🕕 prompt ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].runTimeErrors === "?") {
                    console.log(ansi_colors_1.default.blue(ansi_colors_1.default.inverse(`🕕 runTimeError ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].staticErrors === "?") {
                    console.log(ansi_colors_1.default.blue(ansi_colors_1.default.inverse(`🕕 staticErrors ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.summary).forEach((k) => {
                if (this.summary[k].typeErrors === "?") {
                    console.log(ansi_colors_1.default.blue(ansi_colors_1.default.inverse(`🕕 typeErrors ${k}`)));
                    inflight = true;
                }
            });
            this.writeBigBoard();
            if (!inflight) {
                if (this.browser) {
                    if (this.browser) {
                        this.browser.disconnect().then(() => {
                            console.log(ansi_colors_1.default.inverse(`${this.projectName} has been tested. Goodbye.`));
                            process.exit();
                        });
                    }
                }
            }
        };
        this.configs.tests.forEach(([t, rt, tr, sidecars]) => {
            this.ensureSummaryEntry(t);
            sidecars.forEach(([sidecarName]) => {
                this.ensureSummaryEntry(sidecarName, true);
            });
        });
        this.launchers = {};
        this.ports = {};
        this.queue = [];
        this.configs.ports.forEach((element) => {
            this.ports[element] = ""; // set ports as open
        });
    }
    addPromiseProcess(processId, promise, command, category = "other", testName, platform, onResolve, onReject) {
        this.runningProcesses.set(processId, promise);
        this.allProcesses.set(processId, {
            promise,
            status: "running",
            command,
            timestamp: new Date().toISOString(),
            type: "promise",
            category,
            testName,
            platform,
        });
        // Initialize logs for this process
        this.processLogs.set(processId, []);
        const startMessage = `Starting: ${command}`;
        const logs = this.processLogs.get(processId) || [];
        logs.push(startMessage);
        this.processLogs.set(processId, logs);
        this.webSocketBroadcastMessage({
            type: "processStarted",
            processId,
            command,
            timestamp: new Date().toISOString(),
            logs: [startMessage],
        });
        promise
            .then((result) => {
            this.runningProcesses.delete(processId);
            const processInfo = this.allProcesses.get(processId);
            if (processInfo) {
                this.allProcesses.set(processId, Object.assign(Object.assign({}, processInfo), { status: "completed", exitCode: 0 }));
            }
            // Add log entry for process completion
            const successMessage = `Completed successfully with result: ${JSON.stringify(result)}`;
            const currentLogs = this.processLogs.get(processId) || [];
            currentLogs.push(successMessage);
            this.processLogs.set(processId, currentLogs);
            this.webSocketBroadcastMessage({
                type: "processExited",
                processId,
                exitCode: 0,
                timestamp: new Date().toISOString(),
                logs: [successMessage],
            });
            if (onResolve)
                onResolve(result);
        })
            .catch((error) => {
            this.runningProcesses.delete(processId);
            const processInfo = this.allProcesses.get(processId);
            if (processInfo) {
                this.allProcesses.set(processId, Object.assign(Object.assign({}, processInfo), { status: "error", error: error.message }));
            }
            const errorMessage = `Failed with error: ${error.message}`;
            const currentLogs = this.processLogs.get(processId) || [];
            currentLogs.push(errorMessage);
            this.processLogs.set(processId, currentLogs);
            this.webSocketBroadcastMessage({
                type: "processError",
                processId,
                error: error.message,
                timestamp: new Date().toISOString(),
                logs: [errorMessage],
            });
            if (onReject)
                onReject(error);
        });
        return processId;
    }
    getProcessesByCategory(category) {
        return Array.from(this.allProcesses.entries())
            .filter(([id, procInfo]) => procInfo.category === category)
            .map(([id, procInfo]) => ({
            processId: id,
            command: procInfo.command,
            pid: procInfo.pid,
            status: procInfo.status,
            exitCode: procInfo.exitCode,
            error: procInfo.error,
            timestamp: procInfo.timestamp,
            category: procInfo.category,
            testName: procInfo.testName,
            platform: procInfo.platform,
            logs: this.processLogs.get(id) || [],
        }));
    }
    getBDDTestProcesses() {
        return this.getProcessesByCategory("bdd-test");
    }
    getBuildTimeProcesses() {
        return this.getProcessesByCategory("build-time");
    }
    getAiderProcesses() {
        return this.getProcessesByCategory("aider");
    }
    getProcessesByTestName(testName) {
        return Array.from(this.allProcesses.entries())
            .filter(([id, procInfo]) => procInfo.testName === testName)
            .map(([id, procInfo]) => ({
            processId: id,
            command: procInfo.command,
            pid: procInfo.pid,
            status: procInfo.status,
            exitCode: procInfo.exitCode,
            error: procInfo.error,
            timestamp: procInfo.timestamp,
            category: procInfo.category,
            testName: procInfo.testName,
            platform: procInfo.platform,
            logs: this.processLogs.get(id) || [],
        }));
    }
    getProcessesByPlatform(platform) {
        return Array.from(this.allProcesses.entries())
            .filter(([id, procInfo]) => procInfo.platform === platform)
            .map(([id, procInfo]) => ({
            processId: id,
            command: procInfo.command,
            pid: procInfo.pid,
            status: procInfo.status,
            exitCode: procInfo.exitCode,
            error: procInfo.error,
            timestamp: procInfo.timestamp,
            category: procInfo.category,
            testName: procInfo.testName,
            platform: procInfo.platform,
            logs: this.processLogs.get(id) || [],
        }));
    }
    bddTestIsRunning(src) {
        // @ts-ignore
        this.summary[src] = {
            prompt: "?",
            runTimeErrors: "?",
            staticErrors: "?",
            typeErrors: "?",
            failingFeatures: {},
        };
    }
    async metafileOutputs(platform) {
        let metafilePath;
        if (platform === "python") {
            metafilePath = `./testeranto/metafiles/python/core.json`;
        }
        else {
            metafilePath = `./testeranto/metafiles/${platform}/${this.projectName}.json`;
        }
        // Ensure the metafile exists
        if (!fs_1.default.existsSync(metafilePath)) {
            console.log(ansi_colors_1.default.yellow(`Metafile not found at ${metafilePath}, skipping`));
            return;
        }
        let metafile;
        try {
            const fileContent = fs_1.default.readFileSync(metafilePath).toString();
            const parsedData = JSON.parse(fileContent);
            // Handle different metafile structures
            if (platform === "python") {
                // Pitono metafile might be the entire content or have a different structure
                metafile = parsedData.metafile || parsedData;
            }
            else {
                metafile = parsedData.metafile;
            }
            if (!metafile) {
                console.log(ansi_colors_1.default.yellow(ansi_colors_1.default.inverse(`No metafile found in ${metafilePath}`)));
                return;
            }
            // console.log(
            //   ansiC.blue(
            //     `Found metafile for ${platform} with ${
            //       Object.keys(metafile.outputs || {}).length
            //     } outputs`
            //   )
            // );
        }
        catch (error) {
            console.error(`Error reading metafile at ${metafilePath}:`, error);
            return;
        }
        const outputs = metafile.outputs;
        // Check if outputs exists and is an object
        // if (!outputs || typeof outputs !== "object") {
        //   console.log(
        //     ansiC.yellow(
        //       ansiC.inverse(`No outputs found in metafile at ${metafilePath}`)
        //     )
        //   );
        //   return;
        // }
        // @ts-ignore
        Object.keys(outputs).forEach(async (k) => {
            const pattern = `testeranto/bundles/${platform}/${this.projectName}/${this.configs.src}`;
            if (!k.startsWith(pattern)) {
                return;
            }
            // // @ts-ignore
            const output = outputs[k];
            // Check if the output entry exists and has inputs
            // if (!output || !output.inputs) {
            //   return;
            // }
            // @ts-ignore
            const addableFiles = Object.keys(output.inputs).filter((i) => {
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
                fs_1.default.mkdirSync(f, { recursive: true });
            }
            // @ts-ignore
            let entrypoint = output.entryPoint;
            if (entrypoint) {
                // Normalize the entrypoint path to ensure consistent comparison
                entrypoint = path_1.default.normalize(entrypoint);
                const changeDigest = await (0, utils_js_1.filesHash)(addableFiles);
                if (changeDigest === changes[entrypoint]) {
                    // skip
                }
                else {
                    changes[entrypoint] = changeDigest;
                    // Run appropriate static analysis based on platform
                    if (platform === "node" ||
                        platform === "web" ||
                        platform === "pure") {
                        this.tscCheck({ entrypoint, addableFiles, platform });
                        this.eslintCheck({ entrypoint, addableFiles, platform });
                    }
                    else if (platform === "python") {
                        this.pythonLintCheck(entrypoint, addableFiles);
                        this.pythonTypeCheck(entrypoint, addableFiles);
                    }
                    (0, makePrompt_js_1.makePrompt)(this.summary, this.projectName, entrypoint, addableFiles, platform);
                    const testName = this.findTestNameByEntrypoint(entrypoint, platform);
                    if (testName) {
                        console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`Source files changed, re-queueing test: ${testName}`)));
                        this.addToQueue(testName, platform);
                    }
                    else {
                        console.error(`Could not find test for entrypoint: ${entrypoint} (${platform})`);
                        process.exit(-1);
                    }
                }
            }
        });
    }
    findTestNameByEntrypoint(entrypoint, platform) {
        const runnables = (0, utils_js_2.getRunnables)(this.configs.tests, this.projectName);
        let entryPointsMap;
        switch (platform) {
            case "node":
                entryPointsMap = runnables.nodeEntryPoints;
                break;
            case "web":
                entryPointsMap = runnables.webEntryPoints;
                break;
            case "pure":
                entryPointsMap = runnables.pureEntryPoints;
                break;
            case "python":
                entryPointsMap = runnables.pythonEntryPoints;
                break;
            case "golang":
                entryPointsMap = runnables.golangEntryPoints;
                break;
            default:
                throw "wtf";
        }
        if (!entryPointsMap) {
            console.error("idk");
        }
        if (!entryPointsMap[entrypoint]) {
            console.error(`${entrypoint} not found`);
        }
        return entryPointsMap[entrypoint];
    }
    async pythonLintCheck(entrypoint, addableFiles) {
        const reportDest = `testeranto/reports/${this.projectName}/${entrypoint
            .split(".")
            .slice(0, -1)
            .join(".")}/python`;
        if (!fs_1.default.existsSync(reportDest)) {
            fs_1.default.mkdirSync(reportDest, { recursive: true });
        }
        const lintErrorsPath = `${reportDest}/lint_errors.txt`;
        try {
            // Use flake8 for Python linting
            const { spawn } = await Promise.resolve().then(() => __importStar(require("child_process")));
            const child = spawn("flake8", [entrypoint, "--max-line-length=88"], {
                stdio: ["pipe", "pipe", "pipe"],
            });
            let stderr = "";
            child.stderr.on("data", (data) => {
                stderr += data.toString();
            });
            let stdout = "";
            child.stdout.on("data", (data) => {
                stdout += data.toString();
            });
            return new Promise((resolve) => {
                child.on("close", () => {
                    const output = stdout + stderr;
                    if (output.trim()) {
                        fs_1.default.writeFileSync(lintErrorsPath, output);
                        this.summary[entrypoint].staticErrors = output.split("\n").length;
                    }
                    else {
                        if (fs_1.default.existsSync(lintErrorsPath)) {
                            fs_1.default.unlinkSync(lintErrorsPath);
                        }
                        this.summary[entrypoint].staticErrors = 0;
                    }
                    resolve();
                });
            });
        }
        catch (error) {
            console.error(`Error running flake8 on ${entrypoint}:`, error);
            fs_1.default.writeFileSync(lintErrorsPath, `Error running flake8: ${error.message}`);
            this.summary[entrypoint].staticErrors = -1;
        }
    }
    async pythonTypeCheck(entrypoint, addableFiles) {
        const reportDest = `testeranto/reports/${this.projectName}/${entrypoint
            .split(".")
            .slice(0, -1)
            .join(".")}/python`;
        if (!fs_1.default.existsSync(reportDest)) {
            fs_1.default.mkdirSync(reportDest, { recursive: true });
        }
        const typeErrorsPath = `${reportDest}/type_errors.txt`;
        try {
            // Use mypy for Python type checking
            const { spawn } = await Promise.resolve().then(() => __importStar(require("child_process")));
            const child = spawn("mypy", [entrypoint], {
                stdio: ["pipe", "pipe", "pipe"],
            });
            let stderr = "";
            child.stderr.on("data", (data) => {
                stderr += data.toString();
            });
            let stdout = "";
            child.stdout.on("data", (data) => {
                stdout += data.toString();
            });
            return new Promise((resolve) => {
                child.on("close", () => {
                    const output = stdout + stderr;
                    if (output.trim()) {
                        fs_1.default.writeFileSync(typeErrorsPath, output);
                        this.summary[entrypoint].typeErrors = output.split("\n").length;
                    }
                    else {
                        if (fs_1.default.existsSync(typeErrorsPath)) {
                            fs_1.default.unlinkSync(typeErrorsPath);
                        }
                        this.summary[entrypoint].typeErrors = 0;
                    }
                    resolve();
                });
            });
        }
        catch (error) {
            console.error(`Error running mypy on ${entrypoint}:`, error);
            fs_1.default.writeFileSync(typeErrorsPath, `Error running mypy: ${error.message}`);
            this.summary[entrypoint].typeErrors = -1;
        }
    }
    async start() {
        // Wait for build processes to complete first
        try {
            await this.startBuildProcesses();
            // Generate Python metafile if there are Python tests
            const pythonTests = this.configs.tests.filter((test) => test[1] === "python");
            if (pythonTests.length > 0) {
                const { generatePitonoMetafile, writePitonoMetafile } = await Promise.resolve().then(() => __importStar(require("../../utils/pitonoMetafile.js")));
                const entryPoints = pythonTests.map((test) => test[0]);
                const metafile = await generatePitonoMetafile(this.projectName, entryPoints);
                writePitonoMetafile(this.projectName, metafile);
            }
            this.onBuildDone();
        }
        catch (error) {
            console.error("Build processes failed:", error);
            return;
        }
        // Continue with the rest of the setup after builds are done
        this.mapping().forEach(async ([command, func]) => {
            globalThis[command] = func;
        });
        if (!fs_1.default.existsSync(`testeranto/reports/${this.projectName}`)) {
            fs_1.default.mkdirSync(`testeranto/reports/${this.projectName}`);
        }
        try {
            this.browser = await puppeteer_core_1.default.launch(utils_js_1.puppeteerConfigs);
        }
        catch (e) {
            console.error(e);
            console.error("could not start chrome via puppeter. Check this path: ", puppeteer_core_1.executablePath);
        }
        const runnables = (0, utils_js_2.getRunnables)(this.configs.tests, this.projectName);
        const { nodeEntryPoints, webEntryPoints, pureEntryPoints, pythonEntryPoints, golangEntryPoints, } = runnables;
        // Add all tests to the queue
        [
            ["node", nodeEntryPoints],
            ["web", webEntryPoints],
            ["pure", pureEntryPoints],
            ["python", pythonEntryPoints],
            ["golang", golangEntryPoints],
        ].forEach(([runtime, entryPoints]) => {
            Object.keys(entryPoints).forEach((entryPoint) => {
                // Create the report directory
                const reportDest = `testeranto/reports/${this.projectName}/${entryPoint
                    .split(".")
                    .slice(0, -1)
                    .join(".")}/${runtime}`;
                if (!fs_1.default.existsSync(reportDest)) {
                    fs_1.default.mkdirSync(reportDest, { recursive: true });
                }
                // Add to the processing queue
                this.addToQueue(entryPoint, runtime);
            });
        });
        // Set up metafile watchers for each runtime
        const runtimeConfigs = [
            ["node", nodeEntryPoints],
            ["web", webEntryPoints],
            ["pure", pureEntryPoints],
            ["python", pythonEntryPoints],
            ["golang", golangEntryPoints],
        ];
        for (const [runtime, entryPoints] of runtimeConfigs) {
            if (Object.keys(entryPoints).length === 0)
                continue;
            // For python, the metafile path is different
            let metafile;
            if (runtime === "python") {
                metafile = `./testeranto/metafiles/${runtime}/core.json`;
            }
            else {
                metafile = `./testeranto/metafiles/${runtime}/${this.projectName}.json`;
            }
            // Ensure the directory exists
            const metafileDir = metafile.split("/").slice(0, -1).join("/");
            if (!fs_1.default.existsSync(metafileDir)) {
                fs_1.default.mkdirSync(metafileDir, { recursive: true });
            }
            try {
                // For python, we may need to generate the metafile first
                if (runtime === "python" && !fs_1.default.existsSync(metafile)) {
                    const { generatePitonoMetafile, writePitonoMetafile } = await Promise.resolve().then(() => __importStar(require("../../utils/pitonoMetafile.js")));
                    const entryPointList = Object.keys(entryPoints);
                    if (entryPointList.length > 0) {
                        const metafileData = await generatePitonoMetafile(this.projectName, entryPointList);
                        writePitonoMetafile(this.projectName, metafileData);
                    }
                }
                await (0, utils_js_1.pollForFile)(metafile);
                // console.log("Found metafile for", runtime, metafile);
                // Set up watcher for the metafile with debouncing
                let timeoutId;
                const watcher = (0, fs_1.watch)(metafile, async (e, filename) => {
                    // Debounce to avoid multiple rapid triggers
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(async () => {
                        console.log(ansi_colors_1.default.yellow(ansi_colors_1.default.inverse(`< ${e} ${filename} (${runtime})`)));
                        try {
                            await this.metafileOutputs(runtime);
                            // After processing metafile changes, check the queue to run tests
                            console.log(ansi_colors_1.default.blue(`Metafile processed, checking queue for tests to run`));
                            this.checkQueue();
                        }
                        catch (error) {
                            console.error(`Error processing metafile changes:`, error);
                        }
                    }, 300); // 300ms debounce
                });
                // Store the watcher based on runtime
                switch (runtime) {
                    case "node":
                        this.nodeMetafileWatcher = watcher;
                        break;
                    case "web":
                        this.webMetafileWatcher = watcher;
                        break;
                    case "pure":
                        this.importMetafileWatcher = watcher;
                        break;
                    case "python":
                        this.pitonoMetafileWatcher = watcher;
                        break;
                    case "golang":
                        this.golangMetafileWatcher = watcher;
                        break;
                }
                // Read the metafile immediately
                await this.metafileOutputs(runtime);
            }
            catch (error) {
                console.error(`Error setting up watcher for ${runtime}:`, error);
            }
        }
    }
    async stop() {
        console.log(ansi_colors_1.default.inverse("Testeranto-Run is shutting down gracefully..."));
        this.mode = "once";
        this.nodeMetafileWatcher.close();
        this.webMetafileWatcher.close();
        this.importMetafileWatcher.close();
        if (this.pitonoMetafileWatcher) {
            this.pitonoMetafileWatcher.close();
        }
        if (this.gitWatcher) {
            this.gitWatcher.close();
        }
        if (this.gitWatchTimeout) {
            clearTimeout(this.gitWatchTimeout);
        }
        Object.values(this.logStreams || {}).forEach((logs) => logs.closeAll());
        if (this.wss) {
            this.wss.close(() => {
                console.log("WebSocket server closed");
            });
        }
        this.clients.forEach((client) => {
            client.terminate();
        });
        this.clients.clear();
        if (this.httpServer) {
            this.httpServer.close(() => {
                console.log("HTTP server closed");
            });
        }
        this.checkForShutdown();
    }
    addToQueue(src, runtime) {
        // Ensure we're using the original test source path, not a bundle path
        // The src parameter might be a bundle path from metafile changes
        // We need to find the corresponding test source path
        // First, check if this looks like a bundle path (contains 'testeranto/bundles')
        if (src.includes("testeranto/bundles")) {
            // Try to find the original test name that corresponds to this bundle
            const runnables = (0, utils_js_2.getRunnables)(this.configs.tests, this.projectName);
            const allEntryPoints = [
                ...Object.entries(runnables.nodeEntryPoints),
                ...Object.entries(runnables.webEntryPoints),
                ...Object.entries(runnables.pureEntryPoints),
                ...Object.entries(runnables.pythonEntryPoints),
                ...Object.entries(runnables.golangEntryPoints),
            ];
            // Normalize the source path for comparison
            const normalizedSrc = path_1.default.normalize(src);
            for (const [testName, bundlePath] of allEntryPoints) {
                const normalizedBundlePath = path_1.default.normalize(bundlePath);
                // Check if the source path ends with the bundle path
                if (normalizedSrc.endsWith(normalizedBundlePath)) {
                    // Use the original test name instead of the bundle path
                    src = testName;
                    break;
                }
            }
        }
        // First, clean up any existing processes for this test
        this.cleanupTestProcesses(src);
        // Add the test to the queue (using the original test source path)
        // Make sure we don't add duplicates
        if (!this.queue.includes(src)) {
            this.queue.push(src);
            console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`Added ${src} (${runtime}) to the processing queue`)));
            // Try to process the queue
            this.checkQueue();
        }
        else {
            console.log(ansi_colors_1.default.yellow(ansi_colors_1.default.inverse(`Test ${src} is already in the queue, skipping`)));
        }
    }
    cleanupTestProcesses(testName) {
        // Find and clean up any running processes for this test
        const processesToCleanup = [];
        // Find all process IDs that match this test name
        for (const [processId, processInfo] of this.allProcesses.entries()) {
            if (processInfo.testName === testName &&
                processInfo.status === "running") {
                processesToCleanup.push(processId);
            }
        }
        // Clean up each process
        processesToCleanup.forEach((processId) => {
            const processInfo = this.allProcesses.get(processId);
            if (processInfo) {
                // Kill child process if it exists
                if (processInfo.child) {
                    try {
                        processInfo.child.kill();
                    }
                    catch (error) {
                        console.error(`Error killing process ${processId}:`, error);
                    }
                }
                // Update process status
                this.allProcesses.set(processId, Object.assign(Object.assign({}, processInfo), { status: "exited", exitCode: -1, error: "Killed due to source file change" }));
                // Remove from running processes
                this.runningProcesses.delete(processId);
                // Broadcast process exit
                this.webSocketBroadcastMessage({
                    type: "processExited",
                    processId,
                    exitCode: -1,
                    timestamp: new Date().toISOString(),
                    logs: ["Process killed due to source file change"],
                });
            }
        });
    }
    checkQueue() {
        // Process all items in the queue
        while (this.queue.length > 0) {
            const x = this.queue.pop();
            if (!x)
                continue;
            // Check if this test is already running
            let isRunning = false;
            for (const processInfo of this.allProcesses.values()) {
                if (processInfo.testName === x && processInfo.status === "running") {
                    isRunning = true;
                    break;
                }
            }
            if (isRunning) {
                console.log(ansi_colors_1.default.yellow(`Skipping ${x} - already running, will be re-queued when current run completes`));
                continue;
            }
            const test = this.configs.tests.find((t) => t[0] === x);
            if (!test) {
                console.error(`test is undefined ${x}`);
                continue;
            }
            // Get the appropriate launcher based on the runtime type
            const runtime = test[1];
            const runnables = (0, utils_js_2.getRunnables)(this.configs.tests, this.projectName);
            let dest;
            switch (runtime) {
                case "node":
                    dest = runnables.nodeEntryPoints[x];
                    if (dest) {
                        this.launchNode(x, dest);
                    }
                    else {
                        console.error(`No destination found for node test: ${x}`);
                    }
                    break;
                case "web":
                    dest = runnables.webEntryPoints[x];
                    if (dest) {
                        this.launchWeb(x, dest);
                    }
                    else {
                        console.error(`No destination found for web test: ${x}`);
                    }
                    break;
                case "pure":
                    dest = runnables.pureEntryPoints[x];
                    if (dest) {
                        this.launchPure(x, dest);
                    }
                    else {
                        console.error(`No destination found for pure test: ${x}`);
                    }
                    break;
                case "python":
                    dest = runnables.pythonEntryPoints[x];
                    if (dest) {
                        this.launchPython(x, dest);
                    }
                    else {
                        console.error(`No destination found for python test: ${x}`);
                    }
                    break;
                case "golang":
                    dest = runnables.golangEntryPoints[x];
                    if (dest) {
                        // For Golang, we need to build and run the executable
                        // The dest is the path to the generated wrapper file
                        this.launchGolang(x, dest);
                    }
                    else {
                        console.error(`No destination found for golang test: ${x}`);
                    }
                    break;
                default:
                    console.error(`Unknown runtime: ${runtime} for test ${x}`);
                    break;
            }
        }
        if (this.queue.length === 0) {
            console.log(ansi_colors_1.default.inverse(`The queue is empty`));
        }
    }
    ensureSummaryEntry(src, isSidecar = false) {
        if (!this.summary[src]) {
            // @ts-ignore
            this.summary[src] = {
                typeErrors: undefined,
                staticErrors: undefined,
                runTimeErrors: undefined,
                prompt: undefined,
                failingFeatures: {},
            };
            if (isSidecar) {
                // Sidecars don't need all fields
                // delete this.summary[src].runTimeError;
                // delete this.summary[src].prompt;
            }
        }
        return this.summary[src];
    }
}
exports.PM_WithProcesses = PM_WithProcesses;
