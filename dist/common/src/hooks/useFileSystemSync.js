"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFileSystemSync = void 0;
const react_1 = require("react");
const App_1 = require("../App");
const useFileSystemSync = (initialPath = "/") => {
    const [fileSystem, setFileSystem] = (0, react_1.useState)({
        files: {},
        fileContents: {},
    });
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const wsContext = (0, App_1.useWebSocket)();
    const ws = wsContext === null || wsContext === void 0 ? void 0 : wsContext.ws;
    const listDirectory = (0, react_1.useCallback)(async (project) => {
        setLoading(true);
        setError(null);
        try {
            // Use the project tree endpoint which is mentioned in the comments
            const response = await fetch(`/api/projects/tree?project=${encodeURIComponent(project)}`);
            if (response.ok) {
                const data = await response.json();
                // The API should return { sourceFiles: [...] }
                const items = data.sourceFiles || data;
                setFileSystem((prev) => (Object.assign(Object.assign({}, prev), { files: Object.assign(Object.assign({}, prev.files), { [project]: items }) })));
                setLoading(false);
                return items;
            }
            else {
                throw new Error(`Failed to list directory: ${response.status}`);
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("Error listing directory:", error);
            setError(errorMessage);
            setLoading(false);
            throw error; // Re-throw to let the caller handle it
        }
    }, []);
    const readFile = (0, react_1.useCallback)(async (path) => {
        try {
            // We need to know which project this file belongs to
            // For now, we'll just use the path directly
            const response = await fetch(`/api/files/read?path=${encodeURIComponent(path)}`);
            if (response.ok) {
                const content = await response.text();
                setFileSystem((prev) => (Object.assign(Object.assign({}, prev), { fileContents: Object.assign(Object.assign({}, prev.fileContents), { [path]: content }) })));
                return content;
            }
        }
        catch (error) {
            console.error("Error reading file:", error);
        }
        return "";
    }, []);
    (0, react_1.useEffect)(() => {
        if (!ws)
            return;
        const handleMessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "fileChanged") {
                    setFileSystem((prev) => (Object.assign(Object.assign({}, prev), { fileContents: Object.assign(Object.assign({}, prev.fileContents), { [data.path]: data.content }) })));
                }
            }
            catch (error) {
                console.error("Error processing WebSocket message:", error);
            }
        };
        ws.addEventListener("message", handleMessage);
        return () => ws.removeEventListener("message", handleMessage);
    }, [ws]);
    return {
        fileSystem,
        listDirectory,
        readFile,
        refresh: () => listDirectory(initialPath),
    };
};
exports.useFileSystemSync = useFileSystemSync;
