"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRunnables = void 0;
const path_1 = __importDefault(require("path"));
const getRunnables = (config, projectName) => {
    return {
        golangEntryPoints: Object.entries(config.golang.tests).reduce((pt, cv) => {
            pt[cv[0]] = path_1.default.resolve(cv[0]);
            return pt;
        }, {}),
        nodeEntryPoints: Object.entries(config.node.tests).reduce((pt, cv) => {
            pt[cv[0]] = path_1.default.resolve(`./testeranto/bundles/${projectName}/node/${cv[0]
                .split(".")
                .slice(0, -1)
                .concat("mjs")
                .join(".")}`);
            return pt;
        }, {}),
        pythonEntryPoints: Object.entries(config.python.tests).reduce((pt, cv) => {
            pt[cv[0]] = path_1.default.resolve(cv[0]);
            return pt;
        }, {}),
        webEntryPoints: Object.entries(config.web.tests).reduce((pt, cv) => {
            pt[cv[0]] = path_1.default.resolve(`./testeranto/bundles/${projectName}/web/${cv[0]
                .split(".")
                .slice(0, -1)
                .concat("mjs")
                .join(".")}`);
            return pt;
        }, {}),
    };
};
exports.getRunnables = getRunnables;
