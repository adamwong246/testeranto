"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./index.js"));
const inputFilesPlugin_js_1 = __importDefault(require("./inputFilesPlugin.js"));
const featuresPlugin_1 = __importDefault(require("./featuresPlugin"));
exports.default = (config, entryPoints) => {
    const { inputFilesPluginFactory, register } = (0, inputFilesPlugin_js_1.default)("node", entryPoints);
    return Object.assign(Object.assign({}, (0, index_js_1.default)(config)), { splitting: true, outdir: config.outdir + "/node", 
        // inject: [`./node_modules/testeranto/dist/cjs-shim.js`],
        metafile: true, supported: {
            "dynamic-import": true,
        }, define: {
            "process.env.FLUENTFFMPEG_COV": "0",
        }, absWorkingDir: process.cwd(), banner: {
            js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
        }, platform: "node", external: [
            // "testeranto.json",
            // "features.test.js",
            "react",
            // "events",
            // "ganache"
            ...config.externals,
        ], entryPoints: [...entryPoints], plugins: [
            featuresPlugin_1.default,
            ...(config.nodePlugins.map((p) => p(register, entryPoints)) || []),
            inputFilesPluginFactory,
            // inputFilesPlugin("node", entryPoints),
            {
                name: "rebuild-notify",
                setup(build) {
                    build.onEnd((result) => {
                        console.log(`> node build ended with ${result.errors.length} errors`);
                        if (result.errors.length > 0) {
                            console.log(result);
                        }
                        // console.log(result);
                        // result.errors.length !== 0 && process.exit(-1);
                    });
                },
            },
        ] });
};
