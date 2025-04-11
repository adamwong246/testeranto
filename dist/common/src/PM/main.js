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
const node_child_process_1 = require("node:child_process");
const typescript_1 = __importDefault(require("typescript"));
const net_1 = __importDefault(require("net"));
const fs_1 = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const eslint_1 = require("eslint");
const tsc_prog_1 = __importDefault(require("tsc-prog"));
const utils_1 = require("../utils");
const base_js_1 = require("./base.js");
const eslint = new eslint_1.ESLint();
const formatter = await eslint.loadFormatter("./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs");
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
const statusMessagePretty = (failures, test) => {
    if (failures === 0) {
        console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`> ${test} completed successfully`)));
    }
    else {
        console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`> ${test} failed ${failures} times`)));
    }
};
async function writeFileAndCreateDir(filePath, data) {
    const dirPath = path_1.default.dirname(filePath);
    try {
        await fs_1.default.promises.mkdir(dirPath, { recursive: true });
        await fs_1.default.appendFileSync(filePath, data);
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
function pollForFile(path, timeout = 2000) {
    const intervalObj = setInterval(function () {
        const file = path;
        const fileExists = fs_1.default.existsSync(file);
        // console.log("Checking for: ", file);
        // console.log("Exists: ", fileExists);
        if (fileExists) {
            clearInterval(intervalObj);
        }
    }, timeout);
}
class PM_Main extends base_js_1.PM_Base {
    constructor(configs, name, mode) {
        super(configs);
        this.bigBoard = {};
        this.getRunnables = (tests, testName, payload = {
            nodeEntryPoints: {},
            webEntryPoints: {},
            importEntryPoints: {},
        }) => {
            return (0, utils_1.getRunnables)(tests, testName, payload);
        };
        this.tscCheck = async ({ entrypoint, addableFiles, platform, }) => {
            console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`tsc < ${entrypoint}`)));
            this.typeCheckIsRunning(entrypoint);
            const program = tsc_prog_1.default.createProgramFromConfig({
                basePath: process.cwd(), // always required, used for relative paths
                configFilePath: "tsconfig.json", // config to inherit from (optional)
                compilerOptions: {
                    rootDir: "src",
                    outDir: (0, utils_1.tscPather)(entrypoint, platform, this.name),
                    // declaration: true,
                    // skipLibCheck: true,
                    noEmit: true,
                },
                include: addableFiles, //["src/**/*"],
                // exclude: ["node_modules", "../testeranto"],
                // exclude: ["**/*.test.ts", "**/*.spec.ts"],
            });
            const tscPath = (0, utils_1.tscPather)(entrypoint, platform, this.name);
            let allDiagnostics = program.getSemanticDiagnostics();
            const results = [];
            allDiagnostics.forEach((diagnostic) => {
                if (diagnostic.file) {
                    let { line, character } = typescript_1.default.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
                    let message = typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                    results.push(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
                }
                else {
                    results.push(typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
                }
            });
            fs_1.default.writeFileSync(tscPath, results.join("\n"));
            this.typeCheckIsNowDone(entrypoint, results.length);
        };
        this.eslintCheck = async (entrypoint, platform, addableFiles) => {
            console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`eslint < ${entrypoint}`)));
            this.lintIsRunning(entrypoint);
            const results = (await eslint.lintFiles(addableFiles))
                .filter((r) => r.messages.length)
                .filter((r) => {
                return r.messages[0].ruleId !== null;
            })
                .map((r) => {
                delete r.source;
                return r;
            });
            fs_1.default.writeFileSync((0, utils_1.lintPather)(entrypoint, platform, this.name), await formatter.format(results));
            this.lintIsNowDone(entrypoint, results.length);
        };
        this.makePrompt = async (entryPoint, addableFiles, platform) => {
            this.bigBoard[entryPoint].prompt = "?";
            const promptPath = (0, utils_1.promptPather)(entryPoint, platform, this.name);
            const testPaths = path_1.default.join("testeranto", "reports", this.name, platform, entryPoint.split(".").slice(0, -1).join("."), `tests.json`);
            const featuresPath = path_1.default.join("testeranto", "reports", this.name, platform, entryPoint.split(".").slice(0, -1).join("."), `featurePrompt.txt`);
            fs_1.default.writeFileSync(promptPath, `
${addableFiles
                .map((x) => {
                return `/add ${x}`;
            })
                .join("\n")}

/read ${(0, utils_1.lintPather)(entryPoint, platform, this.name)}
/read ${(0, utils_1.tscPather)(entryPoint, platform, this.name)}
/read ${testPaths}

/load ${featuresPath}

/code Fix the failing tests described in ${testPaths}. Correct any type signature errors described in the files ${(0, utils_1.tscPather)(entryPoint, platform, this.name)}. Implement any method which throws "Function not implemented. Resolve the lint errors described in ${(0, utils_1.lintPather)(entryPoint, platform, this.name)}"
          `);
            this.bigBoard[entryPoint].prompt = `aider --model deepseek/deepseek-chat --load testeranto/${this.name}/reports/${platform}/${entryPoint
                .split(".")
                .slice(0, -1)
                .join(".")}/prompt.txt`;
            this.checkForShutdown();
        };
        this.checkForShutdown = () => {
            this.writeBigBoard();
            if (this.mode === "dev")
                return;
            let inflight = false;
            Object.keys(this.bigBoard).forEach((k) => {
                if (this.bigBoard[k].prompt === "?") {
                    console.log(ansi_colors_1.default.blue(ansi_colors_1.default.inverse(`🕕 prompt ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.bigBoard).forEach((k) => {
                if (this.bigBoard[k].runTimeError === "?") {
                    console.log(ansi_colors_1.default.blue(ansi_colors_1.default.inverse(`🕕 runTimeError ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.bigBoard).forEach((k) => {
                if (this.bigBoard[k].staticErrors === "?") {
                    console.log(ansi_colors_1.default.blue(ansi_colors_1.default.inverse(`🕕 staticErrors ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.bigBoard).forEach((k) => {
                if (this.bigBoard[k].typeErrors === "?") {
                    console.log(ansi_colors_1.default.blue(ansi_colors_1.default.inverse(`🕕 typeErrors ${k}`)));
                    inflight = true;
                }
            });
            this.writeBigBoard();
            if (!inflight) {
                this.browser.disconnect().then(() => {
                    console.log(ansi_colors_1.default.inverse(`${this.name} has been tested. Goodbye.`));
                    process.exit();
                });
            }
        };
        this.typeCheckIsRunning = (src) => {
            this.bigBoard[src].typeErrors = "?";
        };
        this.typeCheckIsNowDone = (src, failures) => {
            this.bigBoard[src].typeErrors = failures;
            this.writeBigBoard();
            this.checkForShutdown();
        };
        this.lintIsRunning = (src) => {
            this.bigBoard[src].staticErrors = "?";
            this.writeBigBoard();
        };
        this.lintIsNowDone = (src, failures) => {
            this.bigBoard[src].staticErrors = failures;
            this.writeBigBoard();
            this.checkForShutdown();
        };
        this.bddTestIsRunning = (src) => {
            this.bigBoard[src].runTimeError = "?";
            this.writeBigBoard();
        };
        this.bddTestIsNowDone = (src, failures) => {
            this.bigBoard[src].runTimeError = failures;
            this.writeBigBoard();
            this.checkForShutdown();
        };
        this.launchPure = async (src, dest) => {
            console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`! pure, ${src}`)));
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
                console.log(ansi_colors_1.default.inverse("missing test config! Exiting ungracefully!"));
                process.exit(-1);
            }
            const testConfigResource = testConfig[2];
            let portsToUse = [];
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
                const openPorts = Object.entries(this.ports).filter(([portnumber, portopen]) => portopen);
                if (openPorts.length >= testConfigResource.ports) {
                    for (let i = 0; i < testConfigResource.ports; i++) {
                        portsToUse.push(openPorts[i][0]);
                        this.ports[openPorts[i][0]] = false; // port is now closed
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
            const webSideCares = [];
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
                            this.receiveFeatures(results.features, destFolder, src, "pure");
                            statusMessagePretty(results.fails, src);
                            this.bddTestIsNowDone(src, results.fails);
                        })
                            .catch((e) => {
                            console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`${src} errored with: ${e}`)));
                            this.bddTestIsNowDone(src, -1);
                        })
                            .finally(() => {
                            webSideCares.forEach((webSideCar) => webSideCar.close());
                        });
                    })
                        .catch((e) => {
                        console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`${src} errored with: ${e}. Check ${reportDest}/error.txt for more info`)));
                        this.writeFileSync(`${reportDest}/error.txt`, e.stack, src);
                        this.bddTestIsNowDone(src, -1);
                        statusMessagePretty(-1, src);
                        // console.error(e);
                    });
                });
            }
            catch (e) {
                console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`${src} errored with: ${e}. Check ${reportDest}/error.txt for more info`)));
                this.writeFileSync(`${reportDest}/error.txt`, e.stack, src);
                this.bddTestIsNowDone(src, -1);
                statusMessagePretty(-1, src);
            }
            // console.log("portsToUse", portsToUse);
            for (let i = 0; i <= portsToUse.length; i++) {
                if (portsToUse[i]) {
                    this.ports[portsToUse[i]] = "true"; //port is open again
                }
            }
        };
        this.launchNode = async (src, dest) => {
            console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`! node, ${src}`)));
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src
                .split(".")
                .slice(0, -1)
                .join(".")}/node`;
            if (!fs_1.default.existsSync(reportDest)) {
                fs_1.default.mkdirSync(reportDest, { recursive: true });
            }
            const destFolder = dest.replace(".mjs", "");
            let testResources = "";
            const testConfig = this.configs.tests.find((t) => {
                return t[0] === src;
            });
            if (!testConfig) {
                console.log(ansi_colors_1.default.inverse("missing test config! Exiting ungracefully!"));
                process.exit(-1);
            }
            const testConfigResource = testConfig[2];
            let portsToUse = [];
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
                const openPorts = Object.entries(this.ports).filter(([portnumber, portopen]) => portopen);
                if (openPorts.length >= testConfigResource.ports) {
                    for (let i = 0; i < testConfigResource.ports; i++) {
                        portsToUse.push(openPorts[i][0]);
                        this.ports[openPorts[i][0]] = false; // port is now closed
                    }
                    testResources = JSON.stringify({
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
            // const f = fork(builtfile, [testResources], {
            //   silent: true,
            //   // detached: true,
            //   // stdio: "ignore",
            // });
            let haltReturns = false;
            let buffer = new Buffer("");
            const server = net_1.default.createServer((socket) => {
                socket.on("data", (data) => {
                    buffer = Buffer.concat([buffer, data]);
                    let messages = [];
                    for (let b = 0; b < buffer.length + 1; b++) {
                        let c = buffer.slice(0, b);
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
                        // set up the "node" listeners
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
            const oStream = fs_1.default.createWriteStream(`${reportDest}/console_log.txt`);
            const child = (0, node_child_process_1.spawn)("node", [builtfile, testResources, "--trace-warnings"], {
                stdio: ["pipe", "pipe", "pipe", "ipc"],
                // silent: true
            });
            // const child = spawn(
            //   "node",
            //   ["inspect", builtfile, testResources, "--trace-warnings"],
            //   {
            //     stdio: ["pipe", "pipe", "pipe", "ipc"],
            //     env: {
            //       NODE_INSPECT_RESUME_ON_START: "1",
            //     },
            //     // silent: true
            //   }
            // );
            // console.log(
            //   "spawning",
            //   "node",
            //   ["inspect", builtfile, testResources, "--trace-warnings"],
            //   {
            //     NODE_INSPECT_RESUME_ON_START: "1",
            //   }
            // );
            const p = destFolder + "/pipe";
            const errFile = `${reportDest}/error.txt`;
            if (fs_1.default.existsSync(errFile)) {
                fs_1.default.rmSync(errFile);
            }
            server.listen(p, () => {
                var _a, _b;
                (_a = child.stderr) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                    oStream.write(`stderr data ${data}`);
                });
                (_b = child.stdout) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
                    oStream.write(`stdout data ${data}`);
                });
                child.on("close", (code) => {
                    oStream.close();
                    server.close();
                    if (code === null) {
                        this.bddTestIsNowDone(src, -1);
                        statusMessagePretty(-1, src);
                    }
                    else if (code === 0) {
                        this.bddTestIsNowDone(src, 0);
                        statusMessagePretty(0, src);
                    }
                    else {
                        this.bddTestIsNowDone(src, code);
                        statusMessagePretty(code, src);
                    }
                    if (fs_1.default.existsSync(p)) {
                        fs_1.default.rmSync(p);
                    }
                    haltReturns = true;
                });
                child.on("exit", (code) => {
                    haltReturns = true;
                });
                child.on("error", (e) => {
                    haltReturns = true;
                    if (fs_1.default.existsSync(p)) {
                        fs_1.default.rmSync(p);
                    }
                    console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`${src} errored with: ${e.name}. Check ${errFile}for more info`)));
                    this.writeFileSync(`${reportDest}/error.txt`, e.toString(), src);
                    this.bddTestIsNowDone(src, -1);
                    statusMessagePretty(-1, src);
                    // this.bddTestIsNowDone(src, -1);
                    // statusMessagePretty(-1, src);
                });
            });
            child.send({ path: p });
            for (let i = 0; i <= portsToUse.length; i++) {
                if (portsToUse[i]) {
                    this.ports[portsToUse[i]] = "true"; //port is open again
                }
            }
        };
        this.launchWebSideCar = async (src, dest, testConfig) => {
            const d = dest + ".mjs";
            console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`launchWebSideCar ${src}`)));
            const fileStreams2 = [];
            const doneFileStream2 = [];
            return new Promise((res, rej) => {
                this.browser
                    .newPage()
                    .then((page) => {
                    // page.on("console", (msg) => {
                    //   console.log("web > ", msg.args(), msg.text());
                    //   // for (let i = 0; i < msg._args.length; ++i)
                    //   //   console.log(`${i}: ${msg._args[i]}`);
                    // });
                    page.exposeFunction("custom-screenshot", async (ssOpts, testName) => {
                        const p = ssOpts.path;
                        const dir = path_1.default.dirname(p);
                        fs_1.default.mkdirSync(dir, {
                            recursive: true,
                        });
                        files[testName].add(ssOpts.path);
                        const sPromise = page.screenshot(Object.assign(Object.assign({}, ssOpts), { path: p }));
                        if (!screenshots[testName]) {
                            screenshots[testName] = [];
                        }
                        screenshots[testName].push(sPromise);
                        await sPromise;
                        return sPromise;
                    });
                    page.exposeFunction("writeFileSync", (fp, contents, testName) => {
                        const dir = path_1.default.dirname(fp);
                        fs_1.default.mkdirSync(dir, {
                            recursive: true,
                        });
                        const p = new Promise(async (res, rej) => {
                            fs_1.default.writeFileSync(fp, contents);
                            res(fp);
                        });
                        doneFileStream2.push(p);
                        if (!files[testName]) {
                            files[testName] = new Set();
                        }
                        files[testName].add(fp);
                        return p;
                    });
                    page.exposeFunction("existsSync", (fp, contents) => {
                        return fs_1.default.existsSync(fp);
                    });
                    page.exposeFunction("mkdirSync", (fp) => {
                        if (!fs_1.default.existsSync(fp)) {
                            return fs_1.default.mkdirSync(fp, {
                                recursive: true,
                            });
                        }
                        return false;
                    });
                    page.exposeFunction("createWriteStream", (fp, testName) => {
                        const f = fs_1.default.createWriteStream(fp);
                        files[testName].add(fp);
                        const p = new Promise((res, rej) => {
                            res(fp);
                        });
                        doneFileStream2.push(p);
                        f.on("close", async () => {
                            await p;
                        });
                        fileStreams2.push(f);
                        return Object.assign(Object.assign({}, JSON.parse(JSON.stringify(f))), { uid: fileStreams2.length - 1 });
                    });
                    page.exposeFunction("write", async (uid, contents) => {
                        return fileStreams2[uid].write(contents);
                    });
                    page.exposeFunction("end", async (uid) => {
                        return fileStreams2[uid].end();
                    });
                    return page;
                })
                    .then(async (page) => {
                    await page.goto(`file://${`${dest}.html`}`, {});
                    /* @ts-ignore:next-line */
                    res(page);
                });
            });
        };
        this.launchNodeSideCar = async (src, dest, testConfig) => {
            const d = dest + ".mjs";
            console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`launchNodeSideCar ${src}`)));
            const destFolder = dest.replace(".mjs", "");
            let argz = "";
            const testConfigResource = testConfig[2];
            let portsToUse = [];
            if (testConfigResource.ports === 0) {
                argz = JSON.stringify({
                    scheduled: true,
                    name: src,
                    ports: portsToUse,
                    fs: destFolder,
                    browserWSEndpoint: this.browser.wsEndpoint(),
                });
            }
            else if (testConfigResource.ports > 0) {
                const openPorts = Object.entries(this.ports).filter(([portnumber, portopen]) => portopen);
                // console.log("openPorts", openPorts);
                if (openPorts.length >= testConfigResource.ports) {
                    for (let i = 0; i < testConfigResource.ports; i++) {
                        portsToUse.push(openPorts[i][0]);
                        this.ports[openPorts[i][0]] = false; // port is now closed
                    }
                    argz = JSON.stringify({
                        scheduled: true,
                        name: src,
                        // ports: [3333],
                        ports: portsToUse,
                        fs: ".",
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
            const builtfile = dest + ".mjs";
            await Promise.resolve(`${`${builtfile}?cacheBust=${Date.now()}`}`).then(s => __importStar(require(s))).then((module) => {
                return module.default.then((defaultModule) => {
                    // console.log("defaultModule", defaultModule);
                    const s = new defaultModule();
                    s.receiveTestResourceConfig(argz);
                    // Object.create(defaultModule);
                    // defaultModule
                    //   .receiveTestResourceConfig(argz)
                    //   .then((x) => {
                    //     console.log("then", x);
                    //     return x;
                    //   })
                    //   .catch((e) => {
                    //     console.log("catch", e);
                    //   });
                });
            });
            for (let i = 0; i <= portsToUse.length; i++) {
                if (portsToUse[i]) {
                    this.ports[portsToUse[i]] = "true"; //port is open again
                }
            }
        };
        this.launchWeb = async (src, dest) => {
            console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`! web ${src}`)));
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
                name: dest,
                ports: [].toString(),
                fs: reportDest,
                browserWSEndpoint: this.browser.wsEndpoint(),
            });
            const d = `${dest}?cacheBust=${Date.now()}`;
            const evaluation = `

    import('${d}').then(async (x) => {

      try {
        return await (await x.default).receiveTestResourceConfig(${webArgz})
      } catch (e) {
        console.log("fail", e)
      }
    })`;
            const oStream = fs_1.default.createWriteStream(`${reportDest}/console_log.txt`);
            this.browser
                .newPage()
                .then((page) => {
                // set up the "node" listeners
                this.mapping().forEach(async ([command, func]) => {
                    page.exposeFunction(command, func);
                });
                return page;
            })
                .then(async (page) => {
                const close = () => {
                    if (!files[src]) {
                        files[src] = new Set();
                    }
                    // files[t].add(filepath);
                    fs_1.default.writeFileSync(destFolder + "/manifest.json", JSON.stringify(Array.from(files[src])));
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
                await page
                    .evaluate(evaluation)
                    .then(async ({ fails, failed, features }) => {
                    this.receiveFeatures(features, destFolder, src, "web");
                    statusMessagePretty(fails, src);
                    this.bddTestIsNowDone(src, fails);
                })
                    .catch((e) => {
                    console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`${src} errored with: ${e}`)));
                })
                    .finally(() => {
                    this.bddTestIsNowDone(src, -1);
                    close();
                });
                return page;
            });
        };
        this.receiveFeatures = (features, destFolder, srcTest, platform) => {
            const featureDestination = path_1.default.resolve(process.cwd(), "reports", "features", "strings", srcTest.split(".").slice(0, -1).join(".") + ".features.txt");
            features
                .reduce(async (mm, featureStringKey) => {
                const accum = await mm;
                const isUrl = isValidUrl(featureStringKey);
                if (isUrl) {
                    const u = new URL(featureStringKey);
                    if (u.protocol === "file:") {
                        const newPath = `${process.cwd()}/testeranto/features/internal/${path_1.default.relative(process.cwd(), u.pathname)}`;
                        await fs_1.default.promises.mkdir(path_1.default.dirname(newPath), { recursive: true });
                        try {
                            await fs_1.default.unlinkSync(newPath);
                            // console.log(`Removed existing link at ${newPath}`);
                        }
                        catch (error) {
                            if (error.code !== "ENOENT") {
                                // throw error;
                            }
                        }
                        // fs.symlink(u.pathname, newPath, (err) => {
                        //   if (err) {
                        //     // console.error("Error creating symlink:", err);
                        //   } else {
                        //     // console.log("Symlink created successfully");
                        //   }
                        // });
                        accum.files.push(newPath);
                    }
                    else if (u.protocol === "http:" || u.protocol === "https:") {
                        const newPath = `${process.cwd()}/testeranto/features/external${u.hostname}${u.pathname}`;
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
                fs_1.default.writeFileSync(`testeranto/reports/${this.name}/${srcTest
                    .split(".")
                    .slice(0, -1)
                    .join(".")}/${platform}/featurePrompt.txt`, files
                    .map((f) => {
                    return `/read ${f}`;
                })
                    .join("\n"));
            });
        };
        this.writeBigBoard = () => {
            fs_1.default.writeFileSync(`./testeranto/reports/${this.name}/summary.json`, JSON.stringify(this.bigBoard, null, 2));
        };
        this.name = name;
        this.mode = mode;
        this.ports = {};
        this.configs.tests.forEach(([t]) => {
            this.bigBoard[t] = {
                runTimeError: "?",
                typeErrors: "?",
                staticErrors: "?",
                prompt: "?",
            };
        });
        this.configs.ports.forEach((element) => {
            this.ports[element] = "true"; // set ports as open
        });
    }
    mapping() {
        return [
            ["$", this.$],
            ["click", this.click],
            ["closePage", this.closePage],
            ["createWriteStream", this.createWriteStream],
            ["customclose", this.customclose],
            ["customScreenShot", this.customScreenShot],
            ["end", this.end],
            ["existsSync", this.existsSync],
            ["focusOn", this.focusOn],
            ["getAttribute", this.getAttribute],
            ["getValue", this.getValue],
            ["goto", this.goto],
            ["isDisabled", this.isDisabled],
            ["mkdirSync", this.mkdirSync],
            ["newPage", this.newPage],
            ["page", this.page],
            ["pages", this.pages],
            ["screencast", this.screencast],
            ["screencastStop", this.screencastStop],
            ["typeInto", this.typeInto],
            ["waitForSelector", this.waitForSelector],
            ["write", this.write],
            ["writeFileSync", this.writeFileSync],
        ];
    }
    async start() {
        // set up the "pure" listeners
        this.mapping().forEach(async ([command, func]) => {
            // page.exposeFunction(command, func);
            globalThis[command] = func;
        });
        if (!fs_1.default.existsSync(`testeranto/reports/${this.name}`)) {
            fs_1.default.mkdirSync(`testeranto/reports/${this.name}`);
        }
        // await pollForFile();
        this.browser = (await puppeteer_core_1.default.launch({
            slowMo: 1,
            waitForInitialPage: false,
            executablePath: 
            // process.env.CHROMIUM_PATH || "/opt/homebrew/bin/chromium",
            "/opt/homebrew/bin/chromium",
            headless: true,
            dumpio: false,
            devtools: false,
            args: [
                "--allow-file-access-from-files",
                "--allow-insecure-localhost",
                "--allow-running-insecure-content",
                "--auto-open-devtools-for-tabs",
                "--disable-dev-shm-usage",
                "--disable-extensions",
                "--disable-gpu",
                "--disable-setuid-sandbox",
                "--disable-site-isolation-trials",
                "--disable-site-isolation-trials",
                "--disable-web-security",
                "--no-first-run",
                "--no-sandbox",
                "--no-startup-window",
                "--reduce-security-for-testing",
                "--remote-allow-origins=*",
                `--remote-debugging-port=3234`,
                "--unsafely-treat-insecure-origin-as-secure=*",
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
        }));
        const { nodeEntryPoints, webEntryPoints, importEntryPoints } = this.getRunnables(this.configs.tests, this.name);
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
                importEntryPoints,
                this.launchPure,
                "pure",
                (w) => {
                    this.importMetafileWatcher = w;
                },
            ],
        ].forEach(async ([eps, launcher, runtime, watcher]) => {
            const metafile = `./testeranto/bundles/${runtime}/${this.name}/metafile.json`;
            await pollForFile(metafile);
            Object.entries(eps).forEach(async ([k, outputFile]) => {
                // await pollForFile(outputFile);
                launcher(k, outputFile);
                try {
                    (0, fs_1.watch)(outputFile, async (e, filename) => {
                        const hash = await fileHash(outputFile);
                        if (fileHashes[k] !== hash) {
                            fileHashes[k] = hash;
                            console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`< ${e} ${filename}`)));
                            launcher(k, outputFile);
                        }
                    });
                }
                catch (e) {
                    console.error(e);
                }
            });
            this.metafileOutputs(runtime);
            watcher((0, fs_1.watch)(metafile, async (e, filename) => {
                console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`< ${e} ${filename} (${runtime})`)));
                this.metafileOutputs(runtime);
            }));
        });
    }
    async stop() {
        console.log(ansi_colors_1.default.inverse("Testeranto-Run is shutting down gracefully..."));
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
            const addableFiles = Object.keys(outputs[k].inputs).filter((i) => {
                if (!fs_1.default.existsSync(i))
                    return false;
                if (i.startsWith("node_modules"))
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
                        entrypoint: "./" + entrypoint,
                    });
                    this.eslintCheck("./" + entrypoint, platform, addableFiles);
                    this.makePrompt("./" + entrypoint, addableFiles, platform);
                }
            }
        });
    }
}
exports.PM_Main = PM_Main;
