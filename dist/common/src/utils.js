"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptPather = exports.bddExitCodePather = exports.bddPather = exports.lintExitCodePather = exports.lintPather = exports.tscExitCodePather = exports.tscPather = exports.destinationOfRuntime = void 0;
// import { configs } from "eslint-plugin-react";
const path_1 = __importDefault(require("path"));
const destinationOfRuntime = (f, r, configs) => {
    return path_1.default
        .normalize(`${configs.buildDir}/${r}/${f}`)
        .split(".")
        .slice(0, -1)
        .join(".");
};
exports.destinationOfRuntime = destinationOfRuntime;
const tscPather = (entryPoint, platform) => {
    return path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `type_errors.txt`);
};
exports.tscPather = tscPather;
const tscExitCodePather = (entryPoint, platform) => {
    return path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `type_errors.exitcode`);
};
exports.tscExitCodePather = tscExitCodePather;
const lintPather = (entryPoint, platform) => {
    return path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `lint_errors.json`);
};
exports.lintPather = lintPather;
const lintExitCodePather = (entryPoint, platform) => {
    return path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `lint_errors.exitcode`);
};
exports.lintExitCodePather = lintExitCodePather;
const bddPather = (entryPoint, platform) => {
    return path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `tests.json`);
};
exports.bddPather = bddPather;
const bddExitCodePather = (entryPoint, platform) => {
    return path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `exitcode`);
};
exports.bddExitCodePather = bddExitCodePather;
const promptPather = (entryPoint, platform) => {
    return path_1.default.join("./docs/", platform, entryPoint.split(".").slice(0, -1).join("."), `prompt.txt`);
};
exports.promptPather = promptPather;
