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
const fPaths = [];
const fileStreams = [];
class PM_Main extends index_js_1.PM {
    // testResourceConfiguration: ITTestResourceConfiguration;
    constructor(configs
    // testResourceConfig: ITTestResourceConfiguration
    ) {
        super();
        this.launchNode = async (src, dest) => {
            console.log("launchNode", src);
            // childProcesses[src] = "running";
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
            console.log("mark22 testConfigResource", testConfigResource);
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
            this.server[builtfile] = await Promise.resolve().then(() => __importStar(require(builtfile))).then((module) => {
                return module.default.then((defaultModule) => {
                    defaultModule
                        .receiveTestResourceConfig(argz)
                        .then((x) => {
                        console.log("then", x);
                        return x;
                    })
                        .catch((e) => {
                        console.log("catch", e);
                    });
                });
            });
            for (let i = 0; i <= portsToUse.length; i++) {
                this.ports[i] = true; //port is open again
            }
        };
        this.launchWeb = (t, dest) => {
            console.log("launchWeb", t, dest);
            const testResourceConfiguration = this.testResourceConfiguration;
            console.log("mkdirsync3", testResourceConfiguration);
            // childProcesses[t] = "running";
            const destFolder = dest.replace(".mjs", "");
            const webArgz = JSON.stringify({
                name: dest,
                ports: [].toString(),
                fs: destFolder,
                browserWSEndpoint: this.browser.wsEndpoint(),
            });
            const evaluation = `import('${dest}.mjs').then(async (x) => {
      try {
        await (await x.default).receiveTestResourceConfig(${webArgz})
      } catch (e) {
        console.log("fail", e)
      }
    })`;
            this.browser
                .newPage()
                .then((page) => {
                page.exposeFunction("custom-screenshot", async (ssOpts) => {
                    console.log("custom-screenshot", ssOpts);
                    await page.screenshot(Object.assign(Object.assign({}, ssOpts), { path: ssOpts.path }));
                });
                page.exposeFunction("writeFileSync", (fp, contents) => {
                    fs_1.default.writeFileSync(fp, contents);
                });
                page.exposeFunction("existsSync", (fp, contents) => {
                    return fs_1.default.existsSync(fp);
                });
                page.exposeFunction("mkdirSync", (fp) => {
                    console.log("mkdirsync", fp);
                    if (!fs_1.default.existsSync(fp)) {
                        return fs_1.default.mkdirSync(fp, {
                            recursive: true,
                        });
                    }
                    return false;
                });
                page.exposeFunction("createWriteStream", (fp) => {
                    const f = fs_1.default.createWriteStream(fp);
                    fileStreams.push(f);
                    return Object.assign(Object.assign({}, JSON.parse(JSON.stringify(f))), { uid: fileStreams.length - 1 });
                });
                page.exposeFunction("write", async (uid, contents) => {
                    return fileStreams[uid].write(contents);
                });
                page.exposeFunction("end", async (uid) => {
                    return fileStreams[uid].end();
                });
                page.exposeFunction("customclose", () => {
                    return page.close();
                });
                return page;
            })
                .then(async (page) => {
                await page.goto(`file://${`${dest}.html`}`);
                page.evaluate(evaluation).finally(() => {
                    console.log("evaluation failed.", dest);
                });
            })
                .then((x) => {
                console.log("mark1", x);
            });
        };
        // this.testResourceConfiguration = testResourceConfig;
        // console.log("mkdirsync4", testResourceConfig);
        this.server = {};
        this.configs = configs;
        this.ports = {};
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
        globalThis["writeFileSync"] = (fp, contents) => {
            return fs_1.default.writeFileSync(fp, contents);
        };
        globalThis["createWriteStream"] = (filepath) => {
            const f = fs_1.default.createWriteStream(filepath);
            fileStreams.push(f);
            return Object.assign(Object.assign({}, JSON.parse(JSON.stringify(f))), { uid: fileStreams.length - 1 });
        };
        globalThis["write"] = (uid, contents) => {
            console.log("write", uid, contents);
            // process.exit();
            fileStreams[uid].write(contents);
        };
        globalThis["end"] = (uid) => {
            fileStreams[uid].end();
        };
    }
    async startPuppeteer(options, destfolder) {
        this.browser = await puppeteer_core_1.default.launch(options);
        return this.browser;
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
