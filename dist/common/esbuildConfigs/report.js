"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonc_1 = require("jsonc");
const fs_1 = __importDefault(require("fs"));
const jsonConfig = jsonc_1.jsonc.parse((await fs_1.default.readFileSync("./testeranto.json")).toString());
exports.default = (config) => {
    return {
        bundle: true,
        entryPoints: [
            "./node_modules/testeranto/dist/module/Report.js",
            jsonConfig.features
        ],
        minify: config.minify === true,
        outbase: config.outbase,
        outdir: jsonConfig.outdir,
        write: true,
        // outfile: `${config.outdir}/Report.js`,
        external: [
            "features.test.js",
            "testeranto.json"
        ]
    };
};
