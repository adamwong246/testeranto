import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProcessManagerView } from '../pure/ProcessManagerView';
import { useWebSocket } from '../../App';
export const ProcessManagerPage = () => {
    const [processes, setProcesses] = useState([]);
    const { ws } = useWebSocket();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    // Handle WebSocket messages
    useEffect(() => {
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
    const handleRefresh = useCallback(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            setLoading(true);
            ws.send(JSON.stringify({ type: 'getRunningProcesses' }));
        }
    }, [ws]);
    const handleKillProcess = useCallback((processId) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'killProcess',
                processId
            }));
        }
    }, [ws]);
    const handleBack = useCallback(() => {
        navigate('/');
    }, [navigate]);
    return (
    // don't put this in AppFrame- this is correct
    React.createElement(ProcessManagerView, { processes: processes, onRefresh: handleRefresh, onBack: handleBack, loading: loading, onKillProcess: handleKillProcess }));
};
