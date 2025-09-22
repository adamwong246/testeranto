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
exports.ProcessTerminal = void 0;
const react_1 = __importStar(require("react"));
const useTerminalWebSocket_1 = require("../../useTerminalWebSocket");
const TerminalLogs_1 = require("./TerminalLogs");
const TerminalInput_1 = require("./TerminalInput");
const ProcessTerminal = ({ selectedProcess, ws, }) => {
    const { processLogs } = (0, useTerminalWebSocket_1.useTerminalWebSocket)(ws, selectedProcess);
    const handleInput = (0, react_1.useCallback)((data) => {
        if (ws &&
            ws.readyState === WebSocket.OPEN &&
            (selectedProcess === null || selectedProcess === void 0 ? void 0 : selectedProcess.status) === "running") {
            ws.send(JSON.stringify({
                type: "stdin",
                processId: selectedProcess.processId,
                data: data,
            }));
        }
    }, [ws, selectedProcess]);
    if (!selectedProcess) {
        return (react_1.default.createElement("div", { className: "text-center text-muted mt-5" },
            react_1.default.createElement("i", null, "Terminal will appear here when a process is selected")));
    }
    return (react_1.default.createElement("div", { className: "flex-grow-1 d-flex flex-column", style: { minHeight: 0 } },
        react_1.default.createElement(TerminalLogs_1.TerminalLogs, { logs: processLogs }),
        selectedProcess.status === "running" && (react_1.default.createElement(TerminalInput_1.TerminalInput, { onInput: handleInput }))));
};
exports.ProcessTerminal = ProcessTerminal;
