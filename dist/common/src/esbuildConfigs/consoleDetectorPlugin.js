"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleDetectorPlugin = void 0;
const fs_1 = __importDefault(require("fs"));
exports.consoleDetectorPlugin = {
    name: "console-detector",
    setup(build) {
        build.onLoad({ filter: /\.(js|ts)$/ }, async (args) => {
            const contents = await fs_1.default.promises.readFile(args.path, "utf8");
            const consolePattern = /console\.(log|error|warn|info|debug|trace|dir|dirxml|table|group|groupEnd|clear|count|countReset|assert|profile|profileEnd|time|timeLog|timeEnd|timeStamp|context|memory)/g;
            const matches = contents.match(consolePattern);
            if (matches) {
                const uniqueMethods = [...new Set(matches)];
                return {
                    warnings: uniqueMethods.map((method) => ({
                        text: `call of "${method}" was detected, which is not supported in the pure runtime.`,
                        // location: {
                        //   file: args.path,
                        //   line:
                        //     contents
                        //       .split("\n")
                        //       .findIndex((line) => line.includes(method)) + 1,
                        //   column: 0,
                        // },
                    })),
                };
            }
            return null;
        });
        build.onEnd((buildResult) => {
            if (buildResult.warnings.find((br) => br.pluginName === "console-detector"))
                console.warn(`Warning: An unsupported method call was detected in a source file used to build for the pure runtime. It is possible that this method call is in a comment block. If you really want to use this function, change this test to the "node" runtime.`);
        });
    },
};
