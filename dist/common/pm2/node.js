"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
exports.default = (args, inputFilePath, config, watch) => {
    return {
        name: inputFilePath,
        script: `node ${config.debugger ? "--inspect-brk" : ""} ${watch} '${JSON.stringify({
            scheduled: true,
            name: inputFilePath,
            ports: [],
            fs: path_1.default.resolve(process.cwd(), config.outdir, "node", inputFilePath),
        })}'`,
        autorestart: false,
        watch: [watch],
        args
    };
};
