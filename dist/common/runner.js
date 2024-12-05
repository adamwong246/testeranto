"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destinationOfRuntime = void 0;
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
