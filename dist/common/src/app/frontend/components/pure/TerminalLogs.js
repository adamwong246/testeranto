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
exports.TerminalLogs = void 0;
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const TerminalLogs = ({ logs }) => {
    const [autoScroll, setAutoScroll] = (0, react_1.useState)(true);
    const logsContainerRef = (0, react_1.useRef)(null);
    // Auto-scroll to bottom when new logs arrive and autoScroll is enabled
    (0, react_1.useEffect)(() => {
        if (autoScroll && logsContainerRef.current) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
    }, [logs, autoScroll]);
    // Handle scroll events to determine if we should auto-scroll
    const handleLogsScroll = (0, react_1.useCallback)(() => {
        if (logsContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
            const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;
            setAutoScroll(isAtBottom);
        }
    }, []);
    const handleScrollToBottom = (0, react_1.useCallback)(() => {
        setAutoScroll(true);
        if (logsContainerRef.current) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
    }, []);
    return (react_1.default.createElement("div", { ref: logsContainerRef, className: "bg-dark text-light flex-grow-1", style: {
            overflowY: "auto",
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: "14px",
            lineHeight: "1.4",
            padding: "0.5rem"
        }, onScroll: handleLogsScroll },
        logs.length > 0 ? (react_1.default.createElement("pre", { className: "mb-0", style: {
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                backgroundColor: "transparent",
                border: "none",
                color: "inherit",
            } }, logs.join(""))) : (react_1.default.createElement("div", { className: "text-muted text-center py-4" },
            react_1.default.createElement("i", null, "No output yet"))),
        !autoScroll && (react_1.default.createElement("div", { className: "position-sticky bottom-0 d-flex justify-content-center mb-2" },
            react_1.default.createElement(react_bootstrap_1.Button, { variant: "primary", size: "sm", onClick: handleScrollToBottom }, "Scroll to Bottom")))));
};
exports.TerminalLogs = TerminalLogs;
