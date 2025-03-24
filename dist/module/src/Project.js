import { spawn } from "child_process";
import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import readline from "readline";
import { glob } from "glob";
import esbuildNodeConfiger from "./esbuildConfigs/node.js";
import esbuildWebConfiger from "./esbuildConfigs/web.js";
import webHtmlFrame from "./web.html.js";
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
export class ITProject {
    constructor(configs) {
        this.nodeDone = false;
        this.webDone = false;
        this.onNodeDone = () => {
            this.nodeDone = true;
            this.onDone();
        };
        this.onWebDone = () => {
            this.webDone = true;
            this.onDone();
        };
        this.onDone = () => {
            // console.log(this.nodeDone && this.webDone && this.mode === "PROD");
            if (this.nodeDone && this.webDone && this.mode === "PROD") {
                console.log("Testeranto-EsBuild is all done. Goodbye!");
                process.exit();
            }
            else {
                if (this.mode === "PROD") {
                    console.log("waiting for tests to finish");
                    console.log(JSON.stringify({
                        nodeDone: this.nodeDone,
                        webDone: this.webDone,
                        mode: this.mode,
                    }, null, 2));
                }
                else {
                    console.log("waiting for tests to change");
                }
                console.log("press 'q' to quit");
            }
        };
        this.config = configs;
        this.mode = this.config.devMode ? "DEV" : "PROD";
        process.stdin.on("keypress", (str, key) => {
            if (key.name === "q") {
                console.log("Testeranto-EsBuild is shutting down...");
                this.mode = "PROD";
                this.onDone();
            }
        });
        fs.writeFileSync(`${this.config.outdir}/testeranto.json`, JSON.stringify(Object.assign(Object.assign({}, this.config), { buildDir: process.cwd() + "/" + this.config.outdir }), null, 2));
        Promise.resolve(Promise.all([...this.getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
            const sourceFileSplit = sourceFilePath.split("/");
            const sourceDir = sourceFileSplit.slice(0, -1);
            const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
            const sourceFileNameMinusJs = sourceFileName
                .split(".")
                .slice(0, -1)
                .join(".");
            const htmlFilePath = path.normalize(`${process.cwd()}/${this.config.outdir}/web/${sourceDir.join("/")}/${sourceFileNameMinusJs}.html`);
            const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
            return fs.promises
                .mkdir(path.dirname(htmlFilePath), { recursive: true })
                .then((x) => fs.writeFileSync(htmlFilePath, webHtmlFrame(jsfilePath, htmlFilePath)));
        })));
        const [nodeEntryPoints, webEntryPoints] = getRunnables(this.config.tests);
        glob(`./${this.config.outdir}/chunk-*.mjs`, {
            ignore: "node_modules/**",
        }).then((chunks) => {
            chunks.forEach((chunk) => {
                fs.unlinkSync(chunk);
            });
        });
        Promise.all([
            compile(),
            esbuild
                .context(esbuildNodeConfiger(this.config, nodeEntryPoints))
                .then(async (nodeContext) => {
                if (this.config.devMode) {
                    await nodeContext.watch().then((v) => {
                        this.onNodeDone();
                    });
                }
                else {
                    nodeContext.rebuild().then((v) => {
                        this.onNodeDone();
                    });
                }
                return nodeContext;
            }),
            esbuild
                .context(esbuildWebConfiger(this.config, webEntryPoints))
                .then(async (webContext) => {
                if (this.config.devMode) {
                    await webContext.watch().then((v) => {
                        this.onWebDone();
                    });
                }
                else {
                    webContext.rebuild().then((v) => {
                        this.onWebDone();
                    });
                }
                return webContext;
            }),
        ]);
    }
    getSecondaryEndpointsPoints(runtime) {
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
        return Array.from(meta(this.config.tests, new Set()));
    }
}
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
