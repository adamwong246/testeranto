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
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
const esbuild_1 = __importDefault(require("esbuild"));
const utils_1 = require("./utils");
const buildTemplates_1 = require("./utils/buildTemplates");
const node_1 = __importDefault(require("./esbuildConfigs/node"));
const web_1 = __importDefault(require("./esbuildConfigs/web"));
const pure_1 = __importDefault(require("./esbuildConfigs/pure"));
const web_html_1 = __importDefault(require("./web.html"));
readline_1.default.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
const testName = process.argv[2];
const mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
    console.error(`The 3rd argument should be 'dev' or 'once', not '${mode}'.`);
    process.exit(-1);
}
const f = process.cwd() + "/" + "testeranto.config.ts";
console.log("config file:", f);
Promise.resolve(`${f}`).then(s => __importStar(require(s))).then(async (module) => {
    const pckge = (await Promise.resolve(`${`${process.cwd()}/package.json`}`).then(s => __importStar(require(s)))).default;
    const bigConfig = module.default;
    const project = bigConfig.projects[testName];
    if (!project) {
        console.error("no project found for", testName, "in testeranto.config.ts");
        process.exit(-1);
    }
    fs_1.default.writeFileSync(`${process.cwd()}/testeranto/projects.json`, JSON.stringify(Object.keys(bigConfig.projects), null, 2));
    const rawConfig = bigConfig.projects[testName];
    if (!rawConfig) {
        console.error(`Project "${testName}" does not exist in the configuration.`);
        console.error("Available projects:", Object.keys(bigConfig.projects));
        process.exit(-1);
    }
    if (!rawConfig.tests) {
        console.error(testName, "appears to have no tests: ", f);
        console.error(`here is the config:`);
        console.log(JSON.stringify(rawConfig));
        process.exit(-1);
    }
    const config = Object.assign(Object.assign({}, rawConfig), { buildDir: process.cwd() + "/testeranto/bundles/" + testName });
    console.log(ansi_colors_1.default.inverse("Press 'q' to initiate a graceful shutdown."));
    console.log(ansi_colors_1.default.inverse("Press 'x' to quit forcefully."));
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "x") {
            console.log(ansi_colors_1.default.inverse("Shutting down forcefully..."));
            process.exit(-1);
        }
    });
    let nodeDone = false;
    let webDone = false;
    let importDone = false;
    let status = "build";
    const { nodeEntryPoints, nodeEntryPointSidecars, webEntryPoints, webEntryPointSidecars, pureEntryPoints, pureEntryPointSidecars, } = (0, utils_1.getRunnables)(config.tests, testName);
    const onNodeDone = () => {
        nodeDone = true;
        onDone();
    };
    const onWebDone = () => {
        webDone = true;
        onDone();
    };
    const onImportDone = () => {
        importDone = true;
        onDone();
    };
    let pm = null;
    const onDone = async () => {
        if (nodeDone && webDone && importDone) {
            status = "built";
            // Start the PM_Main to run the tests after build
            if (!pm) {
                const { PM_Main } = await Promise.resolve().then(() => __importStar(require("./PM/main")));
                pm = new PM_Main(config, testName, mode);
                await pm.start();
            }
        }
        if (nodeDone && webDone && importDone && mode === "once") {
            console.log(ansi_colors_1.default.inverse(`${testName} was built and the builder exited successfully.`));
            // Let PM_Main handle the exit after tests are complete
        }
    };
    fs_1.default.writeFileSync(`${process.cwd()}/testeranto/projects.html`, (0, buildTemplates_1.AppHtml)());
    Object.keys(bigConfig.projects).forEach((projectName) => {
        console.log(`testeranto/reports/${projectName}`);
        if (!fs_1.default.existsSync(`testeranto/reports/${projectName}`)) {
            fs_1.default.mkdirSync(`testeranto/reports/${projectName}`);
        }
        fs_1.default.writeFileSync(`testeranto/reports/${projectName}/config.json`, JSON.stringify(config, null, 2));
    });
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
        const cssFilePath = `./${sourceFileNameMinusJs}.css`;
        return fs_1.default.promises
            .mkdir(path_1.default.dirname(htmlFilePath), { recursive: true })
            .then((x) => fs_1.default.writeFileSync(htmlFilePath, (0, web_html_1.default)(jsfilePath, htmlFilePath, cssFilePath)));
    })));
    const x = [
        ["pure", Object.keys(pureEntryPoints)],
        ["node", Object.keys(nodeEntryPoints)],
        ["web", Object.keys(webEntryPoints)],
    ];
    x.forEach(async ([runtime, keys]) => {
        keys.forEach(async (k) => {
            const folder = `testeranto/reports/${testName}/${k
                .split(".")
                .slice(0, -1)
                .join(".")}/${runtime}`;
            await fs_1.default.mkdirSync(folder, { recursive: true });
        });
    });
    [
        [pureEntryPoints, pureEntryPointSidecars, "pure"],
        [webEntryPoints, webEntryPointSidecars, "web"],
        [nodeEntryPoints, nodeEntryPointSidecars, "node"],
    ].forEach(([eps, eps2, runtime]) => {
        [...Object.keys(eps), ...Object.keys(eps2)].forEach((ep) => {
            const fp = path_1.default.resolve(`testeranto`, `reports`, testName, ep.split(".").slice(0, -1).join("."), runtime);
            fs_1.default.mkdirSync(fp, { recursive: true });
        });
    });
    await Promise.all([
        ...[
            [
                pure_1.default,
                pureEntryPoints,
                pureEntryPointSidecars,
                onImportDone,
            ],
            [
                node_1.default,
                nodeEntryPoints,
                nodeEntryPointSidecars,
                onNodeDone,
            ],
            [web_1.default, webEntryPoints, webEntryPointSidecars, onWebDone],
        ].map(([configer, entryPoints, sidecars, done]) => {
            esbuild_1.default
                .context(configer(config, [...Object.keys(entryPoints), ...Object.keys(sidecars)], testName))
                .then(async (ctx) => {
                if (mode === "dev") {
                    await ctx.watch().then((v) => {
                        done();
                    });
                }
                else {
                    ctx.rebuild().then((v) => {
                        done();
                    });
                }
                return ctx;
            });
        }),
    ]);
    process.stdin.on("keypress", (str, key) => {
        if (key.name === "q") {
            console.log("Testeranto is shutting down gracefully...");
            if (pm) {
                pm.stop();
            }
            else {
                process.exit();
            }
        }
    });
});
