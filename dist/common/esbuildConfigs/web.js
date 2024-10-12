"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const index_js_1 = __importDefault(require("./index.js"));
exports.default = (config, entryPoints) => {
    return Object.assign(Object.assign({}, (0, index_js_1.default)(config)), { outdir: config.outdir + "/web", alias: {
            react: path_1.default.resolve("./node_modules/react")
        }, external: [
            "tests.test.js",
            "features.test.js",
            // "url", 
            // "react",
            "electron",
            "path",
            "fs",
            "stream",
        ], platform: "browser", entryPoints: [...entryPoints], plugins: [
            ...(config.webPlugins || []),
            {
                name: 'rebuild-notify',
                setup(build) {
                    build.onEnd(result => {
                        console.log(`web build ended with ${result.errors.length} errors`);
                        console.log(result);
                        result.errors.length !== 0 && process.exit(-1);
                    });
                }
            },
        ] });
};
