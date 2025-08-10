export const NODE_LOG_FILES = ["stdout.log", "stderr.log", "exit.log"];
export const WEB_LOG_FILES = [
    "info.log",
    "debug.log",
    "error.log",
    "warn.log",
    "exit.log",
];
export const PURE_LOG_FILES = ["exit.log"];
export const getLogFilesForRuntime = (runtime) => {
    switch (runtime) {
        case "node":
            return NODE_LOG_FILES;
        case "web":
            return WEB_LOG_FILES;
        case "pure":
            return PURE_LOG_FILES;
        default:
            throw new Error(`Unknown runtime: ${runtime}`);
    }
};
