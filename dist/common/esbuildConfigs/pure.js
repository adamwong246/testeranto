"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./index.js"));
const inputFilesPlugin_js_1 = __importDefault(require("./inputFilesPlugin.js"));
const featuresPlugin_js_1 = __importDefault(require("./featuresPlugin.js"));
exports.default = (config, entryPoints, testName) => {
    const { inputFilesPluginFactory, register } = (0, inputFilesPlugin_js_1.default)("pure", testName);
    return Object.assign(Object.assign({}, (0, index_js_1.default)(config)), { drop: ["console", "debugger"], splitting: true, outdir: `testeranto/bundles/pure/${testName}/`, 
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
            {
                name: "rebuild-notify",
                setup(build) {
                    build.onEnd((result) => {
                        console.log(`> pure build ended with ${result.errors.length} errors`);
                        if (result.errors.length > 0) {
                            console.log(result);
                        }
                        // console.log(result);
                        // result.errors.length !== 0 && process.exit(-1);
                    });
                },
            },
            ...((config.purePlugins || []).map((p) => p(register, entryPoints)) ||
                []),
        ] });
};
