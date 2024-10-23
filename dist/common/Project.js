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
var mode = process.argv[2] === "-dev" ? "DEV" : "PROD";
readline_1.default.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
        console.log("Testeranto-EsBuild is shutting down...");
        mode = "PROD";
        onDone();
    }
});
// setInterval(() => {
//   const memoryUsage = process.memoryUsage();
//   console.log("Memory usage:", memoryUsage);
// }, 10000); // Check every 10 seconds
let featuresDone, nodeDone, webDone = false;
const onFeaturesDone = () => {
    featuresDone = true;
    onDone();
};
const onNodeDone = () => {
    nodeDone = true;
    onDone();
};
const onWebDone = () => {
    webDone = true;
    onDone();
};
const onDone = () => {
    console.log(JSON.stringify({
        featuresDone,
        nodeDone,
        webDone,
        mode,
    }, null, 2));
    if (featuresDone && nodeDone && webDone && mode === "PROD") {
        console.log("Testeranto-EsBuild is all done. Goodbye!");
        process.exit();
    }
    else {
        console.log("Testeranto-EsBuild is still working...");
    }
};
class ITProject {
    constructor(config) {
        this.mode = `up`;
        this.config = config;
        Promise.resolve(Promise.all([...this.getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
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
        const [nodeEntryPoints, webEntryPoints] = getRunnables(this.config.tests);
        (0, glob_1.glob)(`./${config.outdir}/chunk-*.mjs`, { ignore: "node_modules/**" }).then((chunks) => {
            chunks.forEach((chunk) => {
                fs_1.default.unlinkSync(chunk);
            });
        });
        fs_1.default.copyFileSync("./node_modules/testeranto/dist/prebuild/Report.js", "./docs/Report.js");
        fs_1.default.copyFileSync("./node_modules/testeranto/dist/prebuild/Report.css", "./docs/Report.css");
        fs_1.default.writeFileSync(`${config.outdir}/report.html`, (0, report_html_js_1.default)());
        Promise.all([
            fs_1.default.promises.writeFile(`${config.outdir}/testeranto.json`, JSON.stringify(Object.assign(Object.assign({}, config), { buildDir: process.cwd() + "/" + config.outdir }), null, 2)),
            esbuild_1.default
                .context((0, features_js_1.default)(config))
                .then(async (featuresContext) => {
                if (mode == "DEV") {
                    await featuresContext.watch();
                    onFeaturesDone();
                }
                else {
                    featuresContext.rebuild().then((v) => {
                        onFeaturesDone();
                    });
                }
                return featuresContext;
            }),
            esbuild_1.default
                .context((0, node_js_1.default)(config, nodeEntryPoints))
                .then(async (nodeContext) => {
                if (mode == "DEV") {
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
                .context((0, web_js_1.default)(config, webEntryPoints))
                .then(async (webContext) => {
                if (mode == "DEV") {
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
