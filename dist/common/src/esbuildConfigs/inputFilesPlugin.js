"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const otherInputs = {};
const register = (entrypoint, sources) => {
    if (!otherInputs[entrypoint]) {
        otherInputs[entrypoint] = new Set();
    }
    sources.forEach((s) => otherInputs[entrypoint].add(s));
};
exports.default = (platform, entryPoints) => {
    return {
        register,
        inputFilesPluginFactory: {
            name: "metafileWriter",
            setup(build) {
                build.onEnd((result) => {
                    // console.log("build.onEnd", entryPoints);
                    fs_1.default.writeFileSync(`docs/${platform}/metafile.json`, JSON.stringify(result, null, 2));
                });
            },
        },
    };
};
