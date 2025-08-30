import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProcessManagerView, Process } from '../pure/ProcessManagerView';
import { useWebSocket } from '../../App';

export const ProcessManagerPage: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const ws = useWebSocket();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle WebSocket messages
  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'runningProcesses') {
          // Processes should come with their full logs
          setProcesses(data.processes.map((p: any) => ({
            ...p,
            status: p.status || 'running',
            logs: p.logs || []
          })));
          setLoading(false);
        } else if (data.type === 'processStarted') {
          setProcesses(prev => [...prev, {
            ...data,
            status: 'running',
            logs: data.logs || []
          }]);
        } else if (data.type === 'processExited') {
          setProcesses(prev => prev.map(p =>
            p.processId === data.processId
              ? { ...p, status: 'exited', exitCode: data.exitCode }
              : p
          ));
        } else if (data.type === 'processError') {
          setProcesses(prev => prev.map(p =>
            p.processId === data.processId
              ? { ...p, status: 'error', error: data.error }
              : p
          ));
        } else if (data.type === 'processStdout' || data.type === 'processStderr') {
          setProcesses(prev => prev.map(p =>
            p.processId === data.processId
              ? {
                ...p,
                logs: [...(p.logs || []), data.data]
              }
              : p
          ));
        }
      } catch (error) {
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

  const handleKillProcess = useCallback((processId: string) => {
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
    <ProcessManagerView
      processes={processes}
      onRefresh={handleRefresh}
      onBack={handleBack}
      loading={loading}
      onKillProcess={handleKillProcess}
    />
  );
};
