import ts from "typescript";
import fs, { watch } from "fs";
import path from "path";
import puppeteer from "puppeteer-core";
import ansiC from "ansi-colors";
import crypto from "node:crypto";
import { ESLint } from "eslint";
import tsc from "tsc-prog";
import { lintPather, promptPather, tscPather } from "../utils";
import { PM_Base } from "./base.js";
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
        console.log(ansiC.green(ansiC.inverse(`> ${test} completed successfully`)));
    }
    else {
        console.log(ansiC.red(ansiC.inverse(`> ${test} failed ${failures} times`)));
    }
};
async function writeFileAndCreateDir(filePath, data) {
    const dirPath = path.dirname(filePath);
    try {
        await fs.promises.mkdir(dirPath, { recursive: true });
        await fs.appendFileSync(filePath, data);
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
export class PM_Main extends PM_Base {
    constructor(configs, name, mode) {
        super(configs);
        this.bigBoard = {};
        this.stop = () => {
            console.log(ansiC.inverse("Testeranto-Run is shutting down gracefully..."));
            this.mode = "once";
            this.nodeMetafileWatcher.close();
            this.webMetafileWatcher.close();
            this.checkForShutdown();
        };
        this.getRunnables = (tests, payload = {
            nodeEntryPoints: {},
            webEntryPoints: {},
        }) => {
            return tests.reduce((pt, cv, cndx, cry) => {
                if (cv[1] === "node") {
                    pt.nodeEntryPoints[cv[0]] = path.resolve(`./testeranto/bundles/node/${this.name}/${cv[0]
                        .split(".")
                        .slice(0, -1)
                        .concat("mjs")
                        .join(".")}`);
                }
                else if (cv[1] === "web") {
                    pt.webEntryPoints[cv[0]] = path.resolve(`./testeranto/bundles/web/${this.name}/${cv[0]
                        .split(".")
                        .slice(0, -1)
                        .concat("mjs")
                        .join(".")}`);
                }
                if (cv[3].length) {
                    this.getRunnables(cv[3], payload);
                }
                return pt;
            }, payload);
        };
        this.tscCheck = async ({ entrypoint, addableFiles, platform, }) => {
            console.log(ansiC.green(ansiC.inverse(`tsc < ${entrypoint}`)));
            this.typeCheckIsRunning(entrypoint);
            const program = tsc.createProgramFromConfig({
                basePath: process.cwd(), // always required, used for relative paths
                configFilePath: "tsconfig.json", // config to inherit from (optional)
                compilerOptions: {
                    rootDir: "src",
                    outDir: tscPather(entrypoint, platform, this.name),
                    // declaration: true,
                    // skipLibCheck: true,
                    noEmit: true,
                },
                include: addableFiles, //["src/**/*"],
                // exclude: ["**/*.test.ts", "**/*.spec.ts"],
            });
            const tscPath = tscPather(entrypoint, platform, this.name);
            let allDiagnostics = program.getSemanticDiagnostics();
            const results = [];
            allDiagnostics.forEach((diagnostic) => {
                if (diagnostic.file) {
                    let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
                    let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
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
            this.bigBoard[entryPoint].prompt = "?";
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
                    console.log(ansiC.blue(ansiC.inverse(`🕕 prompt ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.bigBoard).forEach((k) => {
                if (this.bigBoard[k].runTimeError === "?") {
                    console.log(ansiC.blue(ansiC.inverse(`🕕 runTimeError ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.bigBoard).forEach((k) => {
                if (this.bigBoard[k].staticErrors === "?") {
                    console.log(ansiC.blue(ansiC.inverse(`🕕 staticErrors ${k}`)));
                    inflight = true;
                }
            });
            Object.keys(this.bigBoard).forEach((k) => {
                if (this.bigBoard[k].typeErrors === "?") {
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
                        // ports: [3333],
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
            this.server[builtfile] = await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
                return module.default.then((defaultModule) => {
                    defaultModule
                        .receiveTestResourceConfig(argz)
                        .then(async ({ features, failed }) => {
                        this.receiveFeatures(features, destFolder, src, "node");
                        statusMessagePretty(failed, src);
                        this.bddTestIsNowDone(src, failed);
                    })
                        .catch((e) => {
                        console.log(ansiC.red(ansiC.inverse(`${src} errored with: ${e}`)));
                        this.bddTestIsNowDone(src, -1);
                    })
                        .finally(() => {
                        webSideCares.forEach((webSideCar) => webSideCar.close());
                    });
                });
            });
            // console.log("portsToUse", portsToUse);
            for (let i = 0; i <= portsToUse.length; i++) {
                if (portsToUse[i]) {
                    this.ports[portsToUse[i]] = "true"; //port is open again
                }
            }
        };
        this.launchWebSideCar = async (src, dest, testConfig) => {
            const d = dest + ".mjs";
            console.log(ansiC.green(ansiC.inverse(`launchWebSideCar ${src}`)));
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
                        const dir = path.dirname(p);
                        fs.mkdirSync(dir, {
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
                        const dir = path.dirname(fp);
                        fs.mkdirSync(dir, {
                            recursive: true,
                        });
                        const p = new Promise(async (res, rej) => {
                            fs.writeFileSync(fp, contents);
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
                        return fs.existsSync(fp);
                    });
                    page.exposeFunction("mkdirSync", (fp) => {
                        if (!fs.existsSync(fp)) {
                            return fs.mkdirSync(fp, {
                                recursive: true,
                            });
                        }
                        return false;
                    });
                    page.exposeFunction("createWriteStream", (fp, testName) => {
                        const f = fs.createWriteStream(fp);
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
            console.log(ansiC.green(ansiC.inverse(`launchNodeSideCar ${src}`)));
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
            this.server[builtfile] = await import(`${builtfile}?cacheBust=${Date.now()}`).then((module) => {
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
        this.launchWeb = (src, dest) => {
            console.log(ansiC.green(ansiC.inverse(`! web ${src}`)));
            this.bddTestIsRunning(src);
            const reportDest = `testeranto/reports/${this.name}/${src
                .split(".")
                .slice(0, -1)
                .join(".")}/web`;
            if (!fs.existsSync(reportDest)) {
                fs.mkdirSync(reportDest, { recursive: true });
            }
            // sidecars.map((sidecar) => {
            //   if (sidecar[1] === "node") {
            //     return this.launchNodeSideCar(
            //       sidecar[0],
            //       destinationOfRuntime(sidecar[0], "node", this.configs),
            //       sidecar
            //     );
            //   }
            // });
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
            const fileStreams2 = [];
            const doneFileStream2 = [];
            const stdoutStream = fs.createWriteStream(`${destFolder}/stdout.log`);
            const stderrStream = fs.createWriteStream(`${destFolder}/stderr.log`);
            this.browser
                .newPage()
                .then((page) => {
                page.on("console", (msg) => {
                    console.log("web > ", msg.args(), msg.text());
                });
                page.exposeFunction("screencast", async (ssOpts, testName) => {
                    const p = ssOpts.path;
                    const dir = path.dirname(p);
                    fs.mkdirSync(dir, {
                        recursive: true,
                    });
                    if (!files[testName]) {
                        files[testName] = new Set();
                    }
                    files[testName].add(ssOpts.path);
                    const sPromise = page.screenshot(Object.assign(Object.assign({}, ssOpts), { path: p }));
                    if (!screenshots[testName]) {
                        screenshots[testName] = [];
                    }
                    screenshots[testName].push(sPromise);
                    // sPromise.then(())
                    await sPromise;
                    return sPromise;
                    // page.evaluate(`window["screenshot done"]`);
                });
                page.exposeFunction("customScreenShot", async (ssOpts, testName) => {
                    const p = ssOpts.path;
                    const dir = path.dirname(p);
                    fs.mkdirSync(dir, {
                        recursive: true,
                    });
                    if (!files[testName]) {
                        files[testName] = new Set();
                    }
                    files[testName].add(ssOpts.path);
                    const sPromise = page.screenshot(Object.assign(Object.assign({}, ssOpts), { path: p }));
                    if (!screenshots[testName]) {
                        screenshots[testName] = [];
                    }
                    screenshots[testName].push(sPromise);
                    // sPromise.then(())
                    await sPromise;
                    return sPromise;
                    // page.evaluate(`window["screenshot done"]`);
                });
                page.exposeFunction("writeFileSync", (fp, contents, testName) => {
                    return globalThis["writeFileSync"](fp, contents, testName);
                    // const dir = path.dirname(fp);
                    // fs.mkdirSync(dir, {
                    //   recursive: true,
                    // });
                    // const p = new Promise<string>(async (res, rej) => {
                    //   fs.writeFileSync(fp, contents);
                    //   res(fp);
                    // });
                    // doneFileStream2.push(p);
                    // if (!files[testName]) {
                    //   files[testName] = new Set();
                    // }
                    // files[testName].add(fp);
                    // return p;
                });
                page.exposeFunction("existsSync", (fp, contents) => {
                    return fs.existsSync(fp);
                });
                page.exposeFunction("mkdirSync", (fp) => {
                    if (!fs.existsSync(fp)) {
                        return fs.mkdirSync(fp, {
                            recursive: true,
                        });
                    }
                    return false;
                });
                page.exposeFunction("createWriteStream", (fp, testName) => {
                    const f = fs.createWriteStream(fp);
                    if (!files[testName]) {
                        files[testName] = new Set();
                    }
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
                page.exposeFunction("page", () => {
                    return page.mainFrame()._id;
                });
                page.exposeFunction("click", (sel) => {
                    return page.click(sel);
                });
                page.exposeFunction("focusOn", (sel) => {
                    return page.focus(sel);
                });
                page.exposeFunction("typeInto", async (value) => await page.keyboard.type(value));
                page.exposeFunction("getValue", (selector) => page.$eval(selector, (input) => input.getAttribute("value")));
                page.exposeFunction("getAttribute", async (selector, attribute) => {
                    const attributeValue = await page.$eval(selector, (input) => {
                        return input.getAttribute(attribute);
                    });
                    return attributeValue;
                });
                page.exposeFunction("isDisabled", async (selector) => {
                    const attributeValue = await page.$eval(selector, (input) => {
                        return input.disabled;
                    });
                    return attributeValue;
                });
                page.exposeFunction("$", async (selector) => {
                    const x = page.$(selector);
                    const y = await x;
                    return y;
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
                        stderrStream.close();
                        stdoutStream.close();
                    });
                };
                page.on("pageerror", (err) => {
                    console.debug(`Error from ${src}: [${err.name}] `);
                    stderrStream.write(err.name);
                    if (err.cause) {
                        console.debug(`Error from ${src} cause: [${err.cause}] `);
                        stderrStream.write(err.cause);
                    }
                    if (err.stack) {
                        console.debug(`Error from stack ${src}: [${err.stack}] `);
                        stderrStream.write(err.stack);
                    }
                    console.debug(`Error from message ${src}: [${err.message}] `);
                    stderrStream.write(err.message);
                    this.bddTestIsNowDone(src, -1);
                    close();
                });
                page.on("console", (log) => {
                    // console.debug(`Log from ${t}: [${log.text()}] `);
                    // console.debug(`Log from ${t}: [${JSON.stringify(log.location())}] `);
                    // console.debug(
                    //   `Log from ${t}: [${JSON.stringify(log.stackTrace())}] `
                    // );
                    stdoutStream.write(log.text());
                    stdoutStream.write(JSON.stringify(log.location()));
                    stdoutStream.write(JSON.stringify(log.stackTrace()));
                });
                await page.goto(`file://${`${destFolder}.html`}`, {});
                await page
                    .evaluate(evaluation)
                    .then(async ({ failed, features }) => {
                    this.receiveFeatures(features, destFolder, src, "web");
                    // console.log(`${t} completed with ${failed} errors`);
                    statusMessagePretty(failed, src);
                    this.bddTestIsNowDone(src, failed);
                })
                    .catch((e) => {
                    // console.log(red, `${t} errored with`, e);
                    console.log(ansiC.red(ansiC.inverse(`${src} errored with: ${e}`)));
                })
                    .finally(() => {
                    this.bddTestIsNowDone(src, -1);
                    close();
                });
                return page;
            });
        };
        this.receiveFeatures = (features, destFolder, srcTest, platform) => {
            const featureDestination = path.resolve(process.cwd(), "reports", "features", "strings", srcTest.split(".").slice(0, -1).join(".") + ".features.txt");
            features
                .reduce(async (mm, featureStringKey) => {
                const accum = await mm;
                const isUrl = isValidUrl(featureStringKey);
                if (isUrl) {
                    const u = new URL(featureStringKey);
                    if (u.protocol === "file:") {
                        const newPath = `${process.cwd()}/testeranto/features/internal/${path.relative(process.cwd(), u.pathname)}`;
                        await fs.promises.mkdir(path.dirname(newPath), { recursive: true });
                        try {
                            await fs.unlinkSync(newPath);
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
                    await fs.promises.mkdir(path.dirname(featureDestination), {
                        recursive: true,
                    });
                    accum.strings.push(featureStringKey);
                }
                return accum;
            }, Promise.resolve({ files: [], strings: [] }))
                .then(({ files, strings }) => {
                // writeFileAndCreateDir(`${featureDestination}`, JSON.stringify(strings));
                fs.writeFileSync(
                // `${destFolder}/featurePrompt.txt`,
                `testeranto/reports/${this.name}/${srcTest
                    .split(".")
                    .slice(0, -1)
                    .join(".")}/${platform}/featurePrompt.txt`, files
                    .map((f) => {
                    return `/read ${f}`;
                })
                    .join("\n"));
            });
            // this.writeBigBoard();
        };
        this.writeBigBoard = () => {
            fs.writeFileSync(`./testeranto/reports/${this.name}/summary.json`, JSON.stringify(this.bigBoard, null, 2));
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
    async start() {
        if (!fs.existsSync(`testeranto/reports/${this.name}`)) {
            fs.mkdirSync(`testeranto/reports/${this.name}`);
        }
        this.browser = (await puppeteer.launch({
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
        const { nodeEntryPoints, webEntryPoints } = this.getRunnables(this.configs.tests);
        Object.entries(nodeEntryPoints).forEach(([k, outputFile]) => {
            this.launchNode(k, outputFile);
            try {
                watch(outputFile, async (e, filename) => {
                    const hash = await fileHash(outputFile);
                    if (fileHashes[k] !== hash) {
                        fileHashes[k] = hash;
                        console.log(ansiC.green(ansiC.inverse(`< ${e} ${filename}`)));
                        this.launchNode(k, outputFile);
                    }
                });
            }
            catch (e) {
                console.error(e);
            }
        });
        Object.entries(webEntryPoints).forEach(([k, outputFile]) => {
            this.launchWeb(k, outputFile);
            watch(outputFile, async (e, filename) => {
                const hash = await fileHash(outputFile);
                if (fileHashes[k] !== hash) {
                    fileHashes[k] = hash;
                    console.log(ansiC.green(ansiC.inverse(`< ${e} ${filename}`)));
                    this.launchWeb(k, outputFile);
                }
            });
        });
        this.metafileOutputs("node");
        const w = `./testeranto/bundles/node/${this.name}/metafile.json`;
        console.log("w", w);
        this.nodeMetafileWatcher = watch(w, async (e, filename) => {
            console.log(ansiC.green(ansiC.inverse(`< ${e} ${filename} (node)`)));
            this.metafileOutputs("node");
        });
        this.metafileOutputs("web");
        this.webMetafileWatcher = watch(`./testeranto/bundles/web/${this.name}/metafile.json`, async (e, filename) => {
            console.log(ansiC.green(ansiC.inverse(`< ${e} ${filename} (web)`)));
            this.metafileOutputs("web");
        });
    }
    async metafileOutputs(platform) {
        const metafile = JSON.parse(fs
            .readFileSync(`./testeranto/bundles/${platform}/${this.name}/metafile.json`)
            .toString()).metafile;
        if (!metafile)
            return;
        const outputs = metafile.outputs;
        Object.keys(outputs).forEach(async (k) => {
            const addableFiles = Object.keys(outputs[k].inputs).filter((i) => {
                if (!fs.existsSync(i))
                    return false;
                if (i.startsWith("node_modules"))
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
