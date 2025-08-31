"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleProcessPage = void 0;
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const SingleProcessView_1 = require("../pure/SingleProcessView");
const App_1 = require("../../App");
const SingleProcessPage = () => {
    const [process, setProcess] = (0, react_1.useState)(null);
    const ws = (0, App_1.useWebSocket)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { processId } = (0, react_router_dom_1.useParams)();
    // Handle WebSocket messages
    (0, react_1.useEffect)(() => {
        if (!ws)
            return;
        // Set a timeout to handle cases where we don't get a response
        const timeoutId = setTimeout(() => {
            if (loading) {
                setLoading(false);
                // If we're still loading after 3 seconds, show an error
                setProcess(null);
            }
        }, 3000);
        const handleMessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Handle process data response - this should include all captured logs
                if (data.type === "processData" && data.processId === processId) {
                    setProcess({
                        processId: data.processId,
                        command: data.command,
                        pid: data.pid,
                        timestamp: data.timestamp,
                        status: data.status || "running",
                        exitCode: data.exitCode,
                        error: data.error,
                        // Use the logs sent from the server, which should include all captured logs
                        logs: data.logs || [],
                    });
                    setLoading(false);
                    clearTimeout(timeoutId);
                }
                // Handle new log messages that come after the initial data
                else if ((data.type === "processStdout" || data.type === "processStderr") &&
                    data.processId === processId) {
                    setProcess((prev) => prev
                        ? Object.assign(Object.assign({}, prev), { logs: [...(prev.logs || []), data.data] }) : null);
                }
                // Handle process completion
                else if ((data.type === "processExited" || data.type === "processError") &&
                    data.processId === processId) {
                    setProcess((prev) => prev
                        ? Object.assign(Object.assign({}, prev), { status: data.type === "processExited" ? "exited" : "error", exitCode: data.exitCode, error: data.error }) : null);
                }
            }
            catch (error) {
                console.error("Error parsing process message:", error);
                setLoading(false);
                setProcess(null);
                clearTimeout(timeoutId);
            }
        };
        ws.addEventListener("message", handleMessage);
        // Request specific process when connected
        if (ws.readyState === WebSocket.OPEN && processId) {
            setLoading(true);
            ws.send(JSON.stringify({
                type: "getProcess",
                processId,
            }));
        }
        return () => {
            ws.removeEventListener("message", handleMessage);
            clearTimeout(timeoutId);
        };
    }, [ws, processId]);
    // Try to find the process in the global state if WebSocket doesn't respond
    (0, react_1.useEffect)(() => {
        // This is a fallback - in a real implementation, you'd want to get this from a global state
        // or through some other means
    }, []);
    const handleBack = (0, react_1.useCallback)(() => {
        navigate("/processes");
    }, [navigate]);
    const handleKillProcess = (0, react_1.useCallback)((processId) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            console.log("Sending killProcess for:", processId);
            ws.send(JSON.stringify({
                type: "killProcess",
                processId,
            }));
        }
        else {
            console.log("Cannot send killProcess - WebSocket not ready:", {
                wsExists: !!ws,
                wsReady: ws === null || ws === void 0 ? void 0 : ws.readyState,
            });
        }
    }, [ws]);
    return (react_1.default.createElement(SingleProcessView_1.SingleProcessView, { process: process, onBack: handleBack, loading: loading, onKillProcess: handleKillProcess, ws: ws }));
};
exports.SingleProcessPage = SingleProcessPage;
