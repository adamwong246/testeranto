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
exports.ProcessLogs = void 0;
const react_1 = __importStar(require("react"));
const ProcessLogs = ({ logs }) => {
    const logsEndRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        var _a;
        // Auto-scroll to bottom when logs update
        (_a = logsEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);
    return (react_1.default.createElement("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } },
        react_1.default.createElement("div", { className: "d-flex justify-content-between align-items-center p-3 border-bottom bg-white", style: { flexShrink: 0 } },
            react_1.default.createElement("small", { className: "text-muted" },
                (logs === null || logs === void 0 ? void 0 : logs.length) || 0,
                " lines")),
        react_1.default.createElement("div", { className: "bg-dark text-light flex-grow-1", style: {
                overflowY: 'auto',
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '14px',
                lineHeight: '1.4',
                padding: '1rem'
            } },
            logs && logs.length > 0 ? (react_1.default.createElement("pre", { className: "mb-0", style: {
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'inherit'
                } }, logs.join(''))) : (react_1.default.createElement("div", { className: "text-muted text-center py-4" },
                react_1.default.createElement("i", null, "No output yet"))),
            react_1.default.createElement("div", { ref: logsEndRef }))));
};
exports.ProcessLogs = ProcessLogs;
