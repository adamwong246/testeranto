"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonc_1 = require("jsonc");
const fs_1 = __importDefault(require("fs"));
// import { CssModulesPlugin } from 'esbuild-css-modules-plugin';
const jsonConfig = jsonc_1.jsonc.parse((await fs_1.default.readFileSync("./testeranto.json")).toString());
exports.default = (config) => {
    return {
        bundle: true,
        entryPoints: ["./node_modules/testeranto/dist/module/report.js"],
        minify: config.minify === true,
        outbase: config.outbase,
        write: true,
        outfile: `${jsonConfig.outdir}/report.js`,
        external: ["tests.json", "features.test.js"],
        // plugins: [
        //   CssModulesPlugin({
        //     // @see https://github.com/indooorsman/esbuild-css-modules-plugin/blob/main/index.d.ts for more details
        //     force: true,
        //     emitDeclarationFile: true,
        //     localsConvention: 'camelCaseOnly',
        //     namedExports: true,
        //     inject: false
        //   })
        // ]
    };
    // return {
    //   bundle: true,
    //   entryPoints: [
    //     "./node_modules/testeranto/dist/module/Report.js",
    //     jsonConfig.features
    //   ],
    //   minify: config.minify === true,
    //   outbase: ".",
    //   outdir: 'docs',
    //   write: true,
    //   // outfile: `${jsonConfig.outdir}/Report.js`,
    //   external: [
    //     "features.test.js",
    //     "testeranto.json"
    //   ]
    // }
};
