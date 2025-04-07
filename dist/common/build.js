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
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
const glob_1 = require("glob");
const esbuild_1 = __importDefault(require("esbuild"));
const node_js_1 = __importDefault(require("./esbuildConfigs/node.js"));
const web_js_1 = __importDefault(require("./esbuildConfigs/web.js"));
const web_html_js_1 = __importDefault(require("./web.html.js"));
readline_1.default.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
let testName = process.argv[2];
let mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
    console.error(`The 4th argument should be 'dev' or 'once', not '${mode}'.`);
    process.exit(-1);
}
console.log("testeranto is building", testName, mode);
Promise.resolve(`${process.cwd() + "/" + "testeranto.config.ts"}`).then(s => __importStar(require(s))).then(async (module) => {
    const bigConfig = module.default;
    const project = bigConfig.projects[testName];
    if (!project) {
        console.error("no project found for", testName, "in testeranto.config.ts");
        process.exit(-1);
    }
    const rawConfig = bigConfig.projects[testName];
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
    const config = Object.assign(Object.assign({}, rawConfig), { buildDir: process.cwd() + "/testeranto/bundles/" + testName });
    console.log(`Press 'q' to shutdown gracefully. Press 'x' to shutdown forcefully.`);
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "q") {
            console.log("Testeranto-Build is shutting down...");
            mode = "once";
            onDone();
        }
        else if (key.name === "x") {
            console.log("Testeranto-Build is shutting down forcefully...");
            process.exit(-1);
        }
        else {
            console.log(`Press 'q' to shutdown gracefully. Press 'x' to shutdown forcefully.`);
        }
    });
    let nodeDone = false;
    let webDone = false;
    let status = "build";
    const { nodeEntryPoints, webEntryPoints } = getRunnables(config.tests);
    const onNodeDone = () => {
        nodeDone = true;
        onDone();
    };
    const onWebDone = () => {
        webDone = true;
        onDone();
    };
    const onDone = async () => {
        if (nodeDone && webDone) {
            status = "built";
        }
        if (nodeDone && webDone && mode === "once") {
            console.log(ansi_colors_1.default.inverse(`${testName} has been built. Goodbye.`));
            process.exit();
        }
    };
    if (!fs_1.default.existsSync(`testeranto/reports/${testName}`)) {
        fs_1.default.mkdirSync(`testeranto/reports/${testName}`);
    }
    fs_1.default.writeFileSync(`${process.cwd()}/testeranto/reports/${testName}/index.html`, `
    <!DOCTYPE html>
    <html lang="en">
  
    <head>
      <meta name="description" content="Webpage description goes here" />
      <meta charset="utf-8" />
      <title>kokomoBay - testeranto</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="" />
  
      <link rel="stylesheet" href="/kokomoBay/testeranto/ReportClient.css" />
      <script type="module" src="/kokomoBay/testeranto/ReportClient.js"></script>
  
    </head>
  
    <body>
      <div id="root">
        react is loading
      </div>
    </body>
  
    </html>
        `);
    fs_1.default.writeFileSync(`testeranto/reports/${testName}/config.json`, JSON.stringify(config, null, 2));
    fs_1.default.writeFileSync(`${process.cwd()}/testeranto/index.html`, `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta name="description" content="Webpage description goes here" />
    <meta charset="utf-8" />
    <title>kokomoBay - testeranto</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="author" content="" />

    <script type="application/json" id="bigConfig">
      ${JSON.stringify(Object.keys(bigConfig.projects))}
    </script>

    <link rel="stylesheet" href="/kokomoBay/testeranto/Project.css" />
    <script type="module" src="/kokomoBay/testeranto/Project.js"></script>

  </head>

  <body>
    <div id="root">
      react is loading
    </div>
  </body>

  </html>
      `);
    Promise.resolve(Promise.all([...getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
        const sourceFileSplit = sourceFilePath.split("/");
        const sourceDir = sourceFileSplit.slice(0, -1);
        const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
        const sourceFileNameMinusJs = sourceFileName
            .split(".")
            .slice(0, -1)
            .join(".");
        const htmlFilePath = path_1.default.normalize(`${process.cwd()}/testeranto/bundles/web/${testName}/${sourceDir.join("/")}/${sourceFileNameMinusJs}.html`);
        const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
        return fs_1.default.promises
            .mkdir(path_1.default.dirname(htmlFilePath), { recursive: true })
            .then((x) => fs_1.default.writeFileSync(htmlFilePath, (0, web_html_js_1.default)(jsfilePath, htmlFilePath)));
    })));
    (0, glob_1.glob)(`${process.cwd()}/testeranto/bundles/${testName}/chunk-*.mjs`, {
        ignore: "node_modules/**",
    }).then((chunks) => {
        chunks.forEach((chunk) => {
            fs_1.default.unlinkSync(chunk);
        });
    });
    await Promise.all([
        esbuild_1.default
            .context((0, node_js_1.default)(config, Object.keys(nodeEntryPoints), testName))
            .then(async (nodeContext) => {
            if (mode === "dev") {
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
            .context((0, web_js_1.default)(config, Object.keys(webEntryPoints), testName))
            .then(async (webContext) => {
            if (mode === "dev") {
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
