"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
const readline_1 = __importDefault(require("readline"));
const buildTemplates_1 = require("./utils/buildTemplates");
const pitonoBuild_1 = require("./PM/pitonoBuild");
const utils_1 = require("./app/backend/utils");
const { GolingvuBuild } = await Promise.resolve().then(() => __importStar(require("./PM/golingvuBuild")));
// if (!process.env.GITHUB_CLIENT_ID) {
//   console.error(`env var "GITHUB_CLIENT_ID" needs to be set!`);
//   process.exit(-1);
// }
// if (!process.env.GITHUB_CLIENT_SECRET) {
//   console.error(`env var "GITHUB_CLIENT_SECRET" needs to be set!`);
//   process.exit(-1);
// }
readline_1.default.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);
const testName = process.argv[2];
const mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
    console.error(`The 3rd argument should be 'dev' or 'once', not '${mode}'.`);
    process.exit(-1);
}
const configFilePath = process.cwd() + "/" + "testeranto.config.ts";
Promise.resolve(`${configFilePath}`).then(s => __importStar(require(s))).then(async (module) => {
    const pckge = (await Promise.resolve(`${`${process.cwd()}/package.json`}`).then(s => __importStar(require(s)))).default;
    const bigConfig = module.default;
    const project = bigConfig.projects[testName];
    if (!project) {
        console.error("no project found for", testName, "in testeranto.config.ts");
        process.exit(-1);
    }
    try {
        fs_1.default.writeFileSync(`${process.cwd()}/testeranto/projects.json`, JSON.stringify(Object.keys(bigConfig.projects), null, 2));
    }
    catch (e) {
        console.error("there was a problem");
        console.error(e);
    }
    const rawConfig = bigConfig.projects[testName];
    if (!rawConfig) {
        console.error(`Project "${testName}" does not exist in the configuration.`);
        console.error("Available projects:", Object.keys(bigConfig.projects));
        process.exit(-1);
    }
    if (!rawConfig.tests) {
        console.error(testName, "appears to have no tests: ", configFilePath);
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
    //////////////////////////////////////////////////////////////////////////////////////////////////
    let pm = null;
    // Start PM_Main immediately - it will handle the build processes internally
    const { PM_Main } = await Promise.resolve().then(() => __importStar(require("./app/backend/main")));
    pm = new PM_Main(config, testName, mode);
    await pm.start();
    fs_1.default.writeFileSync(`${process.cwd()}/testeranto/index.html`, (0, buildTemplates_1.AppHtml)());
    Object.keys(bigConfig.projects).forEach((projectName) => {
        // console.log(`testeranto/reports/${projectName}`);
        if (!fs_1.default.existsSync(`testeranto/reports/${projectName}`)) {
            fs_1.default.mkdirSync(`testeranto/reports/${projectName}`);
        }
        fs_1.default.writeFileSync(`testeranto/reports/${projectName}/config.json`, JSON.stringify(config, null, 2));
    });
    // const getSecondaryEndpointsPoints = (runtime?: IRunTime): string[] => {
    //   const meta = (ts: ITestTypes[], st: Set<string>): Set<string> => {
    //     ts.forEach((t) => {
    //       if (t[1] === runtime) {
    //         st.add(t[0]);
    //       }
    //       if (Array.isArray(t[3])) {
    //         meta(t[3], st);
    //       }
    //     });
    //     return st;
    //   };
    //   return Array.from(meta(config.tests, new Set()));
    // };
    // Also handle pitono endpoints for HTML generation if needed
    // [...getSecondaryEndpointsPoints("python")].forEach(async (sourceFilePath) => {
    //   // You might want to generate specific files for pitono tests here
    //   console.log(`Pitono test found: ${sourceFilePath}`);
    // });
    // Promise.resolve(
    //   Promise.all(
    //     [...getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
    //       const sourceFileSplit = sourceFilePath.split("/");
    //       const sourceDir = sourceFileSplit.slice(0, -1);
    //       const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
    //       const sourceFileNameMinusJs = sourceFileName
    //         .split(".")
    //         .slice(0, -1)
    //         .join(".");
    //       const htmlFilePath = path.normalize(
    //         `${process.cwd()}/testeranto/bundles/web/${testName}/${sourceDir.join(
    //           "/"
    //         )}/${sourceFileNameMinusJs}.html`
    //       );
    //       const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
    //       const cssFilePath = `./${sourceFileNameMinusJs}.css`;
    //       return fs.promises
    //         .mkdir(path.dirname(htmlFilePath), { recursive: true })
    //         .then((x) =>
    //           fs.writeFileSync(
    //             htmlFilePath,
    //             webHtmlFrame(jsfilePath, htmlFilePath, cssFilePath)
    //           )
    //         );
    //     })
    //   )
    // );
    const { nodeEntryPoints, nodeEntryPointSidecars, webEntryPoints, webEntryPointSidecars, pureEntryPoints, pureEntryPointSidecars, pythonEntryPoints, pythonEntryPointSidecars, golangEntryPoints, golangEntryPointSidecars, } = (0, utils_1.getRunnables)(config.tests, testName);
    // Debug logging to check if entry points are being found
    console.log("Node entry points:", Object.keys(nodeEntryPoints));
    console.log("Web entry points:", Object.keys(webEntryPoints));
    console.log("Pure entry points:", Object.keys(pureEntryPoints));
    // Handle golang tests using GolingvuBuild
    const golangTests = config.tests.filter((test) => test[1] === "golang");
    const hasGolangTests = golangTests.length > 0;
    if (hasGolangTests) {
        const golingvuBuild = new GolingvuBuild(config, testName);
        const golangEntryPoints = await golingvuBuild.build();
        golingvuBuild.onBundleChange(() => {
            Object.keys(golangEntryPoints).forEach((entryPoint) => {
                if (pm) {
                    pm.addToQueue(entryPoint, "golang");
                }
            });
        });
    }
    // Handle pitono (Python) tests by generating their metafiles
    const pitonoTests = config.tests.filter((test) => test[1] === "python");
    const hasPitonoTests = pitonoTests.length > 0;
    if (hasPitonoTests) {
        const pitonoBuild = new pitonoBuild_1.PitonoBuild(config, testName);
        const pitonoEntryPoints = await pitonoBuild.build();
        pitonoBuild.onBundleChange(() => {
            Object.keys(pitonoEntryPoints).forEach((entryPoint) => {
                if (pm) {
                    pm.addToQueue(entryPoint, "python");
                }
            });
        });
    }
    // create the necessary folders for all tests
    [
        ["pure", Object.keys(pureEntryPoints)],
        ["node", Object.keys(nodeEntryPoints)],
        ["web", Object.keys(webEntryPoints)],
        ["python", Object.keys(pythonEntryPoints)],
        ["golang", Object.keys(golangEntryPoints)],
    ].forEach(async ([runtime, keys]) => {
        keys.forEach(async (k) => {
            fs_1.default.mkdirSync(`testeranto/reports/${testName}/${k
                .split(".")
                .slice(0, -1)
                .join(".")}/${runtime}`, { recursive: true });
        });
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
