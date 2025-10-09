"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGitMode = void 0;
const react_1 = require("react");
const useWebSocket_1 = require("./useWebSocket");
const useGitMode = () => {
    const { isConnected } = (0, useWebSocket_1.useWebSocket)();
    const [mode, setMode] = (0, react_1.useState)(isConnected ? "dev" : "static");
    (0, react_1.useEffect)(() => {
        setMode(isConnected ? "dev" : "static");
    }, [isConnected]);
    return {
        mode,
        setMode,
        isStatic: mode === "static",
        isDev: mode === "dev",
        isGit: mode === "git",
    };
};
exports.useGitMode = useGitMode;
