/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import fs, { watch } from "fs";
import path from "path";
import puppeteer, { executablePath } from "puppeteer-core";
import ansiC from "ansi-colors";
import { getRunnables } from "../utils";
import { fileHash, isValidUrl, pollForFile, writeFileAndCreateDir, puppeteerConfigs, filesHash, } from "./utils.js";
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
    async metafileOutputs(platform) {
        let metafilePath;
        if (platform === "python") {
            metafilePath = `./testeranto/metafiles/python/core.json`;
        }
        else {
            metafilePath = `./testeranto/metafiles/${platform}/${this.name}.json`;
        }
        // Check if the file exists
        if (!fs.existsSync(metafilePath)) {
            if (platform === "python") {
                console.log(ansiC.yellow(ansiC.inverse(`Pitono metafile not found yet: ${metafilePath}`)));
            }
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
        }
        catch (error) {
            console.error(`Error reading metafile at ${metafilePath}:`, error);
            return;
        }
        const outputs = metafile.outputs;
        // Check if outputs exists and is an object
        if (!outputs || typeof outputs !== 'object') {
            console.log(ansiC.yellow(ansiC.inverse(`No outputs found in metafile at ${metafilePath}`)));
            return;
        }
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
            const entrypoint = output.entryPoint;
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
    async start() {
        // Wait for build processes to complete first
        try {
            await this.startBuildProcesses();
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
        const { nodeEntryPoints, webEntryPoints, pureEntryPoints, pythonEntryPoints, golangEntryPoints, } = getRunnables(this.configs.tests, this.name);
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
                pythonEntryPoints,
                this.launchPython,
                "python",
                (w) => {
                    this.pitonoMetafileWatcher = w;
                },
            ],
            [
                golangEntryPoints,
                this.launchGolang,
                "golang",
                (w) => {
                    // You might want to handle golang metafile watching here
                },
            ],
        ].forEach(async ([eps, launcher, runtime, watcher]) => {
            let metafile;
            if (runtime === "python") {
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
            if (runtime !== "python") {
                await pollForFile(metafile);
            }
            Object.entries(eps).forEach(async ([inputFile, outputFile]) => {
                this.launchers[inputFile] = () => launcher(inputFile, outputFile);
                this.launchers[inputFile]();
                try {
                    // Check if the file exists before watching
                    if (fs.existsSync(outputFile)) {
                        watch(outputFile, async (e, filename) => {
                            const hash = await fileHash(outputFile);
                            if (fileHashes[inputFile] !== hash) {
                                fileHashes[inputFile] = hash;
                                console.log(ansiC.yellow(ansiC.inverse(`< ${e} ${filename}`)));
                                this.launchers[inputFile]();
                            }
                        });
                    }
                    else {
                        console.log(ansiC.yellow(ansiC.inverse(`File not found, skipping watch: ${outputFile}`)));
                    }
                }
                catch (e) {
                    console.error(e);
                }
            });
            this.metafileOutputs(runtime);
            // For pitono, we need to wait for the file to be created
            if (runtime === "python") {
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
        // Add the test to the queue
        this.queue.push(src);
        console.log(ansiC.green(ansiC.inverse(`Added ${src} (${runtime}) to the processing queue`)));
        // Try to process the queue
        this.checkQueue();
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
    onBuildDone() {
        console.log("Build processes completed");
        // The builds are done, which means the files are ready to be watched
        // This matches the original behavior where builds completed before PM_Main started
        // Start Git watcher for development mode
        this.startGitWatcher();
    }
}
