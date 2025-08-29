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
    return path_1.default.join("testeranto", "reports", projectName, entryPoint.split(".").slice(0, -1).join("."), platform, `lint_errors.txt`);
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
    pythonEntryPoints: {},
    nodeEntryPoints: {},
    nodeEntryPointSidecars: {},
    webEntryPoints: {},
    webEntryPointSidecars: {},
    pureEntryPoints: {},
    pureEntryPointSidecars: {},
    golangEntryPoints: {},
    golangEntryPointSidecars: {},
    pitonoEntryPoints: {},
    pitonoEntryPointSidecars: {},
}) => {
    // Ensure all properties are properly initialized
    const initializedPayload = {
        pythonEntryPoints: payload.pythonEntryPoints || {},
        nodeEntryPoints: payload.nodeEntryPoints || {},
        nodeEntryPointSidecars: payload.nodeEntryPointSidecars || {},
        webEntryPoints: payload.webEntryPoints || {},
        webEntryPointSidecars: payload.webEntryPointSidecars || {},
        pureEntryPoints: payload.pureEntryPoints || {},
        pureEntryPointSidecars: payload.pureEntryPointSidecars || {},
        golangEntryPoints: payload.golangEntryPoints || {},
        golangEntryPointSidecars: payload.golangEntryPointSidecars || {},
        pitonoEntryPoints: payload.pitonoEntryPoints || {},
        pitonoEntryPointSidecars: payload.pitonoEntryPointSidecars || {},
    };
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
        else if (cv[1] === "golang") {
            // For Go files, we'll use the original path since they're not compiled to JS
            pt.golangEntryPoints[cv[0]] = path_1.default.resolve(cv[0]);
        }
        else if (cv[1] === "pitono") {
            // For pitono files, use the original Python file path
            pt.pitonoEntryPoints[cv[0]] = path_1.default.resolve(cv[0]);
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
        cv[3]
            .filter((t) => t[1] === "golang")
            .forEach((t) => {
            // For Go sidecars, use the original path
            pt.golangEntryPointSidecars[`${t[0]}`] = path_1.default.resolve(t[0]);
        });
        cv[3]
            .filter((t) => t[1] === "pitono")
            .forEach((t) => {
            // For pitono sidecars, use the original Python file path
            pt.pitonoEntryPointSidecars[`${t[0]}`] = path_1.default.resolve(t[0]);
        });
        return pt;
    }, initializedPayload);
};
exports.getRunnables = getRunnables;
