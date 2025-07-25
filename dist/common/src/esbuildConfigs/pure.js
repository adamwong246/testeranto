"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./index.js"));
const inputFilesPlugin_js_1 = __importDefault(require("./inputFilesPlugin.js"));
const featuresPlugin_js_1 = __importDefault(require("./featuresPlugin.js"));
const node_module_1 = require("node:module");
const consoleDetectorPlugin_js_1 = require("./consoleDetectorPlugin.js");
const rebuildPlugin_js_1 = __importDefault(require("./rebuildPlugin.js"));
exports.default = (config, entryPoints, testName) => {
    const { inputFilesPluginFactory, register } = (0, inputFilesPlugin_js_1.default)("pure", testName);
    return Object.assign(Object.assign({}, (0, index_js_1.default)(config)), { drop: [], splitting: true, outdir: `testeranto/bundles/pure/${testName}/`, 
        // inject: [`./node_modules/testeranto/dist/cjs-shim.js`],
        metafile: true, supported: {
            "dynamic-import": true,
        }, define: {
            "process.env.FLUENTFFMPEG_COV": "0",
        }, absWorkingDir: process.cwd(), banner: {
            js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
        }, platform: "node", external: ["react", ...config.externals], entryPoints: [...entryPoints], plugins: [
            featuresPlugin_js_1.default,
            inputFilesPluginFactory,
            consoleDetectorPlugin_js_1.consoleDetectorPlugin,
            // nativeImportDetectorPlugin,
            {
                name: "native-node-import-filter",
                setup(build) {
                    build.onResolve({ filter: /fs/ }, (args) => {
                        if ((0, node_module_1.isBuiltin)(args.path)) {
                            throw new Error(`You attempted to import a node module "${args.path}" into a "pure" test, which is not allowed. If you really want to use this package, convert this test from "pure" to "node"`);
                        }
                        return { path: args.path };
                    });
                },
            },
            (0, rebuildPlugin_js_1.default)("pure"),
            ...((config.nodePlugins || []).map((p) => p(register, entryPoints)) ||
                []),
        ] });
};
