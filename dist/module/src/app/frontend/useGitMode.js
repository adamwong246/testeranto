import { useState, useEffect } from "react";
import { useWebSocket } from "./useWebSocket";
export const useGitMode = () => {
    const { isConnected } = useWebSocket();
    const [mode, setMode] = useState(isConnected ? "dev" : "static");
    useEffect(() => {
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
