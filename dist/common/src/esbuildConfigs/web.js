"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const esbuild_plugin_polyfill_node_1 = require("esbuild-plugin-polyfill-node");
const path_1 = __importDefault(require("path"));
const index_js_1 = __importDefault(require("./index.js"));
const inputFilesPlugin_js_1 = __importDefault(require("./inputFilesPlugin.js"));
const featuresPlugin_js_1 = __importDefault(require("./featuresPlugin.js"));
const rebuildPlugin_js_1 = __importDefault(require("./rebuildPlugin.js"));
exports.default = (config, entryPoints, testName) => {
    const { inputFilesPluginFactory, register } = (0, inputFilesPlugin_js_1.default)("web", testName);
    return Object.assign(Object.assign({}, (0, index_js_1.default)(config)), { treeShaking: true, outdir: `testeranto/bundles/web/${testName}`, alias: {
            react: path_1.default.resolve("./node_modules/react"),
        }, metafile: true, external: [
            "path",
            "fs",
            "stream",
            "http",
            "constants",
            "net",
            "assert",
            "tls",
            "os",
            "child_process",
            "readline",
            "zlib",
            "crypto",
            "https",
            "util",
            "process",
            "dns",
        ], platform: "browser", entryPoints: [...entryPoints], plugins: [
            featuresPlugin_js_1.default,
            inputFilesPluginFactory,
            (0, esbuild_plugin_polyfill_node_1.polyfillNode)({
            // You might need to configure specific Node.js modules you want to polyfill
            // Example:
            // modules: {
            //   'util': true,
            //   'fs': false,
            // }
            }),
            (0, rebuildPlugin_js_1.default)("web"),
            ...((config.webPlugins || []).map((p) => p(register, entryPoints)) || []),
        ] });
};
