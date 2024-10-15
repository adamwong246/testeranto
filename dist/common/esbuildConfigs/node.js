"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./index.js"));
const jsonc_1 = require("jsonc");
const fs_1 = __importDefault(require("fs"));
const jsonConfig = jsonc_1.jsonc.parse((await fs_1.default.readFileSync("./testeranto.json")).toString());
exports.default = (config, entryPoints) => {
    return Object.assign(Object.assign({}, (0, index_js_1.default)(config)), { outdir: jsonConfig.outdir + "/node", inject: [`./node_modules/testeranto/dist/cjs-shim.js`], supported: {
            "dynamic-import": true
        }, define: {
            "process.env.FLUENTFFMPEG_COV": "0"
        }, absWorkingDir: process.cwd(), banner: {
        // js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
        }, platform: "node", external: [
            "testeranto.json",
            "features.test.js",
            "react",
            "events",
            // "ganache"
            ...config.externals
        ], entryPoints: [...entryPoints], plugins: [
            ...(config.nodePlugins || []),
            {
                name: 'rebuild-notify',
                setup(build) {
                    build.onEnd(result => {
                        console.log(`node build ended with ${result.errors.length} errors`);
                        console.log(result);
                        result.errors.length !== 0 && process.exit(-1);
                    });
                }
            },
        ] });
};
