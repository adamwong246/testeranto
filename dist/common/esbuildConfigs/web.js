"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const index_js_1 = __importDefault(require("./index.js"));
const inputFilesPlugin_js_1 = __importDefault(require("./inputFilesPlugin.js"));
const featuresPlugin_js_1 = __importDefault(require("./featuresPlugin.js"));
exports.default = (config, entryPoints) => {
    const { inputFilesPluginFactory, register } = (0, inputFilesPlugin_js_1.default)("web", entryPoints);
    return Object.assign(Object.assign({}, (0, index_js_1.default)(config)), { outdir: config.outdir + "/web", alias: {
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
            {
                name: "rebuild-notify",
                setup(build) {
                    build.onEnd((result) => {
                        console.log(`> web build ended with ${result.errors.length} errors`);
                        if (result.errors.length > 0) {
                            console.log(result);
                        }
                        // console.log(result);
                        // result.errors.length !== 0 && process.exit(-1);
                    });
                },
            },
            ...(config.nodePlugins.map((p) => p(register, entryPoints)) || []),
        ] });
};
