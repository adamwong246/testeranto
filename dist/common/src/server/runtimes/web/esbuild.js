"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const featuresPlugin_js_1 = __importDefault(require("../../../esbuildConfigs/featuresPlugin.js"));
const index_js_1 = __importDefault(require("../../../esbuildConfigs/index.js"));
const inputFilesPlugin_js_1 = __importDefault(require("../../../esbuildConfigs/inputFilesPlugin.js"));
const rebuildPlugin_js_1 = __importDefault(require("../../../esbuildConfigs/rebuildPlugin.js"));
const absoluteBundlesDir = (c) => {
    return "./testeranto/bundles/allTests/web/";
};
exports.default = (config, testName) => {
    var _a, _b;
    // Use the same entry points as node tests for consistency
    const entrypoints = ["./example/Calculator.test.ts"];
    const { inputFilesPluginFactory, register } = (0, inputFilesPlugin_js_1.default)("web", testName);
    return Object.assign(Object.assign({}, (0, index_js_1.default)(config)), { outdir: absoluteBundlesDir(config), outbase: ".", metafile: true, supported: {
            "dynamic-import": true,
        }, define: {
            "process.env.FLUENTFFMPEG_COV": "0",
            ENV: `"web"`,
        }, absWorkingDir: process.cwd(), platform: "browser", packages: "external", entryPoints: entrypoints, bundle: true, format: "esm", plugins: [
            featuresPlugin_js_1.default,
            inputFilesPluginFactory,
            (0, rebuildPlugin_js_1.default)("web"),
            ...(((_b = (_a = config.web) === null || _a === void 0 ? void 0 : _a.plugins) === null || _b === void 0 ? void 0 : _b.map((p) => p(register, entrypoints))) || []),
        ] });
};
