"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.default = (platform, entryPoints) => {
    console.log("mark3", platform);
    return {
        name: "metafileWriter",
        setup(build) {
            build.onEnd((result) => {
                if (result.errors.length === 0) {
                    entryPoints.forEach((entryPoint) => {
                        console.log("mark1", entryPoint);
                        const filePath = path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `inputFiles.json`);
                        const dirName = path_1.default.dirname(filePath);
                        if (!fs_1.default.existsSync(dirName)) {
                            fs_1.default.mkdirSync(dirName, { recursive: true });
                        }
                        const jsonContent = JSON.stringify(Object.keys(Object.keys(result.metafile.outputs)
                            .filter((s) => {
                            if (!result.metafile.outputs[s].entryPoint) {
                                return false;
                            }
                            return (path_1.default.resolve(result.metafile.outputs[s].entryPoint) ===
                                path_1.default.resolve(entryPoint));
                        })
                            .reduce((mm, el) => {
                            mm.push(result.metafile.outputs[el].inputs);
                            return mm;
                        }, [])[0])
                            .filter((f) => {
                            const regex = /^src\/.*/g;
                            const matches = f.match(regex);
                            const passes = (matches === null || matches === void 0 ? void 0 : matches.length) === 1;
                            return passes;
                        })
                            .filter((f) => {
                            const regex = /.*\.test\..*/g;
                            const matches = f.match(regex);
                            const passes = (matches === null || matches === void 0 ? void 0 : matches.length) === 1;
                            return !passes;
                        }));
                        console.log("mark2", jsonContent);
                        fs_1.default.writeFileSync(filePath, jsonContent);
                    });
                }
            });
        },
    };
};
