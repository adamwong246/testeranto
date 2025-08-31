"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./index.js"));
const inputFilesPlugin_js_1 = __importDefault(require("./inputFilesPlugin.js"));
const featuresPlugin_1 = __importDefault(require("./featuresPlugin"));
const rebuildPlugin_js_1 = __importDefault(require("./rebuildPlugin.js"));
exports.default = (config, entryPoints, testName) => {
    const { inputFilesPluginFactory, register } = (0, inputFilesPlugin_js_1.default)("node", testName);
    return Object.assign(Object.assign({}, (0, index_js_1.default)(config)), { splitting: true, outdir: `testeranto/bundles/node/${testName}/`, inject: [`./node_modules/testeranto/dist/cjs-shim.js`], metafile: true, supported: {
            "dynamic-import": true,
        }, define: {
            "process.env.FLUENTFFMPEG_COV": "0",
        }, absWorkingDir: process.cwd(), banner: {
            js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
        }, platform: "node", external: ["react", ...config.externals], entryPoints: [...entryPoints], plugins: [
            featuresPlugin_1.default,
            inputFilesPluginFactory,
            (0, rebuildPlugin_js_1.default)("node"),
            ...(config.nodePlugins.map((p) => p(register, entryPoints)) || []),
        ] });
};
