import { useState, useEffect } from "react";
import { useWebSocket } from "./App";
export const useGitMode = () => {
    const { isConnected } = useWebSocket();
    const [mode, setMode] = useState(isConnected ? "dev" : "static");
    useEffect(() => {
        // Auto-detect mode based on WebSocket connection
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
