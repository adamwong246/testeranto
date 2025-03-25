import { spawn } from "child_process";
import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import readline from "readline";
import { glob } from "glob";
import watch from "recursive-watch";
import esbuildNodeConfiger from "./esbuildConfigs/node.js";
import esbuildWebConfiger from "./esbuildConfigs/web.js";
import webHtmlFrame from "./web.html.js";
import { PM_Main } from "./PM/main.js";
import { destinationOfRuntime } from "./utils.js";
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
const logContent = [];
function parseTsErrors() {
    try {
        // const logContent = fs.readFileSync(logPath, "utf-8").split("\n");
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
            fs.mkdirSync(`./docs/types/${k.split("/").slice(0, -1).join("/")}`, {
                recursive: true,
            });
            fs.writeFileSync(`./docs/types/${k}.type_errors.txt`, final[k].flat().flat().join("\r\n"));
        });
    }
    catch (error) {
        console.error("Error reading or parsing the log file:", error);
        process.exit(1);
    }
}
const compile = () => {
    return new Promise((resolve, reject) => {
        const tsc = spawn("tsc", ["-noEmit"]);
        tsc.stdout.on("data", (data) => {
            // console.log(`tsc stdout: ${data}`);
            const lines = data.toString().split("\n");
            logContent.push(...lines);
        });
        tsc.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
            process.exit(-1);
        });
        tsc.on("close", (code) => {
            parseTsErrors();
            console.log("tsc done");
            resolve(`tsc process exited with code ${code}`);
            // if (code !== 0) {
            //   resolve(`tsc process exited with code ${code}`);
            //   // reject(`tsc process exited with code ${code}`);
            // } else {
            //   resolve({});
            // }
        });
    });
};
const getRunnables = (tests, payload = [new Set(), new Set()]) => {
    return tests.reduce((pt, cv, cndx, cry) => {
        if (cv[1] === "node") {
            pt[0].add(cv[0]);
        }
        else if (cv[1] === "web") {
            pt[1].add(cv[0]);
        }
        if (cv[3].length) {
            getRunnables(cv[3], payload);
        }
        return pt;
    }, payload);
};
import(process.cwd() + "/" + process.argv[2]).then((module) => {
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
    let pm = new PM_Main(config);
    const onNodeDone = () => {
        nodeDone = true;
        onDone();
    };
    const onWebDone = () => {
        webDone = true;
        onDone();
    };
    const onDone = async () => {
        // console.log(nodeDone && webDone && this.mode === "PROD");
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
            ///////////////////////////////////////////////////////////////////////////////////////////
            if (status === "build") {
                status = "built";
            }
            else {
                await pm.startPuppeteer({
                    slowMo: 1,
                    // timeout: 1,
                    waitForInitialPage: false,
                    executablePath: 
                    // process.env.CHROMIUM_PATH || "/opt/homebrew/bin/chromium",
                    "/opt/homebrew/bin/chromium",
                    headless: false,
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
                console.log("\n Puppeteer is running. Press 'q' to shutdown softly. Press 'x' to shutdown forcefully.\n");
                config.tests.forEach(([test, runtime, tr, sidecars]) => {
                    if (runtime === "node") {
                        pm.launchNode(test, destinationOfRuntime(test, "node", config));
                    }
                    else if (runtime === "web") {
                        pm.launchWeb(test, destinationOfRuntime(test, "web", config), sidecars);
                    }
                    else {
                        console.error("runtime makes no sense", runtime);
                    }
                });
            }
            ///////////////////////////////////////////////////////////////////////////////////////////
            if (config.devMode) {
                console.log("ready and watching for changes...", config.buildDir);
                watch(config.buildDir, (eventType, changedFile) => {
                    if (changedFile) {
                        config.tests.forEach(([test, runtime, tr, sidecars]) => {
                            if (eventType === "change" || eventType === "rename") {
                                if (changedFile ===
                                    test
                                        .replace("./", "node/")
                                        .split(".")
                                        .slice(0, -1)
                                        .concat("mjs")
                                        .join(".")) {
                                    pm.launchNode(test, destinationOfRuntime(test, "node", config));
                                }
                                if (changedFile ===
                                    test
                                        .replace("./", "web/")
                                        .split(".")
                                        .slice(0, -1)
                                        .concat("mjs")
                                        .join(".")) {
                                    pm.launchWeb(test, destinationOfRuntime(test, "web", config), sidecars);
                                }
                            }
                        });
                    }
                });
            }
            else {
                pm.shutDown();
            }
            ////////////////////////////////////////////////////////////////////////////////
        }
    };
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "q") {
            console.log("Testeranto-EsBuild is shutting down...");
            mode = "PROD";
            onDone();
        }
    });
    fs.writeFileSync(`${config.outdir}/testeranto.json`, JSON.stringify(config, null, 2));
    Promise.resolve(Promise.all([...getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
        const sourceFileSplit = sourceFilePath.split("/");
        const sourceDir = sourceFileSplit.slice(0, -1);
        const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
        const sourceFileNameMinusJs = sourceFileName
            .split(".")
            .slice(0, -1)
            .join(".");
        const htmlFilePath = path.normalize(`${process.cwd()}/${config.outdir}/web/${sourceDir.join("/")}/${sourceFileNameMinusJs}.html`);
        const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
        return fs.promises
            .mkdir(path.dirname(htmlFilePath), { recursive: true })
            .then((x) => fs.writeFileSync(htmlFilePath, webHtmlFrame(jsfilePath, htmlFilePath)));
    })));
    const [nodeEntryPoints, webEntryPoints] = getRunnables(config.tests);
    glob(`./${config.outdir}/chunk-*.mjs`, {
        ignore: "node_modules/**",
    }).then((chunks) => {
        chunks.forEach((chunk) => {
            fs.unlinkSync(chunk);
        });
    });
    Promise.all([
        compile(),
        esbuild
            .context(esbuildNodeConfiger(config, nodeEntryPoints))
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
        esbuild
            .context(esbuildWebConfiger(config, webEntryPoints))
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
