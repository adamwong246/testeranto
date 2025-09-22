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
exports.ProcessManagerView = void 0;
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const ProcessList_1 = require("./ProcessList");
const ProcessDetails_1 = require("./ProcessDetails");
const ProcessTerminal_1 = require("./ProcessTerminal");
const App_1 = require("../../App");
const ProcessManagerView = ({ processes, onRefresh, onBack, loading, onKillProcess, }) => {
    const [selectedProcess, setSelectedProcess] = (0, react_1.useState)(null);
    const { ws } = (0, App_1.useWebSocket)();
    // Handle process selection
    const handleSelectProcess = (0, react_1.useCallback)((process) => {
        setSelectedProcess(process);
    }, []);
    // Request process data when selected
    (0, react_1.useEffect)(() => {
        if (selectedProcess && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: "getProcess",
                processId: selectedProcess.processId,
            }));
        }
    }, [selectedProcess, ws]);
    return (react_1.default.createElement(react_bootstrap_1.Container, { fluid: true, className: "px-0 h-100" },
        react_1.default.createElement(react_bootstrap_1.Row, { className: "g-0", style: { height: "calc(100vh - 56px)" } },
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 2, className: "border-end", style: {
                    height: "100%",
                    overflow: "auto",
                    backgroundColor: "#f8f9fa",
                } },
                react_1.default.createElement(ProcessList_1.ProcessList, { processes: processes, selectedProcess: selectedProcess, onSelectProcess: handleSelectProcess, loading: loading })),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 5, className: "border-end p-3 d-flex flex-column", style: {
                    height: "100%",
                    overflow: "hidden"
                } },
                react_1.default.createElement(ProcessDetails_1.ProcessDetails, { selectedProcess: selectedProcess, onKillProcess: onKillProcess })),
            react_1.default.createElement(react_bootstrap_1.Col, { sm: 5, className: "p-3 d-flex flex-column", style: {
                    height: "100%",
                    overflow: "hidden"
                } },
                react_1.default.createElement(ProcessTerminal_1.ProcessTerminal, { selectedProcess: selectedProcess, ws: ws })))));
};
exports.ProcessManagerView = ProcessManagerView;
