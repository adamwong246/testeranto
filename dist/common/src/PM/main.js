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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_Main = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const index_js_1 = require("./index.js");
const utils_js_1 = require("../utils.js");
const fPaths = [];
const fileStreams3 = [];
const files = {}; // = new Set<string>();
const screenshots = {};
const port = 4000;
class PM_Main extends index_js_1.PM {
    constructor(configs) {
        super();
        this.shutdownMode = false;
        // async startPuppeteer(options: any, destfolder: string): Promise<any> {
        //   return new Promise(async (res, rej) => {
        //     this.browser = (await puppeteer.launch(options)) as any;
        //     res(this.browser);
        //     // http
        //     //   .createServer()
        //     //   .on("upgrade", async (req, socket, head) => {
        //     //     console.log("upgrade");
        //     //     // console.log("this.browser", this.browser);
        //     //     const target = this.browser.wsEndpoint();
        //     //     proxy.ws(req, socket, head, { target });
        //     //   })
        //     //   .on("request", (request, res) => {
        //     //     console.log("request");
        //     //     // console.log(err);
        //     //   })
        //     //   .on("error", function (err, req, res) {
        //     //     console.log(err);
        //     //     rej(err);
        //     //   })
        //     //   .listen(port, async () => {
        //     //     console.log(`proxy server running at ${port}`);
        //     //     this.browser = (await puppeteer.launch(options)) as any;
        //     //     res(this.browser);
        //     //   });
        //   });
        // }
        this.checkForShutdown = () => {
            const anyRunning = Object.values(this.registry).filter((x) => x === false).length > 0;
            if (anyRunning) {
            }
            else {
                this.browser.disconnect().then(() => {
                    console.log("Goodbye");
                    process.exit();
                });
            }
        };
        this.register = (src) => {
            this.registry[src] = false;
        };
        this.deregister = (src) => {
            this.registry[src] = true;
            if (this.shutdownMode) {
                this.checkForShutdown();
            }
        };
        this.launchNode = async (src, dest) => {
            console.log("launchNode", src);
            this.register(src);
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
            const builtfile = dest + ".mjs";
            await Promise.all(testConfig[3].map((sidecar) => {
                if (sidecar[1] === "web") {
                    return this.launchWebSideCar(sidecar[0], (0, utils_js_1.destinationOfRuntime)(sidecar[0], "web", this.configs), sidecar);
                }
                if (sidecar[1] === "node") {
                    return this.launchNodeSideCar(sidecar[0], (0, utils_js_1.destinationOfRuntime)(sidecar[0], "node", this.configs), sidecar);
                }
            }));
            this.server[builtfile] = await Promise.resolve().then(() => __importStar(require(`${builtfile}?cacheBust=${Date.now()}`))).then((module) => {
                return module.default.then((defaultModule) => {
                    defaultModule
                        .receiveTestResourceConfig(argz)
                        .then(async (features) => {
                        Object.keys(features)
                            .reduce(async (mm, lm) => {
                            const accum = await mm;
                            const x = await this.configs.featureIngestor(features[lm]);
                            accum[lm] = x;
                            return accum;
                        }, Promise.resolve({}))
                            .then((x) => {
                            fs_1.default.writeFileSync(`${destFolder}/features.json`, JSON.stringify(x, null, 2));
                        });
                    })
                        .catch((e) => {
                        console.log("catch", e);
                    })
                        .finally(() => {
                        this.deregister(src);
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
            console.log("launchWebSideCar", src, dest, d);
            const destFolder = dest.replace(".mjs", "");
            const webArgz = JSON.stringify({
                name: dest,
                ports: [].toString(),
                fs: destFolder,
                browserWSEndpoint: this.browser.wsEndpoint(),
            });
            // const evaluation = `
            // console.log("importing ${dest}.mjs");
            // import('${dest}.mjs').then(async (x) => {
            //   console.log("imported", x.default);
            // })`;
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
                    page.exposeFunction("customclose", (p, testName) => {
                        fs_1.default.writeFileSync(p + "/manifest.json", JSON.stringify(Array.from(files[testName])));
                        delete files[testName];
                        Promise.all(screenshots[testName] || []).then(() => {
                            delete screenshots[testName];
                            // page.close();
                        });
                    });
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
            console.log("launchNodeSideCar", src, dest, d);
            const destFolder = dest.replace(".mjs", "");
            let argz = "";
            // const testConfig = this.configs.tests.find((t) => {
            //   return t[0] === src;
            // });
            // if (!testConfig) {
            //   console.error("missing test config");
            //   process.exit(-1);
            // }
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
            this.server[builtfile] = await Promise.resolve().then(() => __importStar(require(`${builtfile}?cacheBust=${Date.now()}`))).then((module) => {
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
        this.launchWeb = (t, dest, sidecars) => {
            console.log("launchWeb", t, dest);
            this.register(t);
            sidecars.map((sidecar) => {
                if (sidecar[1] === "node") {
                    return this.launchNodeSideCar(sidecar[0], (0, utils_js_1.destinationOfRuntime)(sidecar[0], "node", this.configs), sidecar);
                }
            });
            const destFolder = dest.replace(".mjs", "");
            const webArgz = JSON.stringify({
                name: dest,
                ports: [].toString(),
                fs: destFolder,
                browserWSEndpoint: this.browser.wsEndpoint(),
            });
            const evaluation = `
    console.log("importing ${dest}.mjs");
    import('${dest}.mjs').then(async (x) => {
      console.log("imported", (await x.default));
      try {
        return await (await x.default).receiveTestResourceConfig(${webArgz})
      } catch (e) {
        console.log("fail", e)
      }
    })`;
            const fileStreams2 = [];
            const doneFileStream2 = [];
            this.browser
                .newPage()
                .then((page) => {
                // page.on("console", (msg) => {
                //   // console.log("web > ", msg.args(), msg.text());
                // });
                page.exposeFunction("customScreenShot", async (ssOpts, testName) => {
                    // console.log("main.ts browser custom-screenshot", testName);
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
                page.exposeFunction("customclose", (p, testName) => {
                    // console.log("closing", p);
                    fs_1.default.writeFileSync(p + "/manifest.json", JSON.stringify(Array.from(files[testName])));
                    delete files[testName];
                    // console.log("screenshots[testName]", screenshots[testName]);
                    Promise.all(screenshots[testName] || []).then(() => {
                        delete screenshots[testName];
                        // page.close();
                        // console.log("\t GOODBYE");
                        // whyIsNodeRunning();
                    });
                    // globalThis["writeFileSync"](
                    //   p + "/manifest.json",
                    //   // files.entries()
                    //   JSON.stringify(Array.from(files[testName]))
                    // );
                    // console.log("closing doneFileStream2", doneFileStream2);
                    // console.log("closing doneFileStream2", doneFileStream2);
                    // Promise.all([...doneFileStream2, ...screenshots2]).then(() => {
                    //   page.close();
                    // });
                    // Promise.all(screenshots).then(() => {
                    //   page.close();
                    // });
                    // setTimeout(() => {
                    //   console.log("Delayed for 1 second.");
                    //   page.close();
                    // }, 5000);
                    // return page.close();
                });
                return page;
            })
                .then(async (page) => {
                // page.on("console", (log) =>
                //   console.debug(`Log from client: [${log.text()}] `)
                // );
                await page.goto(`file://${`${dest}.html`}`, {});
                // await page.waitForNavigation();
                // await page.exposeFunction("PUPPETEER", () => this.browser);
                // console.log("window.PUPPETEER", this.browser);
                // await page.evaluate(() => {
                //   console.log("window.PUPPETEER", this.browser);
                //   window.PUPPETEER = this.browser;
                // });
                await page
                    .evaluate(evaluation)
                    .then(async (features) => {
                    Object.keys(features || {})
                        .reduce(async (mm, lm) => {
                        const accum = await mm;
                        const x = await this.configs.featureIngestor(features[lm]);
                        accum[lm] = x;
                        return accum;
                    }, Promise.resolve({}))
                        .then((x) => {
                        fs_1.default.writeFileSync(`${destFolder}/features.json`, JSON.stringify(x, null, 2));
                    });
                })
                    .catch((e) => {
                    console.log("evaluation failed.", dest);
                    console.log(e);
                })
                    .finally(() => {
                    console.log("evaluation complete.", dest);
                    // page.close();
                    this.deregister(t);
                    // whyIsNodeRunning();
                });
                return page;
            });
        };
        this.server = {};
        this.configs = configs;
        this.ports = {};
        this.registry = {};
        this.configs.ports.forEach((element) => {
            this.ports[element] = "true"; // set ports as open
        });
        globalThis["mkdirSync"] = (fp) => {
            if (!fs_1.default.existsSync(fp)) {
                return fs_1.default.mkdirSync(fp, {
                    recursive: true,
                });
            }
            return false;
        };
        globalThis["writeFileSync"] = (filepath, contents, testName) => {
            // console.log("globalThis-writeFileSync", filepath);
            // Create directories if they don't exist
            const dir = path_1.default.dirname(filepath.split("/").slice(0, -1).join("/"));
            fs_1.default.mkdirSync(dir, {
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
        globalThis["customScreenShot"] = async (opts, page) => {
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
        globalThis["customclose"] = (p, testName) => {
            if (!files[testName]) {
                files[testName] = new Set();
            }
            fs_1.default.writeFileSync(p + "/manifest.json", JSON.stringify(Array.from(files[testName])));
            delete files[testName];
        };
    }
    shutDown() {
        console.log("shutting down...");
        this.shutdownMode = true;
        this.checkForShutdown();
    }
    customScreenShot(opts) {
        throw new Error("Method not implemented.");
    }
    async startPuppeteer(options, destfolder) {
        this.browser = (await puppeteer_core_1.default.launch(options));
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
}
exports.PM_Main = PM_Main;
