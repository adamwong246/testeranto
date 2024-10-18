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
const features_js_1 = __importDefault(require("./esbuildConfigs/features.js"));
const web_html_js_1 = __importDefault(require("./web.html.js"));
const report_html_js_1 = __importDefault(require("./report.html.js"));
readline_1.default.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (key.name === 'q') {
        process.exit();
    }
});
const getRunnables = (tests, payload = [new Set(), new Set()]) => {
    return tests.reduce((pt, cv, cndx, cry) => {
        if (cv[1] === "node") {
            pt[0].add(cv[0]);
        }
        else if (cv[1] === "web") {
            pt[1].add(cv[0]);
        }
        if (cv[2].length) {
            getRunnables(cv[2], payload);
        }
        return pt;
    }, payload);
};
class ITProject {
    constructor(config) {
        this.mode = `up`;
        this.config = config;
        Promise.resolve(Promise.all([
            ...this.getSecondaryEndpointsPoints("web"),
        ]
            .map(async (sourceFilePath) => {
            const sourceFileSplit = sourceFilePath.split("/");
            const sourceDir = sourceFileSplit.slice(0, -1);
            const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
            const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
            const htmlFilePath = path_1.default.normalize(`${process.cwd()}/${config.outdir}/web/${sourceDir.join("/")}/${sourceFileNameMinusJs}.html`);
            const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
            return fs_1.default.promises.mkdir(path_1.default.dirname(htmlFilePath), { recursive: true }).then(x => fs_1.default.writeFileSync(htmlFilePath, (0, web_html_js_1.default)(jsfilePath, htmlFilePath)));
        })));
        const [nodeEntryPoints, webEntryPoints] = getRunnables(this.config.tests);
        (0, glob_1.glob)(`./${config.outdir}/chunk-*.mjs`, { ignore: 'node_modules/**' }).then((chunks) => {
            console.log("deleting chunks", chunks);
            chunks.forEach((chunk) => {
                console.log("deleting chunk", chunk);
                fs_1.default.unlinkSync(chunk);
            });
        });
        fs_1.default.copyFileSync("node_modules/testeranto/dist/prebuild/report.js", "./docs/Report.js");
        fs_1.default.copyFileSync("node_modules/testeranto/dist/prebuild/report.css", "./docs/Report.css");
        fs_1.default.writeFileSync(`${config.outdir}/report.html`, (0, report_html_js_1.default)());
        Promise.all([
            esbuild_1.default.context((0, features_js_1.default)(config))
                .then(async (featuresContext) => {
                await featuresContext.watch();
                return featuresContext;
            }),
            esbuild_1.default.context((0, node_js_1.default)(config, nodeEntryPoints))
                .then(async (nodeContext) => {
                await nodeContext.watch();
                return nodeContext;
            }),
            esbuild_1.default.context((0, web_js_1.default)(config, webEntryPoints))
                .then(async (esbuildWeb) => {
                await esbuildWeb.watch();
                return esbuildWeb;
            }),
        ]).then(async (contexts) => {
            Promise.all(config.tests.map(async ([test, runtime]) => {
                return {
                    test,
                    runtime
                };
            })).then(async (modules) => {
                fs_1.default.writeFileSync(`${config.outdir}/testeranto.json`, JSON.stringify({
                    modules,
                    buildDir: process.cwd() + "/" + config.outdir
                }, null, 2));
            });
            console.log("\n Build is running. Press 'q' to quit\n");
            if (config.devMode === false) {
                console.log("Your tests were built but not run because devMode was false. Exiting gracefully");
                process.exit(0);
            }
            else {
                // no-op
            }
        });
    }
    getSecondaryEndpointsPoints(runtime) {
        const meta = (ts, st) => {
            ts.forEach((t) => {
                if (t[1] === runtime) {
                    st.add(t[0]);
                }
                if (Array.isArray(t[2])) {
                    meta(t[2], st);
                }
            });
            return st;
        };
        return Array.from(meta(this.config.tests, new Set()));
    }
}
exports.ITProject = ITProject;
;
