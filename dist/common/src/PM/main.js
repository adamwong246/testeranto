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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const crypto_1 = __importDefault(require("crypto"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const index_js_1 = require("./index.js");
const utils_1 = require("../utils");
const fileStreams3 = [];
const fPaths = [];
const files = {};
const recorders = {};
const screenshots = {};
const red = "\x1b[31m";
const green = "\x1b[32m";
const reverse = "e[7m";
const reset = "\x1b[0m"; // Resets to default color
const statusMessagePretty = (failures, test) => {
    if (failures === 0) {
        // console.log(green + `> ${test} completed successfully` + reset);
        console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`> ${test} completed successfully`)));
    }
    else {
        // console.log(red + `> ${test} failed ${failures} times` + reset);
        console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`> ${test} failed ${failures} times`)));
    }
};
class PM_Main extends index_js_1.PM {
    constructor(configs) {
        super();
        this.shutdownMode = false;
        this.bigBoard = {};
        this.checkForShutdown = () => {
            const anyRunning = Object.values(this.bigBoard).filter((x) => x.status === "running")
                .length > 0;
            if (anyRunning) {
            }
            else {
                this.browser.disconnect().then(() => {
                    const final = this.configs.tests.reduce((mm, t) => {
                        const bddErrors = fs_1.default
                            .readFileSync((0, utils_1.bddExitCodePather)(t[0], t[1]))
                            .toString();
                        const lintErrors = fs_1.default
                            .readFileSync((0, utils_1.lintExitCodePather)(t[0], t[1]))
                            .toString();
                        const typeErrors = fs_1.default
                            .readFileSync((0, utils_1.tscExitCodePather)(t[0], t[1]))
                            .toString();
                        mm[t[0]] = {
                            bddErrors,
                            lintErrors,
                            typeErrors,
                        };
                        return mm;
                    }, {});
                    const s = JSON.stringify(final, null, 2);
                    fs_1.default.writeFileSync("docs/summary.json", s);
                    console.log(ansi_colors_1.default.inverse("Goodbye"));
                    process.exit();
                });
            }
        };
        this.testIsNowRunning = (src) => {
            this.bigBoard[src].status = "running";
        };
        this.testIsNowDone = (src) => {
            this.bigBoard[src].status = "waiting";
            if (this.shutdownMode) {
                this.checkForShutdown();
            }
        };
        this.launchNode = async (src, dest) => {
            console.log(ansi_colors_1.default.yellow(`! node, ${src}`));
            this.testIsNowRunning(src);
            const destFolder = dest.replace(".mjs", "");
            let argz = "";
            const testConfig = this.configs.tests.find((t) => {
                return t[0] === src;
            });
            if (!testConfig) {
                console.error("missing test config");
                process.exit(-1);
            }
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
            this.server[builtfile] = await Promise.resolve(`${`${builtfile}?cacheBust=${Date.now()}`}`).then(s => __importStar(require(s))).then((module) => {
                return module.default.then((defaultModule) => {
                    defaultModule
                        .receiveTestResourceConfig(argz)
                        .then(async ({ features, failed }) => {
                        this.receiveFeatures(features, destFolder, src);
                        // console.log(`${src} completed with ${failed} errors`);
                        statusMessagePretty(failed, src);
                        this.receiveExitCode(src, failed);
                    })
                        .catch((e) => {
                        console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`${src} errored with: ${e}`)));
                        // console.log(reset, `${src} errored with`, e);
                    })
                        .finally(() => {
                        webSideCares.forEach((webSideCar) => webSideCar.close());
                        this.testIsNowDone(src);
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
            // console.log(green, "launchWebSideCar", src, dest, d);
            console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`launchWebSideCar ${src}`)));
            const destFolder = dest.replace(".mjs", "");
            // const webArgz = JSON.stringify({
            //   name: dest,
            //   ports: [].toString(),
            //   fs: destFolder,
            //   browserWSEndpoint: this.browser.wsEndpoint(),
            // });
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
                        // console.log("main.ts browser custom-screenshot", testName);
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
                        // sPromise.then(())
                        await sPromise;
                        return sPromise;
                        // page.evaluate(`window["screenshot done"]`);
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
                        // if (!files[testName]) {
                        //   files[testName] = new Set();
                        // }
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
                    // page.exposeFunction("customclose", (p: string, testName: string) => {
                    //   fs.writeFileSync(
                    //     p + "/manifest.json",
                    //     JSON.stringify(Array.from(files[testName]))
                    //   );
                    //   delete files[testName];
                    //   Promise.all(screenshots[testName] || []).then(() => {
                    //     delete screenshots[testName];
                    //     // page.close();
                    //   });
                    // });
                    return page;
                })
                    .then(async (page) => {
                    await page.goto(`file://${`${dest}.html`}`, {});
                    res(page);
                });
            });
        };
        this.launchNodeSideCar = async (src, dest, testConfig) => {
            const d = dest + ".mjs";
            // console.log(green, "launchNodeSideCar", src, dest, d);
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
            // console.log(
            //   "node builtfile",
            //   (await import(`${builtfile}?cacheBust=${Date.now()}`)).default
            // );
            this.server[builtfile] = await Promise.resolve(`${`${builtfile}?cacheBust=${Date.now()}`}`).then(s => __importStar(require(s))).then((module) => {
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
            // console.log("portsToUse", portsToUse);
            for (let i = 0; i <= portsToUse.length; i++) {
                if (portsToUse[i]) {
                    this.ports[portsToUse[i]] = "true"; //port is open again
                }
            }
        };
        this.launchWeb = (t, dest) => {
            // console.log(green, "! web", t);
            console.log(ansi_colors_1.default.green(ansi_colors_1.default.inverse(`! web ${t}`)));
            this.testIsNowRunning(t);
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
                fs: destFolder,
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
            const stdoutStream = fs_1.default.createWriteStream(`${destFolder}/stdout.log`);
            const stderrStream = fs_1.default.createWriteStream(`${destFolder}/stderr.log`);
            this.browser
                .newPage()
                .then((page) => {
                // page.on("console", (msg) => {
                //   // console.log("web > ", msg.args(), msg.text());
                // });
                page.exposeFunction("screencast", async (ssOpts, testName) => {
                    const p = ssOpts.path;
                    const dir = path_1.default.dirname(p);
                    fs_1.default.mkdirSync(dir, {
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
                    const dir = path_1.default.dirname(p);
                    fs_1.default.mkdirSync(dir, {
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
                // page.exposeFunction("customclose", (p: string, testName: string) => {
                //   // console.log("closing", p);
                //   console.log("\t GOODBYE customclose");
                //   fs.writeFileSync(
                //     p + "/manifest.json",
                //     JSON.stringify(Array.from(files[testName]))
                //   );
                //   delete files[testName];
                //   // console.log("screenshots[testName]", screenshots[testName]);
                //   Promise.all(screenshots[testName] || []).then(() => {
                //     delete screenshots[testName];
                //   });
                //   // globalThis["writeFileSync"](
                //   //   p + "/manifest.json",
                //   //   // files.entries()
                //   //   JSON.stringify(Array.from(files[testName]))
                //   // );
                //   // console.log("closing doneFileStream2", doneFileStream2);
                //   // console.log("closing doneFileStream2", doneFileStream2);
                //   // Promise.all([...doneFileStream2, ...screenshots2]).then(() => {
                //   //   page.close();
                //   // });
                //   // Promise.all(screenshots).then(() => {
                //   //   page.close();
                //   // });
                //   // setTimeout(() => {
                //   //   console.log("Delayed for 1 second.");
                //   //   page.close();
                //   // }, 5000);
                //   // return page.close();
                // });
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
                    if (!files[t]) {
                        files[t] = new Set();
                    }
                    // files[t].add(filepath);
                    fs_1.default.writeFileSync(destFolder + "/manifest.json", JSON.stringify(Array.from(files[t])));
                    delete files[t];
                    Promise.all(screenshots[t] || []).then(() => {
                        delete screenshots[t];
                        page.close();
                        this.testIsNowDone(t);
                        stderrStream.close();
                        stdoutStream.close();
                    });
                };
                page.on("pageerror", (err) => {
                    console.debug(`Error from ${t}: [${err.name}] `);
                    stderrStream.write(err.name);
                    if (err.cause) {
                        console.debug(`Error from ${t} cause: [${err.cause}] `);
                        stderrStream.write(err.cause);
                    }
                    if (err.stack) {
                        console.debug(`Error from stack ${t}: [${err.stack}] `);
                        stderrStream.write(err.stack);
                    }
                    console.debug(`Error from message ${t}: [${err.message}] `);
                    stderrStream.write(err.message);
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
                    this.receiveFeatures(features, destFolder, t);
                    // console.log(`${t} completed with ${failed} errors`);
                    statusMessagePretty(failed, t);
                    this.receiveExitCode(t, failed);
                })
                    .catch((e) => {
                    // console.log(red, `${t} errored with`, e);
                    console.log(ansi_colors_1.default.red(ansi_colors_1.default.inverse(`${t} errored with: ${e}`)));
                })
                    .finally(() => {
                    // this.testIsNowDone(t);
                    close();
                });
                return page;
            });
        };
        this.receiveFeatures = (features, destFolder, srcTest) => {
            const featureDestination = path_1.default.resolve(process.cwd(), "docs", "features", "strings", srcTest.split(".").slice(0, -1).join(".") + ".features.txt");
            features
                .reduce(async (mm, featureStringKey) => {
                const accum = await mm;
                const isUrl = isValidUrl(featureStringKey);
                if (isUrl) {
                    const u = new URL(featureStringKey);
                    if (u.protocol === "file:") {
                        const newPath = `${process.cwd()}/docs/features/internal/${path_1.default.relative(process.cwd(), u.pathname)}`;
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
                        fs_1.default.symlink(u.pathname, newPath, (err) => {
                            if (err) {
                                // console.error("Error creating symlink:", err);
                            }
                            else {
                                // console.log("Symlink created successfully");
                            }
                        });
                        accum.files.push(newPath);
                    }
                    else if (u.protocol === "http:" || u.protocol === "https:") {
                        const newPath = `${process.cwd()}/docs/features/external${u.hostname}${u.pathname}`;
                        const body = await this.configs.featureIngestor(featureStringKey);
                        writeFileAndCreateDir(newPath, body);
                        accum.files.push(newPath);
                    }
                }
                else {
                    await fs_1.default.promises.mkdir(path_1.default.dirname(featureDestination), {
                        recursive: true,
                    });
                    // const newPath = `${process.cwd()}/docs/features/plain/${await sha256(
                    //   featureStringKey
                    // )}`;
                    // writeFileAndCreateDir(
                    //   `${featureDestination}/${await sha256(featureStringKey)}`,
                    //   featureStringKey
                    // );
                    accum.strings.push(featureStringKey);
                }
                return accum;
            }, Promise.resolve({ files: [], strings: [] }))
                .then(({ files, strings }) => {
                // writeFileAndCreateDir(`${featureDestination}`, JSON.stringify(strings));
                fs_1.default.writeFileSync(`${destFolder}/featurePrompt.txt`, files
                    .map((f) => {
                    return `/read ${f}`;
                })
                    .join("\n"));
            });
            this.writeBigBoard();
        };
        this.receiveExitCode = (srcTest, failures) => {
            this.bigBoard[srcTest].runTimeError = failures;
            this.writeBigBoard();
        };
        this.writeBigBoard = () => {
            fs_1.default.writeFileSync("./docs/bigBoard.json", JSON.stringify(this.bigBoard, null, 2));
            //     fs.writeFileSync(
            //       "./docs/bigBoard.html",
            //       // JSON.stringify(this.bigBoard, null, 2)
            //       `
            // <!DOCTYPE html>
            // <html lang="en">
            // <head>
            //   <meta name="description" content="Webpage description goes here" />
            //   <meta charset="utf-8" />
            //   <title>kokomoBay - testeranto</title>
            //   <meta name="viewport" content="width=device-width, initial-scale=1" />
            //   <meta name="author" content="" />
            //   <link rel="stylesheet" href="/index.css" />
            //   <script type="module" src="/littleBoard.js"></script>
            // </head>
            // <body>
            //   <table>
            //     ${Object.keys(this.bigBoard)
            //       .map((v) => {
            //         return `<tr>
            //         <td>${v}</td>
            //         <td>${this.bigBoard[v].status}</td>
            //         <td>${this.bigBoard[v].runTimeError}</td>
            //         <td>
            //           <a href="/${this.configs.tests.find((t) => t[0] === v)[1]}/${v
            //           .split(".")
            //           .slice(0, -1)
            //           .join(".")}/littleBoard.html">more</a>
            //         </td>
            //       </tr>`;
            //       })
            //       .join("")}
            //   </table>
            // </body>
            // </html>
            //     `
            //     );
        };
        this.server = {};
        this.configs = configs;
        this.ports = {};
        this.configs.tests.forEach(([t]) => {
            this.bigBoard[t] = {
                status: "?",
            };
        });
        this.configs.ports.forEach((element) => {
            this.ports[element] = "true"; // set ports as open
        });
        globalThis["waitForSelector"] = async (pageKey, sel) => {
            const page = (await this.browser.pages()).find((p) => p.mainFrame()._id === pageKey);
            await (page === null || page === void 0 ? void 0 : page.waitForSelector(sel));
        };
        globalThis["screencastStop"] = async (path) => {
            return recorders[path].stop();
        };
        globalThis["closePage"] = async (pageKey) => {
            const page = (await this.browser.pages()).find((p) => p.mainFrame()._id === pageKey);
            return page.close();
        };
        globalThis["goto"] = async (pageKey, url) => {
            const page = (await this.browser.pages()).find((p) => p.mainFrame()._id === pageKey);
            await (page === null || page === void 0 ? void 0 : page.goto(url));
            return;
        };
        globalThis["newPage"] = () => {
            return this.browser.newPage();
        };
        globalThis["pages"] = () => {
            return this.browser.pages();
        };
        globalThis["mkdirSync"] = (fp) => {
            if (!fs_1.default.existsSync(fp)) {
                return fs_1.default.mkdirSync(fp, {
                    recursive: true,
                });
            }
            return false;
        };
        globalThis["writeFileSync"] = (filepath, contents, testName) => {
            fs_1.default.mkdirSync(path_1.default.dirname(filepath), {
                recursive: true,
            });
            if (!files[testName]) {
                files[testName] = new Set();
            }
            files[testName].add(filepath);
            return fs_1.default.writeFileSync(filepath, contents);
        };
        globalThis["createWriteStream"] = (filepath, testName) => {
            const f = fs_1.default.createWriteStream(filepath);
            fileStreams3.push(f);
            // files.add(filepath);
            if (!files[testName]) {
                files[testName] = new Set();
            }
            files[testName].add(filepath);
            return Object.assign(Object.assign({}, JSON.parse(JSON.stringify(f))), { uid: fileStreams3.length - 1 });
        };
        globalThis["write"] = (uid, contents) => {
            fileStreams3[uid].write(contents);
        };
        globalThis["end"] = (uid) => {
            fileStreams3[uid].end();
        };
        // async (ssOpts: ScreenshotOptions, testName: string) => {
        //   const p = ssOpts.path as string;
        //   const dir = path.dirname(p);
        //   fs.mkdirSync(dir, {
        //     recursive: true,
        //   });
        //   if (!files[testName]) {
        //     files[testName] = new Set();
        //   }
        //   files[testName].add(ssOpts.path as string);
        //   const sPromise = page.screenshot({
        //     ...ssOpts,
        //     path: p,
        //   });
        //   if (!screenshots[testName]) {
        //     screenshots[testName] = [];
        //   }
        //   screenshots[testName].push(sPromise);
        //   // sPromise.then(())
        //   await sPromise;
        //   return sPromise;
        //   // page.evaluate(`window["screenshot done"]`);
        // };
        globalThis["customScreenShot"] = async (opts, pageKey, testName) => {
            const page = (await this.browser.pages()).find((p) => p.mainFrame()._id === pageKey);
            const p = opts.path;
            const dir = path_1.default.dirname(p);
            fs_1.default.mkdirSync(dir, {
                recursive: true,
            });
            if (!files[opts.path]) {
                files[opts.path] = new Set();
            }
            files[opts.path].add(opts.path);
            const sPromise = page.screenshot(Object.assign(Object.assign({}, opts), { path: p }));
            if (!screenshots[opts.path]) {
                screenshots[opts.path] = [];
            }
            screenshots[opts.path].push(sPromise);
            await sPromise;
            return sPromise;
        };
        globalThis["screencast"] = async (opts, pageKey) => {
            const page = (await this.browser.pages()).find((p) => p.mainFrame()._id === pageKey);
            const p = opts.path;
            const dir = path_1.default.dirname(p);
            fs_1.default.mkdirSync(dir, {
                recursive: true,
            });
            const recorder = await (page === null || page === void 0 ? void 0 : page.screencast(Object.assign(Object.assign({}, opts), { path: p })));
            recorders[opts.path] = recorder;
            return opts.path;
        };
        // globalThis["customclose"] = (p: string, testName: string) => {
        //   if (!files[testName]) {
        //     files[testName] = new Set();
        //   }
        //   fs.writeFileSync(
        //     p + "/manifest.json",
        //     JSON.stringify(Array.from(files[testName]))
        //   );
        //   delete files[testName];
        // };
    }
    customclose() {
        throw new Error("Method not implemented.");
    }
    waitForSelector(p, s) {
        throw new Error("Method not implemented.");
    }
    closePage(p) {
        throw new Error("Method not implemented.");
    }
    newPage() {
        throw new Error("Method not implemented.");
    }
    goto(p, url) {
        throw new Error("Method not implemented.");
    }
    $(selector) {
        throw new Error("Method not implemented.");
    }
    screencast(opts) {
        throw new Error("Method not implemented.");
    }
    customScreenShot(opts, cdpPage) {
        throw new Error("Method not implemented.");
    }
    end(accessObject) {
        throw new Error("Method not implemented.");
    }
    existsSync(destFolder) {
        return fs_1.default.existsSync(destFolder);
    }
    async mkdirSync(fp) {
        if (!fs_1.default.existsSync(fp)) {
            return fs_1.default.mkdirSync(fp, {
                recursive: true,
            });
        }
        return false;
    }
    writeFileSync(fp, contents) {
        fs_1.default.writeFileSync(fp, contents);
    }
    createWriteStream(filepath) {
        return fs_1.default.createWriteStream(filepath);
    }
    testArtiFactoryfileWriter(tLog, callback) {
        return (fPath, value) => {
            callback(new Promise((res, rej) => {
                tLog("testArtiFactory =>", fPath);
                const cleanPath = path_1.default.resolve(fPath);
                fPaths.push(cleanPath.replace(process.cwd(), ``));
                const targetDir = cleanPath.split("/").slice(0, -1).join("/");
                fs_1.default.mkdir(targetDir, { recursive: true }, async (error) => {
                    if (error) {
                        console.error(`❗️testArtiFactory failed`, targetDir, error);
                    }
                    fs_1.default.writeFileSync(path_1.default.resolve(targetDir.split("/").slice(0, -1).join("/"), "manifest"), fPaths.join(`\n`), {
                        encoding: "utf-8",
                    });
                    if (Buffer.isBuffer(value)) {
                        fs_1.default.writeFileSync(fPath, value, "binary");
                        res();
                    }
                    else if (`string` === typeof value) {
                        fs_1.default.writeFileSync(fPath, value.toString(), {
                            encoding: "utf-8",
                        });
                        res();
                    }
                    else {
                        /* @ts-ignore:next-line */
                        const pipeStream = value;
                        const myFile = fs_1.default.createWriteStream(fPath);
                        pipeStream.pipe(myFile);
                        pipeStream.on("close", () => {
                            myFile.close();
                            res();
                        });
                    }
                });
            }));
        };
    }
    write(accessObject, contents) {
        throw new Error("Method not implemented.");
    }
    page() {
        throw new Error("Method not implemented.");
    }
    click(selector) {
        throw new Error("Method not implemented.");
    }
    focusOn(selector) {
        throw new Error("Method not implemented.");
    }
    typeInto(value) {
        throw new Error("Method not implemented.");
    }
    getValue(value) {
        throw new Error("Method not implemented.");
    }
    getAttribute(selector, attribute) {
        throw new Error("Method not implemented.");
    }
    isDisabled(selector) {
        throw new Error("Method not implemented.");
    }
    screencastStop(s) {
        throw new Error("Method not implemented.");
    }
    ////////////////////////////////////////////////////////////////////////////////
    async startPuppeteer(options, destfolder) {
        this.browser = (await puppeteer_core_1.default.launch(options));
    }
    // goodbye = () => {
    //   this.browser.disconnect().then(() => {
    //     console.log("Goodbye");
    //     process.exit();
    //   });
    // };
    shutDown() {
        this.shutdownMode = true;
        this.checkForShutdown();
    }
}
exports.PM_Main = PM_Main;
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
async function sha256(rawData) {
    const data = typeof rawData === "object" ? JSON.stringify(rawData) : String(rawData);
    const msgBuffer = new TextEncoder().encode(data);
    const hashBuffer = await crypto_1.default.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    }
    catch (err) {
        return false;
    }
}
