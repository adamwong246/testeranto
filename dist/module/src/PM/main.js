/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { spawn } from "node:child_process";
import ts from "typescript";
import net from "net";
import fs, { watch } from "fs";
import path from "path";
import puppeteer from "puppeteer-core";
import ansiC from "ansi-colors";
import crypto from "node:crypto";
import { ESLint } from "eslint";
import tsc from "tsc-prog";
import { getRunnables, lintPather, promptPather, tscPather } from "../utils";
import { PM_Base } from "./base.js";
import { Queue } from "../utils/queue.js";
const eslint = new ESLint();
const formatter = await eslint.loadFormatter("./node_modules/testeranto/dist/prebuild/esbuildConfigs/eslint-formatter-testeranto.mjs");
const changes = {};
const fileHashes = {};
const files = {};
const screenshots = {};
async function fileHash(filePath, algorithm = "md5") {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        const fileStream = fs.createReadStream(filePath);
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
        console.log(ansiC.green(ansiC.inverse(`> ${test} completed successfully?!?`)));
    }
    else {
        console.log(ansiC.red(ansiC.inverse(`> ${test} failed ${failures} times`)));
    }
};
async function writeFileAndCreateDir(filePath, data) {
    const dirPath = path.dirname(filePath);
    try {
        await fs.promises.mkdir(dirPath, { recursive: true });
        await fs.writeFileSync(filePath, data);
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
        const fileExists = fs.existsSync(file);
        // console.log("Checking for: ", file);
        // console.log("Exists: ", fileExists);
        if (fileExists) {
            clearInterval(intervalObj);
        }
    }, timeout);
}
export class PM_Main extends PM_Base {
    constructor(configs, name, mode) {
        super(configs);
        this.summary = {};
        this.getRunnables = (tests, testName, payload = {
            nodeEntryPoints: {},
            nodeEntryPointSidecars: {},
            webEntryPoints: {},
            webEntryPointSidecars: {},
            pureEntryPoints: {},
            pureEntryPointSidecars: {},
        }) => {
            return getRunnables(tests, testName, payload);
        };
        this.tscCheck = async ({ entrypoint, addableFiles, platform, }) => {
            console.log(ansiC.green(ansiC.inverse(`tsc < ${entrypoint}`)));
            this.typeCheckIsRunning(entrypoint);
            const program = tsc.createProgramFromConfig({
                basePath: process.cwd(), // always required, used for relative paths
                configFilePath: "tsconfig.json", // config to inherit from (optional)
                compilerOptions: {
                    outDir: tscPather(entrypoint, platform, this.name),
                    // declaration: true,
                    // skipLibCheck: true,
                    noEmit: true,
                },
                include: addableFiles, //["src/**/*"],
                // exclude: ["node_modules", "../testeranto"],
                // exclude: ["**/*.test.ts", "**/*.spec.ts"],
            });
            const tscPath = tscPather(entrypoint, platform, this.name);
            const allDiagnostics = program.getSemanticDiagnostics();
            const results = [];
            allDiagnostics.forEach((diagnostic) => {
                if (diagnostic.file) {
                    const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
                    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                    results.push(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
                }
                else {
                    results.push(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
                }
            });
            fs.writeFileSync(tscPath, results.join("\n"));
            this.typeCheckIsNowDone(entrypoint, results.length);
        };
        this.eslintCheck = async (entrypoint, platform, addableFiles) => {
            console.log(ansiC.green(ansiC.inverse(`eslint < ${entrypoint}`)));
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
            fs.writeFileSync(lintPather(entrypoint, platform, this.name), await formatter.format(results));
            this.lintIsNowDone(entrypoint, results.length);
        };
        this.makePrompt = async (entryPoint, addableFiles, platform) => {
            this.summary[entryPoint].prompt = "?";
            const promptPath = promptPather(entryPoint, platform, this.name);
            const testPaths = path.join("testeranto", "reports", this.name, platform, entryPoint.split(".").slice(0, -1).join("."), `tests.json`);
            const featuresPath = path.join("testeranto", "reports", this.name, platform, entryPoint.split(".").slice(0, -1).join("."), `featurePrompt.txt`);
            fs.writeFileSync(promptPath, `
${addableFiles
                .map((x) => {
                return `/add ${x}`;
            })
                .join("\n")}

/read ${lintPather(entryPoint, platform, this.name)}
/read ${tscPather(entryPoint, platform, this.name)}
/read ${testPaths}

/load ${featuresPath}

/code Fix the failing tests described in ${testPaths}. Correct any type signature errors described in the files ${tscPather(entryPoint, platform, this.name)}. Implement any method which throws "Function not implemented. Resolve the lint errors described in ${lintPather(entryPoint, platform, this.name)}"
          `);
            this.summary[entryPoint].prompt = `aider --model deepseek/deepseek-chat --load testeranto/${this.name}/reports/${platform}/${entryPoint
                .split(".")
                .slice(0, -1)
                .join(".")}/prompt.txt`;
            this.checkForShutdown();
        };
        this.checkForShutdown = () => {
            console.log(ansiC.inverse(`checkForShutdown`));
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
                if (this.summary[k].runTimeError === "?") {
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
                this.browser.disconnect().then(() => {
                    console.log(ansiC.inverse(`${this.name} has been tested. Goodbye.`));
                    process.exit();
                });
            }
        };
        this.typeCheckIsRunning = (src) => {
            this.summary[src].typeErrors = "?";
        };
        this.typeCheckIsNowDone = (src, failures) => {
            this.summary[src].typeErrors = failures;
            this.writeBigBoard();
            this.checkForShutdown();
        };
        this.lintIsRunning = (src) => {
            this.summary[src].staticErrors = "?";
            this.writeBigBoard();
        };
        this.lintIsNowDone = (src, failures) => {
            this.summary[src].staticErrors = failures;
            this.writeBigBoard();
            this.checkForShutdown();
        };
        this.bddTestIsRunning = (src) => {
            this.summary[src].runTimeError = "?";
            this.writeBigBoard();
        };
        this.bddTestIsNowDone = (src, failures) => {
            this.summary[src].runTimeError = failures;
            this.writeBigBoard();
            this.checkForShutdown();
        };
        this.launchPure = async (src, dest) => {
            console.log(ansiC.green(ansiC.inverse(`! pure, ${src}`)));
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
                await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
                    return module.default
                        .then((defaultModule) => {
                        defaultModule
                            .receiveTestResourceConfig(argz)
                            .then(async (results) => {
                            // this.receiveFeatures(results.features, destFolder, src, "pure");
                            // this.receiveFeaturesV2(reportDest, src, "pure");
                            statusMessagePretty(results.fails, src);
                            this.bddTestIsNowDone(src, results.fails);
                        })
                            .catch((e) => {
                            console.log(ansiC.red(ansiC.inverse(`launchPure - ${src} errored with: ${e}`)));
                            this.bddTestIsNowDone(src, -1);
                        });
                        // .finally(() => {
                        //   // webSideCares.forEach((webSideCar) => webSideCar.close());
                        // });
                    })
                        .catch((e) => {
                        console.log(ansiC.red(ansiC.inverse(`${src} errored with: ${e}. Check ${reportDest}/error.txt for more info`)));
                        this.writeFileSync(`${reportDest}/error.txt`, e.stack, src);
                        this.bddTestIsNowDone(src, -1);
                        statusMessagePretty(-1, src);
                        // console.error(e);
                    });
                });
            }
            catch (e) {
                console.log(ansiC.red(ansiC.inverse(`${src} errored with: ${e}. Check ${reportDest}/error.txt for more info`)));
                this.writeFileSync(`${reportDest}/error.txt`, e.stack, src);
                this.bddTestIsNowDone(src, -1);
                statusMessagePretty(-1, src);
            }
            for (let i = 0; i <= portsToUse.length; i++) {
                if (portsToUse[i]) {
                    this.ports[portsToUse[i]] = true; //port is open again
                }
            }
        };
        this.launchNode = async (src, dest) => {
            console.log(ansiC.green(ansiC.inverse(`! node, ${src}`)));
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src
                .split(".")
                .slice(0, -1)
                .join(".")}/node`;
            if (!fs.existsSync(reportDest)) {
                fs.mkdirSync(reportDest, { recursive: true });
            }
            // const destFolder = dest.replace(".mjs", "");
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
                console.error("portsToUse?!", []);
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
                const openPorts = Object.entries(this.ports).filter(([portnumber, portopen]) => portopen);
                if (openPorts.length >= testConfigResource.ports) {
                    for (let i = 0; i < testConfigResource.ports; i++) {
                        portsToUse.push(openPorts[i][0]);
                        this.ports[openPorts[i][0]] = false; // port is now closed
                    }
                    console.error("portsToUse", portsToUse);
                    testResources = JSON.stringify({
                        scheduled: true,
                        name: src,
                        ports: portsToUse,
                        fs: reportDest,
                        browserWSEndpoint: this.browser.wsEndpoint(),
                    });
                }
                else {
                    console.log("Not enough ports! Enqueuing test job...");
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
            const child = spawn("node", [builtfile, testResources, ipcfile], {
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
            const oStream = fs.createWriteStream(`${reportDest}/console_log.txt`);
            const errFile = `${reportDest}/error.txt`;
            if (fs.existsSync(errFile)) {
                fs.rmSync(errFile);
            }
            server.listen(ipcfile, () => {
                var _a, _b;
                (_a = child.stderr) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                    oStream.write(`stderr > ${data}`);
                });
                (_b = child.stdout) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
                    oStream.write(`stdout > ${data}`);
                });
                child.on("close", (code) => {
                    console.log("close");
                    oStream.close();
                    server.close();
                    // this.receiveFeaturesV2(reportDest, src, "node");
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
                    haltReturns = true;
                });
                child.on("exit", (code) => {
                    console.log("exit");
                    haltReturns = true;
                    for (let i = 0; i <= portsToUse.length; i++) {
                        if (portsToUse[i]) {
                            this.ports[portsToUse[i]] = true; //port is open again
                        }
                    }
                    console.log("exitthis.ports", this.ports);
                });
                child.on("error", (e) => {
                    console.log("error");
                    haltReturns = true;
                    console.log(ansiC.red(ansiC.inverse(`${src} errored with: ${e.name}. Check ${errFile}for more info`)));
                    this.writeFileSync(`${reportDest}/error.txt`, e.toString(), src);
                    this.bddTestIsNowDone(src, -1);
                    statusMessagePretty(-1, src);
                });
            });
        };
        this.launchWebSideCar = async (
        // src: string,
        // dest: string,
        testConfig) => {
            const src = testConfig[0];
            const dest = src.split(".").slice(0, -1).join(".");
            // const d = dest + ".mjs";
            const destFolder = dest.replace(".mjs", "");
            console.log(ansiC.green(ansiC.inverse(`launchWebSideCar ${src}`)));
            const fileStreams2 = [];
            const doneFileStream2 = [];
            const oStream = fs.createWriteStream(`${destFolder}/console_log.txt`);
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
                        // files[t].add(filepath);
                        fs.writeFileSync(destFolder + "/manifest.json", JSON.stringify(Array.from(files[src])));
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
                        statusMessagePretty(fails, src);
                        this.bddTestIsNowDone(src, fails);
                    })
                        .catch((e) => {
                        console.log(ansiC.red(ansiC.inverse(`launchWebSidecar - ${src} errored with: ${e}`)));
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
            console.log(ansiC.green(ansiC.inverse(`launchNodeSideCar ${sidecar[0]}`)));
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
                const openPorts = Object.entries(this.ports).filter(([portnumber, portopen]) => portopen);
                if (openPorts.length >= testReq.ports) {
                    for (let i = 0; i < testReq.ports; i++) {
                        portsToUse.push(openPorts[i][0]);
                        this.ports[openPorts[i][0]] = false; // port is now closed
                    }
                    console.log("nodeSideCar portsToUse", portsToUse);
                    argz.ports = portsToUse;
                    const builtfile = destFolder + ".mjs";
                    let haltReturns = false;
                    let buffer = new Buffer("");
                    const server = net.createServer((socket) => {
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
                    const oStream = fs.createWriteStream(`${reportDest}/console_log.txt`);
                    const child = spawn("node", [builtfile, JSON.stringify(argz)], {
                        stdio: ["pipe", "pipe", "pipe", "ipc"],
                        // silent: true
                    });
                    const p = "/tmp/tpipe" + Math.random();
                    const errFile = `${reportDest}/error.txt`;
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
                                    this.ports[portsToUse[i]] = true; //port is open again
                                }
                            }
                        });
                        child.on("error", (e) => {
                            if (fs.existsSync(p)) {
                                fs.rmSync(p);
                            }
                            haltReturns = true;
                            console.log(ansiC.red(ansiC.inverse(`launchNodeSideCar - ${src} errored with: ${e.name}. Check ${errFile}for more info`)));
                            this.writeFileSync(`${reportDest}/error.txt`, e.toString(), src);
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
                    console.log("Not enough open ports!", openPorts, testReq.ports);
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
            console.log(ansiC.green(ansiC.inverse(`stopPureSideCar ${uid}`)));
            await this.sidecars[uid].shutdown();
            return;
        };
        this.launchPureSideCar = async (sidecar) => {
            console.log(ansiC.green(ansiC.inverse(`launchPureSideCar ${sidecar[0]}`)));
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
                const openPorts = Object.entries(this.ports).filter(([portnumber, portopen]) => portopen);
                // console.log("openPorts", openPorts);
                if (openPorts.length >= testConfigResource.ports) {
                    for (let i = 0; i < testConfigResource.ports; i++) {
                        portsToUse.push(openPorts[i][0]);
                        this.ports[openPorts[i][0]] = false; // port is now closed
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
            await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
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
            console.log(ansiC.green(ansiC.inverse(`! web ${src}`)));
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
            const evaluation = `

    import('${d}').then(async (x) => {

      try {
        return await (await x.default).receiveTestResourceConfig(${webArgz})
      } catch (e) {
        console.log("fail", e)
      }
    })`;
            const oStream = fs.createWriteStream(`${reportDest}/console_log.txt`);
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
                    fs.writeFileSync(destFolder + "/manifest.json", JSON.stringify(Array.from(files[src])));
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
                    oStream.write("\n");
                    oStream.write(JSON.stringify(log.location()));
                    oStream.write("\n");
                    oStream.write(JSON.stringify(log.stackTrace()));
                    oStream.write("\n");
                });
                await page.goto(`file://${`${destFolder}.html`}`, {});
                this.webSidecars[Math.random()] = page.mainFrame()._id;
                await page
                    .evaluate(evaluation)
                    .then(async ({ fails, failed, features }) => {
                    // this.receiveFeatures(features, destFolder, src, "web");
                    // this.receiveFeaturesV2(reportDest, src, "web");
                    statusMessagePretty(fails, src);
                    this.bddTestIsNowDone(src, fails);
                })
                    .catch((e) => {
                    console.log(ansiC.red(ansiC.inverse(`launchweb - ${src} errored with: ${e}`)));
                })
                    .finally(() => {
                    this.bddTestIsNowDone(src, -1);
                    // process.exit(-1);
                    close();
                });
                return page;
            });
        };
        this.receiveFeaturesV2 = (reportDest, srcTest, platform) => {
            const featureDestination = path.resolve(process.cwd(), "reports", "features", "strings", srcTest.split(".").slice(0, -1).join(".") + ".features.txt");
            const testReport = JSON.parse(fs.readFileSync(`${reportDest}/tests.json`).toString());
            // console.log("mark2", testReport);
            testReport.features
                .reduce(async (mm, featureStringKey) => {
                // console.log("mark4", featureStringKey);
                const accum = await mm;
                const isUrl = isValidUrl(featureStringKey);
                if (isUrl) {
                    const u = new URL(featureStringKey);
                    if (u.protocol === "file:") {
                        const newPath = `${process.cwd()}/testeranto/features/internal/${path.relative(process.cwd(), u.pathname)}`;
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
                    await fs.promises.mkdir(path.dirname(featureDestination), {
                        recursive: true,
                    });
                    accum.strings.push(featureStringKey);
                }
                return accum;
            }, Promise.resolve({ files: [], strings: [] }))
                .then(({ files, strings }) => {
                // Markdown files must be referenced in the prompt but string style features are already present in the test.json file
                fs.writeFileSync(`testeranto/reports/${this.name}/${srcTest
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
        this.writeBigBoard = () => {
            fs.writeFileSync(`./testeranto/reports/${this.name}/summary.json`, JSON.stringify(this.summary, null, 2));
        };
        this.name = name;
        this.mode = mode;
        this.ports = {};
        this.queue = [];
        this.configs.tests.forEach(([t, rt, tr, sidecars]) => {
            this.summary[t] = {
                runTimeError: "?",
                typeErrors: "?",
                staticErrors: "?",
                prompt: "?",
                failingFeatures: {},
            };
            sidecars.forEach(([t]) => {
                this.summary[t] = {
                    // runTimeError: "?",
                    typeErrors: "?",
                    staticErrors: "?",
                    // prompt: "?",
                    // failingFeatures: {},
                };
            });
        });
        this.nodeSidecars = {};
        this.webSidecars = {};
        this.pureSidecars = {};
        this.configs.ports.forEach((element) => {
            this.ports[element] = true; // set ports as open
        });
    }
    async stopSideCar(uid) {
        console.log(ansiC.green(ansiC.inverse(`stopSideCar ${uid}`)));
        // console.log("this.pureSidecars", this.pureSidecars);
        // console.log("this.nodeSidecars", this.nodeSidecars);
        // console.log("this.webSidecars", this.webSidecars);
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
        if (!fs.existsSync(`testeranto/reports/${this.name}`)) {
            fs.mkdirSync(`testeranto/reports/${this.name}`);
        }
        const executablePath = "/opt/homebrew/bin/chromium";
        try {
            this.browser = await puppeteer.launch({
                slowMo: 1,
                waitForInitialPage: false,
                executablePath,
                headless: true,
                dumpio: false,
                devtools: false,
                args: [
                    "--disable-features=site-per-process",
                    "--allow-file-access-from-files",
                    "--allow-insecure-localhost",
                    "--allow-running-insecure-content",
                    "--auto-open-devtools-for-tabs",
                    "--disable-dev-shm-usage",
                    "--disable-extensions",
                    "--disable-gpu",
                    "--disable-setuid-sandbox",
                    "--disable-site-isolation-trials",
                    "--disable-web-security",
                    "--no-first-run",
                    "--no-sandbox",
                    "--no-startup-window",
                    "--reduce-security-for-testing",
                    "--remote-allow-origins=*",
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
            Object.entries(eps).forEach(async ([k, outputFile]) => {
                // await pollForFile(outputFile);
                launcher(k, outputFile);
                try {
                    watch(outputFile, async (e, filename) => {
                        const hash = await fileHash(outputFile);
                        if (fileHashes[k] !== hash) {
                            fileHashes[k] = hash;
                            console.log(ansiC.yellow(ansiC.inverse(`< ${e} ${filename}`)));
                            launcher(k, outputFile);
                        }
                    });
                }
                catch (e) {
                    console.error(e);
                }
            });
            this.metafileOutputs(runtime);
            watcher(watch(metafile, async (e, filename) => {
                console.log(ansiC.yellow(ansiC.inverse(`< ${e} ${filename} (${runtime})`)));
                this.metafileOutputs(runtime);
            }));
        });
        // Object.keys(this.configs.externalTests).forEach((et) => {
        //   this.launchExternalTest(et, this.configs.externalTests[et]);
        // });
    }
    async launchExternalTest(externalTestName, externalTest) {
        // fs.mkdirSync(`testeranto/externalTests/${externalTestName}`);
        // exec(externalTest.exec, (error, stdout, stderr) => {
        //   if (error) {
        //     fs.writeFileSync(
        //       `testeranto/externalTests/${externalTestName}/exitcode.txt`,
        //       `${error.name}\n${error.message}\n${error.code}\n`
        //     );
        //   } else {
        //     fs.writeFileSync(
        //       `testeranto/externalTests/${externalTestName}/exitcode.txt`,
        //       `0`
        //     );
        //   }
        //   fs.writeFileSync(
        //     `testeranto/externalTests/${externalTestName}/stdout.txt`,
        //     stdout
        //   );
        //   fs.writeFileSync(
        //     `testeranto/externalTests/${externalTestName}/stderr.txt`,
        //     stderr
        //   );
        //   // console.log(`externalTest stdout: ${stdout}`);
        //   // console.error(`externalTest stderr: ${stderr}`);
        // });
    }
    async stop() {
        console.log(ansiC.inverse("Testeranto-Run is shutting down gracefully..."));
        this.mode = "once";
        this.nodeMetafileWatcher.close();
        this.webMetafileWatcher.close();
        this.importMetafileWatcher.close();
        this.checkForShutdown();
    }
    async metafileOutputs(platform) {
        const metafile = JSON.parse(fs
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
                        entrypoint: "./" + entrypoint,
                    });
                    this.eslintCheck("./" + entrypoint, platform, addableFiles);
                    this.makePrompt("./" + entrypoint, addableFiles, platform);
                }
            }
        });
    }
}
