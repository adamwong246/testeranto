"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
exports.default = (args, inputFilePath, config) => {
    const fileAsList = inputFilePath.split("/");
    const fileListHead = fileAsList.slice(0, -1);
    const fname = fileAsList[fileAsList.length - 1];
    const fnameOnly = fname.split(".").slice(0, -1).join(".");
    const htmlFile = [config.outdir, "web", ...fileListHead, `${fnameOnly}.html`].join("/");
    const jsFile = path_1.default.resolve(htmlFile.split(".html")[0] + ".mjs");
    return {
        // script: `xvfb-maybe yarn electron node_modules/testeranto/dist/common/electron.js ${htmlFile} '${JSON.stringify(
        script: `yarn electron node_modules/testeranto/dist/common/electron.js ${htmlFile} '${JSON.stringify({
            scheduled: true,
            name: inputFilePath,
            ports: [],
            fs: path_1.default.resolve(process.cwd(), config.outdir, inputFilePath),
        })}'`,
        name: inputFilePath,
        autorestart: false,
        args,
        watch: [jsFile],
    };
};
