"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
exports.default = (args, inputFilePath, watch, config) => {
    const htmlFileAndQueryParams = `file://${path_1.default.resolve(watch)}\?requesting='${encodeURIComponent(JSON.stringify({
        scheduled: true,
        name: inputFilePath,
        ports: [],
        fs: path_1.default.resolve(process.cwd(), config.outdir, "web", inputFilePath),
    }))}`;
    return {
        script: `chromium --allow-file-access-from-files --allow-file-access --allow-cross-origin-auth-prompt ${htmlFileAndQueryParams}' --load-extension=./node_modules/testeranto/dist/chromeExtension`,
        name: inputFilePath,
        autorestart: false,
        args,
        watch: [watch],
    };
};
