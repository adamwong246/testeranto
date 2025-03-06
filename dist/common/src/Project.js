"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITProject = void 0;
const esbuild_1 = __importDefault(require("esbuild"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
const glob_1 = require("glob");
const node_js_1 = __importDefault(require("./esbuildConfigs/node.js"));
const web_js_1 = __importDefault(require("./esbuildConfigs/web.js"));
const web_html_js_1 = __importDefault(require("./web.html.js"));
// var mode: "DEV" | "PROD" = process.argv[2] === "-dev" ? "DEV" : "PROD";
readline_1.default.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
class ITProject {
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
        fs_1.default.writeFileSync(`${this.config.outdir}/testeranto.json`, JSON.stringify(Object.assign(Object.assign({}, this.config), { buildDir: process.cwd() + "/" + this.config.outdir }), null, 2));
        Promise.resolve(Promise.all([...this.getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
            const sourceFileSplit = sourceFilePath.split("/");
            const sourceDir = sourceFileSplit.slice(0, -1);
            const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
            const sourceFileNameMinusJs = sourceFileName
                .split(".")
                .slice(0, -1)
                .join(".");
            const htmlFilePath = path_1.default.normalize(`${process.cwd()}/${this.config.outdir}/web/${sourceDir.join("/")}/${sourceFileNameMinusJs}.html`);
            const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
            return fs_1.default.promises
                .mkdir(path_1.default.dirname(htmlFilePath), { recursive: true })
                .then((x) => fs_1.default.writeFileSync(htmlFilePath, (0, web_html_js_1.default)(jsfilePath, htmlFilePath)));
        })));
        const [nodeEntryPoints, webEntryPoints] = getRunnables(this.config.tests);
        console.log(`this.getSecondaryEndpointsPoints("web")`, this.getSecondaryEndpointsPoints("web"));
        (0, glob_1.glob)(`./${this.config.outdir}/chunk-*.mjs`, {
            ignore: "node_modules/**",
        }).then((chunks) => {
            chunks.forEach((chunk) => {
                fs_1.default.unlinkSync(chunk);
            });
        });
        Promise.all([
            esbuild_1.default
                .context((0, node_js_1.default)(this.config, nodeEntryPoints))
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
            esbuild_1.default
                .context((0, web_js_1.default)(this.config, webEntryPoints))
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
                console.log("getSecondaryEndpointsPoints", t);
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
exports.ITProject = ITProject;
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
