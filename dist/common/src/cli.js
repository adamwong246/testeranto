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
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
const glob_1 = require("glob");
const debounce_watch_1 = require("@bscotch/debounce-watch");
const esbuild_1 = __importDefault(require("esbuild"));
const node_js_1 = __importDefault(require("./esbuildConfigs/node.js"));
const web_js_1 = __importDefault(require("./esbuildConfigs/web.js"));
const web_html_js_1 = __importDefault(require("./web.html.js"));
const main_js_1 = require("./PM/main.js");
readline_1.default.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
function parseTsErrors(logContent) {
    fs_1.default.writeFileSync("docs/types/log.txt", logContent.join("\n"));
    try {
        const regex = /(^src(.*?))\(\d*,\d*\): error/gm;
        const brokenFilesToLines = {};
        for (let i = 0; i < logContent.length - 1; i++) {
            let m;
            while ((m = regex.exec(logContent[i])) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                if (!brokenFilesToLines[m[1]]) {
                    brokenFilesToLines[m[1]] = new Set();
                }
                brokenFilesToLines[m[1]].add(i);
            }
        }
        const final = Object.keys(brokenFilesToLines).reduce((mm, lm, ndx) => {
            mm[lm] = Array.from(brokenFilesToLines[lm]).map((l, ndx3) => {
                const a = Array.from(brokenFilesToLines[lm]);
                return Object.keys(a).reduce((mm2, lm2, ndx2) => {
                    const acc = [];
                    let j = a[lm2] + 1;
                    let working = true;
                    while (j < logContent.length - 1 && working) {
                        if (!logContent[j].match(regex) &&
                            working &&
                            !logContent[j].match(/^..\/(.*?)\(\d*,\d*\)/)) {
                            acc.push(logContent[j]);
                        }
                        else {
                            working = false;
                        }
                        j++;
                    }
                    mm2[lm] = [logContent[l], ...acc];
                    return mm2;
                }, {})[lm];
            });
            return mm;
        }, {});
        Object.keys(final).forEach((k) => {
            fs_1.default.mkdirSync(`./docs/types/${k.split("/").slice(0, -1).join("/")}`, {
                recursive: true,
            });
            fs_1.default.writeFileSync(`./docs/types/${k}.type_errors.txt`, final[k].flat().flat().join("\r\n"));
        });
    }
    catch (error) {
        console.error("Error reading or parsing the log file:", error);
        process.exit(1);
    }
}
function parseLintErrors(logContent) {
    fs_1.default.writeFileSync("docs/eslint/log.txt", logContent.join("\n"));
    try {
        const regex = new RegExp(`^${process.cwd()}/(.*?)`, "gm");
        const brokenFilesToLines = {};
        for (let i = 0; i < logContent.length - 1; i++) {
            let m;
            while ((m = regex.exec(logContent[i])) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                if (!brokenFilesToLines[m[1]]) {
                    brokenFilesToLines[m[1]] = new Set();
                }
                brokenFilesToLines[m[1]].add(i);
            }
        }
        const final = Object.keys(brokenFilesToLines).reduce((mm, lm, ndx) => {
            mm[lm] = Array.from(brokenFilesToLines[lm]).map((l, ndx3) => {
                const a = Array.from(brokenFilesToLines[lm]);
                return Object.keys(a).reduce((mm2, lm2, ndx2) => {
                    const acc = [];
                    let j = a[lm2] + 1;
                    let working = true;
                    while (j < logContent.length - 1 && working) {
                        if (!logContent[j].match(regex) &&
                            working
                        // &&
                        // !logContent[j].match(/^..\/(.*?)\(\d*,\d*\)/)
                        ) {
                            acc.push(logContent[j]);
                        }
                        else {
                            working = false;
                        }
                        j++;
                    }
                    mm2[lm] = [logContent[l], ...acc];
                    return mm2;
                }, {})[lm];
            });
            return mm;
        }, {});
        Object.keys(final).forEach((k) => {
            fs_1.default.mkdirSync(`./docs/eslint/${k.split("/").slice(0, -1).join("/")}`, {
                recursive: true,
            });
            fs_1.default.writeFileSync(`./docs/eslint/${k}.lint_errors.txt`, final[k].flat().flat().join("\r\n"));
        });
    }
    catch (error) {
        console.error("Error reading or parsing the log file:", error);
        process.exit(1);
    }
}
const typecheck = () => {
    const logContent = [];
    fs_1.default.rmSync("docs/types", { force: true, recursive: true });
    fs_1.default.mkdirSync("docs/types");
    const tsc = (0, child_process_1.spawn)("tsc", ["-noEmit"]);
    tsc.stdout.on("data", (data) => {
        const lines = data.toString().split("\n");
        logContent.push(...lines);
    });
    tsc.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
        process.exit(-1);
    });
    tsc.on("close", (code) => {
        parseTsErrors(logContent);
    });
};
const eslint = () => {
    const logContent = [];
    fs_1.default.rmSync("docs/eslint", { force: true, recursive: true });
    fs_1.default.mkdirSync("docs/eslint");
    const tsc = (0, child_process_1.spawn)("eslint", ["./src"]);
    tsc.stdout.on("data", (data) => {
        const lines = data.toString().split("\n");
        logContent.push(...lines);
    });
    tsc.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
        process.exit(-1);
    });
    tsc.on("close", (code) => {
        parseLintErrors(logContent);
    });
};
const getRunnables = (tests, payload = {
    nodeEntryPoints: {},
    webEntryPoints: {},
}) => {
    return tests.reduce((pt, cv, cndx, cry) => {
        if (cv[1] === "node") {
            pt.nodeEntryPoints[cv[0]] = path_1.default.resolve(`./docs/node/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`);
        }
        else if (cv[1] === "web") {
            pt.webEntryPoints[cv[0]] = path_1.default.resolve(`./docs/web/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`);
        }
        if (cv[3].length) {
            getRunnables(cv[3], payload);
        }
        return pt;
    }, payload);
};
Promise.resolve().then(() => __importStar(require(process.cwd() + "/" + process.argv[2]))).then(async (module) => {
    const rawConfig = module.default;
    const getSecondaryEndpointsPoints = (runtime) => {
        const meta = (ts, st) => {
            ts.forEach((t) => {
                if (t[1] === runtime) {
                    st.add(t[0]);
                }
                if (Array.isArray(t[3])) {
                    meta(t[3], st);
                }
            });
            return st;
        };
        return Array.from(meta(config.tests, new Set()));
    };
    const config = Object.assign(Object.assign({}, rawConfig), { buildDir: process.cwd() + "/" + rawConfig.outdir });
    let nodeDone = false;
    let webDone = false;
    let mode = config.devMode ? "DEV" : "PROD";
    let status = "build";
    let pm = new main_js_1.PM_Main(config);
    const fileHashes = {};
    const { nodeEntryPoints, webEntryPoints } = getRunnables(config.tests);
    const onNodeDone = () => {
        nodeDone = true;
        onDone();
    };
    const onWebDone = () => {
        webDone = true;
        onDone();
    };
    // async function fileHash(filePath, algorithm = "md5") {
    //   return new Promise((resolve, reject) => {
    //     const hash = crypto.createHash(algorithm);
    //     const fileStream = fs.createReadStream(filePath);
    //     fileStream.on("data", (data) => {
    //       hash.update(data);
    //     });
    //     fileStream.on("end", () => {
    //       const fileHash = hash.digest("hex");
    //       resolve(fileHash);
    //     });
    //     fileStream.on("error", (error) => {
    //       reject(`Error reading file: ${error.message}`);
    //     });
    //   });
    // }
    const onDone = async () => {
        if (nodeDone && webDone) {
            status = "built";
        }
        if (nodeDone && webDone && status === "built") {
            // Object.entries(nodeEntryPoints).forEach(([k, outputFile]) => {
            //   console.log("watching", outputFile);
            //   try {
            //     watch(outputFile, async (filename) => {
            //       const hash = await fileHash(outputFile);
            //       if (fileHashes[k] !== hash) {
            //         fileHashes[k] = hash;
            //         console.log(`< ${filename} `);
            //         pm.launchNode(k, outputFile);
            //       }
            //     });
            //   } catch (e) {
            //     console.error(e);
            //   }
            // });
            // Object.entries(webEntryPoints).forEach(([k, outputFile]) => {
            //   console.log("watching", outputFile);
            //   watch(outputFile, async (filename) => {
            //     const hash = await fileHash(outputFile);
            //     console.log(`< ${filename} ${hash}`);
            //     if (fileHashes[k] !== hash) {
            //       fileHashes[k] = hash;
            //       pm.launchWeb(k, outputFile);
            //     }
            //   });
            // });
        }
        if (nodeDone && webDone && mode === "PROD") {
            console.log("Testeranto-EsBuild is all done. Goodbye!");
            process.exit();
        }
        else {
            if (mode === "PROD") {
                console.log("waiting for tests to finish");
                console.log(JSON.stringify({
                    nodeDone: nodeDone,
                    webDone: webDone,
                    mode: mode,
                }, null, 2));
            }
            else {
                console.log("waiting for tests to change");
            }
            console.log("press 'q' to quit");
            if (config.devMode) {
                console.log("ready and watching for changes...");
            }
            else {
                pm.shutDown();
            }
            ////////////////////////////////////////////////////////////////////////////////
        }
    };
    console.log(`Press 'q' to shutdown gracefully. Press 'x' to shutdown forcefully.`);
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "q") {
            console.log("Testeranto-EsBuild is shutting down...");
            mode = "PROD";
            onDone();
        }
    });
    // const eslint = new ESLint();
    // const configEslint = await eslint.calculateConfigForFile(
    //   "./src/eslint.config.mjs"
    // );
    // // console.log(`configEslint`, configEslint);
    // fs.watch("src", { recursive: true }, async (eventType, filename) => {
    //   if (eventType === "change") {
    //     console.log(`File ${filename} has been modified.`);
    //     const x = await eslint.lintFiles([`./src/${filename}`]);
    //     console.log(x[0].messages);
    //   } else if (eventType === "rename") {
    //     console.log(`File ${filename} has been created or deleted.`);
    //   }
    // });
    fs_1.default.writeFileSync(`${config.outdir}/testeranto.json`, JSON.stringify(config, null, 2));
    Promise.resolve(Promise.all([...getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
        const sourceFileSplit = sourceFilePath.split("/");
        const sourceDir = sourceFileSplit.slice(0, -1);
        const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
        const sourceFileNameMinusJs = sourceFileName
            .split(".")
            .slice(0, -1)
            .join(".");
        const htmlFilePath = path_1.default.normalize(`${process.cwd()}/${config.outdir}/web/${sourceDir.join("/")}/${sourceFileNameMinusJs}.html`);
        const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
        return fs_1.default.promises
            .mkdir(path_1.default.dirname(htmlFilePath), { recursive: true })
            .then((x) => fs_1.default.writeFileSync(htmlFilePath, (0, web_html_js_1.default)(jsfilePath, htmlFilePath)));
    })));
    (0, glob_1.glob)(`./${config.outdir}/chunk-*.mjs`, {
        ignore: "node_modules/**",
    }).then((chunks) => {
        chunks.forEach((chunk) => {
            fs_1.default.unlinkSync(chunk);
        });
    });
    // const processDebouncedEvents: DebouncedEventsProcessor = (events) => {
    //   typecheck();
    // };
    (0, debounce_watch_1.debounceWatch)((events) => {
        typecheck();
        eslint();
    }, "./src", {
        onlyFileExtensions: ["ts", "tsx", "mts"],
        debounceWaitSeconds: 0.2,
        allowOverlappingRuns: false,
    });
    await pm.startPuppeteer({
        slowMo: 1,
        // timeout: 1,
        waitForInitialPage: false,
        executablePath: 
        // process.env.CHROMIUM_PATH || "/opt/homebrew/bin/chromium",
        "/opt/homebrew/bin/chromium",
        headless: true,
        dumpio: true,
        // timeout: 0,
        devtools: true,
        args: [
            "--auto-open-devtools-for-tabs",
            `--remote-debugging-port=3234`,
            // "--disable-features=IsolateOrigins,site-per-process",
            "--disable-site-isolation-trials",
            "--allow-insecure-localhost",
            "--allow-file-access-from-files",
            "--allow-running-insecure-content",
            "--disable-dev-shm-usage",
            "--disable-extensions",
            "--disable-gpu",
            "--disable-setuid-sandbox",
            "--disable-site-isolation-trials",
            "--disable-web-security",
            "--no-first-run",
            "--no-sandbox",
            "--no-startup-window",
            // "--no-zygote",
            "--reduce-security-for-testing",
            "--remote-allow-origins=*",
            "--unsafely-treat-insecure-origin-as-secure=*",
            // "--disable-features=IsolateOrigins",
            // "--remote-allow-origins=ws://localhost:3234",
            // "--single-process",
            // "--unsafely-treat-insecure-origin-as-secure",
            // "--unsafely-treat-insecure-origin-as-secure=ws://192.168.0.101:3234",
            // "--disk-cache-dir=/dev/null",
            // "--disk-cache-size=1",
            // "--start-maximized",
        ],
    }, ".");
    await Promise.all([
        esbuild_1.default
            .context((0, node_js_1.default)(config, Object.keys(nodeEntryPoints)))
            .then(async (nodeContext) => {
            if (config.devMode) {
                await nodeContext.watch().then((v) => {
                    onNodeDone();
                });
            }
            else {
                nodeContext.rebuild().then((v) => {
                    onNodeDone();
                });
            }
            return nodeContext;
        }),
        esbuild_1.default
            .context((0, web_js_1.default)(config, Object.keys(webEntryPoints)))
            .then(async (webContext) => {
            if (config.devMode) {
                await webContext.watch().then((v) => {
                    onWebDone();
                });
            }
            else {
                webContext.rebuild().then((v) => {
                    onWebDone();
                });
            }
            return webContext;
        }),
    ]);
});
