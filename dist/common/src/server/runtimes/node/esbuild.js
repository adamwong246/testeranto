"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const featuresPlugin_js_1 = __importDefault(require("../../../esbuildConfigs/featuresPlugin.js"));
const index_js_1 = __importDefault(require("../../../esbuildConfigs/index.js"));
const inputFilesPlugin_js_1 = __importDefault(require("../../../esbuildConfigs/inputFilesPlugin.js"));
const rebuildPlugin_js_1 = __importDefault(require("../../../esbuildConfigs/rebuildPlugin.js"));
const absoluteBundlesDir = () => {
    return "./testeranto/bundles/allTests/node/";
};
exports.default = (nodeConfig, testName, projectConfig) => {
    var _a;
    console.log("esbuild", testName, projectConfig);
    const entryPoints = projectConfig.runtimes[testName].tests;
    // Get entry points from config, or use a default
    // let entrypoints: string[] = [];
    // if (nodeConfig) {
    //   entrypoints = (projectConfig.tests);
    // } else {
    //   // console.log(projectConfig)
    //   throw "projectConfig.node.tests should exist"
    //   // Fallback to a reasonable default
    //   // entrypoints = ["./example/Calculator.test.ts"];
    //   // console.warn(`No node.tests found in config, using default entry point: ${entrypoints[0]}`);
    // }
    const { inputFilesPluginFactory, register } = (0, inputFilesPlugin_js_1.default)("node", testName);
    return Object.assign(Object.assign({}, (0, index_js_1.default)(nodeConfig)), { outdir: absoluteBundlesDir(), outbase: ".", metafile: true, supported: {
            "dynamic-import": true,
        }, define: {
            "process.env.FLUENTFFMPEG_COV": "0",
            ENV: `"node"`,
        }, bundle: true, format: "esm", absWorkingDir: process.cwd(), platform: "node", packages: "external", entryPoints, plugins: [
            featuresPlugin_js_1.default,
            inputFilesPluginFactory,
            (0, rebuildPlugin_js_1.default)("node"),
            ...(((_a = nodeConfig.plugins) === null || _a === void 0 ? void 0 : _a.map((p) => p(register, entryPoints))) || []),
        ] });
};
