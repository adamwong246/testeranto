"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogFilesForRuntime = exports.PURE_LOG_FILES = exports.WEB_LOG_FILES = exports.NODE_LOG_FILES = void 0;
exports.NODE_LOG_FILES = ["stdout.log", "stderr.log", "exit.log"];
exports.WEB_LOG_FILES = [
    "info.log",
    "debug.log",
    "error.log",
    "warn.log",
    "exit.log",
];
exports.PURE_LOG_FILES = ["exit.log"];
const getLogFilesForRuntime = (runtime) => {
    switch (runtime) {
        case "node":
            return exports.NODE_LOG_FILES;
        case "web":
            return exports.WEB_LOG_FILES;
        case "pure":
            return exports.PURE_LOG_FILES;
        default:
            throw new Error(`Unknown runtime: ${runtime}`);
    }
};
exports.getLogFilesForRuntime = getLogFilesForRuntime;
