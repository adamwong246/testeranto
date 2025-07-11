"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRunnables = exports.promptPather = exports.bddPather = exports.lintPather = exports.tscPather = exports.destinationOfRuntime = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const path_1 = __importDefault(require("path"));
const destinationOfRuntime = (f, r, configs) => {
    return path_1.default
        .normalize(`${configs.buildDir}/${r}/${f}`)
        .split(".")
        .slice(0, -1)
        .join(".");
};
exports.destinationOfRuntime = destinationOfRuntime;
const tscPather = (entryPoint, platform, projectName) => {
    return path_1.default.join("testeranto", "reports", projectName, entryPoint.split(".").slice(0, -1).join("."), platform, `type_errors.txt`);
};
exports.tscPather = tscPather;
const lintPather = (entryPoint, platform, projectName) => {
    return path_1.default.join("testeranto", "reports", projectName, entryPoint.split(".").slice(0, -1).join("."), platform, `lint_errors.json`);
};
exports.lintPather = lintPather;
const bddPather = (entryPoint, platform, projectName) => {
    return path_1.default.join("testeranto", "reports", projectName, entryPoint.split(".").slice(0, -1).join("."), platform, `tests.json`);
};
exports.bddPather = bddPather;
const promptPather = (entryPoint, platform, projectName) => {
    return path_1.default.join("testeranto", "reports", projectName, entryPoint.split(".").slice(0, -1).join("."), platform, `prompt.txt`);
};
exports.promptPather = promptPather;
const getRunnables = (tests, projectName, payload = {
    nodeEntryPoints: {},
    nodeEntryPointSidecars: {},
    webEntryPoints: {},
    webEntryPointSidecars: {},
    pureEntryPoints: {},
    pureEntryPointSidecars: {},
}) => {
    return tests.reduce((pt, cv, cndx, cry) => {
        if (cv[1] === "node") {
            pt.nodeEntryPoints[cv[0]] = path_1.default.resolve(`./testeranto/bundles/node/${projectName}/${cv[0]
                .split(".")
                .slice(0, -1)
                .concat("mjs")
                .join(".")}`);
        }
        else if (cv[1] === "web") {
            pt.webEntryPoints[cv[0]] = path_1.default.resolve(`./testeranto/bundles/web/${projectName}/${cv[0]
                .split(".")
                .slice(0, -1)
                .concat("mjs")
                .join(".")}`);
        }
        else if (cv[1] === "pure") {
            pt.pureEntryPoints[cv[0]] = path_1.default.resolve(`./testeranto/bundles/pure/${projectName}/${cv[0]
                .split(".")
                .slice(0, -1)
                .concat("mjs")
                .join(".")}`);
        }
        //////////////////////////////////////////////////////////
        cv[3]
            .filter((t) => t[1] === "node")
            .forEach((t) => {
            pt.nodeEntryPointSidecars[`${t[0]}`] = path_1.default.resolve(`./testeranto/bundles/node/${projectName}/${cv[0]
                .split(".")
                .slice(0, -1)
                .concat("mjs")
                .join(".")}`);
        });
        cv[3]
            .filter((t) => t[1] === "web")
            .forEach((t) => {
            pt.webEntryPointSidecars[`${t[0]}`] = path_1.default.resolve(`./testeranto/bundles/web/${projectName}/${cv[0]
                .split(".")
                .slice(0, -1)
                .concat("mjs")
                .join(".")}`);
        });
        cv[3]
            .filter((t) => t[1] === "pure")
            .forEach((t) => {
            pt.pureEntryPointSidecars[`${t[0]}`] = path_1.default.resolve(`./testeranto/bundles/pure/${projectName}/${cv[0]
                .split(".")
                .slice(0, -1)
                .concat("mjs")
                .join(".")}`);
        });
        return pt;
    }, payload);
};
exports.getRunnables = getRunnables;
