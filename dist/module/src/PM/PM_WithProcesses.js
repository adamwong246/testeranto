/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import fs, { watch } from "fs";
import path from "path";
import puppeteer, { executablePath } from "puppeteer-core";
import ansiC from "ansi-colors";
import { getRunnables } from "../utils.js";
import { isValidUrl, pollForFile, writeFileAndCreateDir, puppeteerConfigs, filesHash, } from "./utils.js";
import { PM_WithGit } from "./PM_WithGit.js";
const fileHashes = {};
const changes = {};
export class PM_WithProcesses extends PM_WithGit {
    constructor(configs, name, mode) {
        super(configs, name, mode);
        this.logStreams = {};
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
        this.configs.ports.forEach((element) => {
            this.ports[element] = ""; // set ports as open
        });
    }
    bddTestIsRunning(src) {
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
            metafilePath = `./testeranto/metafiles/${platform}/${this.name}.json`;
        }
        // Ensure the metafile exists
        if (!fs.existsSync(metafilePath)) {
            console.log(ansiC.yellow(`Metafile not found at ${metafilePath}, skipping`));
            return;
        }
        let metafile;
        try {
            const fileContent = fs.readFileSync(metafilePath).toString();
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
                console.log(ansiC.yellow(ansiC.inverse(`No metafile found in ${metafilePath}`)));
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
        Object.keys(outputs).forEach(async (k) => {
            const pattern = `testeranto/bundles/${platform}/${this.name}/${this.configs.src}`;
            if (!k.startsWith(pattern)) {
                return;
            }
            const output = outputs[k];
            // Check if the output entry exists and has inputs
            if (!output || !output.inputs) {
                return;
            }
            const addableFiles = Object.keys(output.inputs).filter((i) => {
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
                fs.mkdirSync(f, { recursive: true });
            }
            let entrypoint = output.entryPoint;
            if (entrypoint) {
                // Normalize the entrypoint path to ensure consistent comparison
                entrypoint = path.normalize(entrypoint);
                const changeDigest = await filesHash(addableFiles);
                if (changeDigest === changes[entrypoint]) {
                    // skip
                }
                else {
                    changes[entrypoint] = changeDigest;
                    // Run appropriate static analysis based on platform
                    if (platform === "node" ||
                        platform === "web" ||
                        platform === "pure") {
                        this.tscCheck({
                            platform,
                            addableFiles,
                            entrypoint: entrypoint,
                        });
                        this.eslintCheck(entrypoint, platform, addableFiles);
                    }
                    else if (platform === "python") {
                        this.pythonLintCheck(entrypoint, addableFiles);
                        this.pythonTypeCheck(entrypoint, addableFiles);
                    }
                    this.makePrompt(entrypoint, addableFiles, platform);
                    const testName = this.findTestNameByEntrypoint(entrypoint, platform);
                    if (testName) {
                        console.log(ansiC.green(ansiC.inverse(`Source files changed, re-queueing test: ${testName}`)));
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
        const runnables = getRunnables(this.configs.tests, this.name);
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
        const reportDest = `testeranto/reports/${this.name}/${entrypoint
            .split(".")
            .slice(0, -1)
            .join(".")}/python`;
        if (!fs.existsSync(reportDest)) {
            fs.mkdirSync(reportDest, { recursive: true });
        }
        const lintErrorsPath = `${reportDest}/lint_errors.txt`;
        try {
            // Use flake8 for Python linting
            const { spawn } = await import("child_process");
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
                child.on("close", (code) => {
                    const output = stdout + stderr;
                    if (output.trim()) {
                        fs.writeFileSync(lintErrorsPath, output);
                        this.summary[entrypoint].staticErrors = output.split("\n").length;
                    }
                    else {
                        if (fs.existsSync(lintErrorsPath)) {
                            fs.unlinkSync(lintErrorsPath);
                        }
                        this.summary[entrypoint].staticErrors = 0;
                    }
                    resolve();
                });
            });
        }
        catch (error) {
            console.error(`Error running flake8 on ${entrypoint}:`, error);
            fs.writeFileSync(lintErrorsPath, `Error running flake8: ${error.message}`);
            this.summary[entrypoint].staticErrors = -1;
        }
    }
    async pythonTypeCheck(entrypoint, addableFiles) {
        const reportDest = `testeranto/reports/${this.name}/${entrypoint
            .split(".")
            .slice(0, -1)
            .join(".")}/python`;
        if (!fs.existsSync(reportDest)) {
            fs.mkdirSync(reportDest, { recursive: true });
        }
        const typeErrorsPath = `${reportDest}/type_errors.txt`;
        try {
            // Use mypy for Python type checking
            const { spawn } = await import("child_process");
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
                child.on("close", (code) => {
                    const output = stdout + stderr;
                    if (output.trim()) {
                        fs.writeFileSync(typeErrorsPath, output);
                        this.summary[entrypoint].typeErrors = output.split("\n").length;
                    }
                    else {
                        if (fs.existsSync(typeErrorsPath)) {
                            fs.unlinkSync(typeErrorsPath);
                        }
                        this.summary[entrypoint].typeErrors = 0;
                    }
                    resolve();
                });
            });
        }
        catch (error) {
            console.error(`Error running mypy on ${entrypoint}:`, error);
            fs.writeFileSync(typeErrorsPath, `Error running mypy: ${error.message}`);
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
                const { generatePitonoMetafile, writePitonoMetafile } = await import("../utils/pitonoMetafile.js");
                const entryPoints = pythonTests.map((test) => test[0]);
                const metafile = await generatePitonoMetafile(this.name, entryPoints);
                writePitonoMetafile(this.name, metafile);
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
        const runnables = getRunnables(this.configs.tests, this.name);
        const { nodeEntryPoints, webEntryPoints, pureEntryPoints, pythonEntryPoints, golangEntryPoints, } = runnables;
        // Debug: log the runnables to see what we're working with
        console.log(ansiC.blue(`Runnables for ${this.name}:\n` +
            `Node: ${JSON.stringify(nodeEntryPoints, null, 2)}\n` +
            `Web: ${JSON.stringify(webEntryPoints, null, 2)}\n` +
            `Pure: ${JSON.stringify(pureEntryPoints, null, 2)}\n` +
            `Python: ${JSON.stringify(pythonEntryPoints, null, 2)}\n` +
            `Golang: ${JSON.stringify(golangEntryPoints, null, 2)}`));
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
                const reportDest = `testeranto/reports/${this.name}/${entryPoint
                    .split(".")
                    .slice(0, -1)
                    .join(".")}/${runtime}`;
                if (!fs.existsSync(reportDest)) {
                    fs.mkdirSync(reportDest, { recursive: true });
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
                metafile = `./testeranto/metafiles/${runtime}/${this.name}.json`;
            }
            // Ensure the directory exists
            const metafileDir = metafile.split("/").slice(0, -1).join("/");
            if (!fs.existsSync(metafileDir)) {
                fs.mkdirSync(metafileDir, { recursive: true });
            }
            try {
                // For python, we may need to generate the metafile first
                if (runtime === "python" && !fs.existsSync(metafile)) {
                    const { generatePitonoMetafile, writePitonoMetafile } = await import("../utils/pitonoMetafile.js");
                    const entryPointList = Object.keys(entryPoints);
                    if (entryPointList.length > 0) {
                        const metafileData = await generatePitonoMetafile(this.name, entryPointList);
                        writePitonoMetafile(this.name, metafileData);
                    }
                }
                await pollForFile(metafile);
                // console.log("Found metafile for", runtime, metafile);
                // Set up watcher for the metafile with debouncing
                let timeoutId;
                const watcher = watch(metafile, async (e, filename) => {
                    // Debounce to avoid multiple rapid triggers
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(async () => {
                        console.log(ansiC.yellow(ansiC.inverse(`< ${e} ${filename} (${runtime})`)));
                        try {
                            await this.metafileOutputs(runtime);
                            // After processing metafile changes, check the queue to run tests
                            console.log(ansiC.blue(`Metafile processed, checking queue for tests to run`));
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
        console.log(ansiC.inverse("Testeranto-Run is shutting down gracefully..."));
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
    addToQueue(src, runtime) {
        // Ensure we're using the original test source path, not a bundle path
        // The src parameter might be a bundle path from metafile changes
        // We need to find the corresponding test source path
        // First, check if this looks like a bundle path (contains 'testeranto/bundles')
        if (src.includes("testeranto/bundles")) {
            // Try to find the original test name that corresponds to this bundle
            const runnables = getRunnables(this.configs.tests, this.name);
            const allEntryPoints = [
                ...Object.entries(runnables.nodeEntryPoints),
                ...Object.entries(runnables.webEntryPoints),
                ...Object.entries(runnables.pureEntryPoints),
                ...Object.entries(runnables.pythonEntryPoints),
                ...Object.entries(runnables.golangEntryPoints),
            ];
            // Normalize the source path for comparison
            const normalizedSrc = path.normalize(src);
            for (const [testName, bundlePath] of allEntryPoints) {
                const normalizedBundlePath = path.normalize(bundlePath);
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
            console.log(ansiC.green(ansiC.inverse(`Added ${src} (${runtime}) to the processing queue`)));
            // Try to process the queue
            this.checkQueue();
        }
        else {
            console.log(ansiC.yellow(ansiC.inverse(`Test ${src} is already in the queue, skipping`)));
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
                this.broadcast({
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
                console.log(ansiC.yellow(`Skipping ${x} - already running, will be re-queued when current run completes`));
                continue;
            }
            const test = this.configs.tests.find((t) => t[0] === x);
            if (!test) {
                console.error(`test is undefined ${x}`);
                continue;
            }
            // Get the appropriate launcher based on the runtime type
            const runtime = test[1];
            // Get the destination path from the runnables
            const runnables = getRunnables(this.configs.tests, this.name);
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
            console.log(ansiC.inverse(`The queue is empty`));
        }
    }
    onBuildDone() {
        console.log("Build processes completed");
        // The builds are done, which means the files are ready to be watched
        // This matches the original behavior where builds completed before PM_Main started
        // Start Git watcher for development mode
        this.startGitWatcher();
    }
}
