import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProcessManagerView } from '../pure/ProcessManagerView';
export const ProcessManagerPage = () => {
    const [processes, setProcesses] = useState([]);
    const [ws, setWs] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    // Connect to WebSocket
    useEffect(() => {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}`;
        const websocket = new WebSocket(wsUrl);
        setWs(websocket);
        // Request current processes when connected
        websocket.onopen = () => {
            setLoading(true);
            websocket.send(JSON.stringify({ type: 'getRunningProcesses' }));
        };
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
        websocket.addEventListener('message', handleMessage);
        return () => {
            websocket.removeEventListener('message', handleMessage);
            websocket.close();
        };
    }, []);
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
