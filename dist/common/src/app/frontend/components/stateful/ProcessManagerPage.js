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
exports.ProcessManagerPage = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const useWebSocket_1 = require("../../useWebSocket");
const ProcessManagerView_1 = require("../pure/ProcessManagerView");
// import { ProcessManagerView, Process } from '../pure/ProcessManagerView';
// import { useWebSocket } from '../../App';
const ProcessManagerPage = () => {
    const [processes, setProcesses] = (0, react_1.useState)([]);
    const { ws } = (0, useWebSocket_1.useWebSocket)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const navigate = (0, react_router_dom_1.useNavigate)();
    // Handle WebSocket messages
    (0, react_1.useEffect)(() => {
        if (!ws)
            return;
        const handleMessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'runningProcesses') {
                    // Processes should come with their full logs
                    setProcesses(data.processes.map((p) => (Object.assign(Object.assign({}, p), { status: p.status || 'running', logs: p.logs || [] }))));
                    setLoading(false);
                }
                else if (data.type === 'processStarted') {
                    setProcesses(prev => [...prev, Object.assign(Object.assign({}, data), { status: 'running', logs: data.logs || [] })]);
                }
                else if (data.type === 'processExited') {
                    setProcesses(prev => prev.map(p => p.processId === data.processId
                        ? Object.assign(Object.assign({}, p), { status: 'exited', exitCode: data.exitCode }) : p));
                }
                else if (data.type === 'processError') {
                    setProcesses(prev => prev.map(p => p.processId === data.processId
                        ? Object.assign(Object.assign({}, p), { status: 'error', error: data.error }) : p));
                }
                else if (data.type === 'processStdout' || data.type === 'processStderr') {
                    setProcesses(prev => prev.map(p => p.processId === data.processId
                        ? Object.assign(Object.assign({}, p), { logs: [...(p.logs || []), data.data] }) : p));
                }
            }
            catch (error) {
                console.error('Error parsing process message:', error);
                setLoading(false);
            }
        };
        ws.addEventListener('message', handleMessage);
        // Request current processes when connected
        if (ws.readyState === WebSocket.OPEN) {
            setLoading(true);
            ws.send(JSON.stringify({ type: 'getRunningProcesses' }));
        }
        return () => {
            ws.removeEventListener('message', handleMessage);
        };
    }, [ws]);
    const handleRefresh = (0, react_1.useCallback)(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            setLoading(true);
            ws.send(JSON.stringify({ type: 'getRunningProcesses' }));
        }
    }, [ws]);
    const handleKillProcess = (0, react_1.useCallback)((processId) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'killProcess',
                processId
            }));
        }
    }, [ws]);
    const handleBack = (0, react_1.useCallback)(() => {
        navigate('/');
    }, [navigate]);
    return (
    // don't put this in AppFrame- this is correct
    react_1.default.createElement(ProcessManagerView_1.ProcessManagerView, { processes: processes, onRefresh: handleRefresh, onBack: handleBack, loading: loading, onKillProcess: handleKillProcess }));
};
exports.ProcessManagerPage = ProcessManagerPage;
