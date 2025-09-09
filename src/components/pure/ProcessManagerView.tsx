import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useWebSocket } from '../../App';
import { ProcessList } from './ProcessList';
import { ProcessDetails } from './ProcessDetails';
import { ProcessTerminal } from './ProcessTerminal';
import { Process } from './ProcessManagerViewTypes';

export interface ProcessManagerViewProps {
  processes: Process[];
  onRefresh: () => void;
  onBack: () => void;
  loading: boolean;
  onKillProcess?: (processId: string) => void;
}

export const ProcessManagerView: React.FC<ProcessManagerViewProps> = ({
  processes,
  onRefresh,
  onBack,
  loading,
  onKillProcess,
}) => {
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const { ws } = useWebSocket();

  // Handle process selection
  const handleSelectProcess = useCallback((process: Process) => {
    setSelectedProcess(process);
  }, []);

  // Request process data when selected
  useEffect(() => {
    if (selectedProcess && ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "getProcess",
          processId: selectedProcess.processId,
        })
      );
    }
  }, [selectedProcess, ws]);

  return (
    <Container fluid className="px-0 h-100">
      <Row className="g-0" style={{ height: "calc(100vh - 56px)" }}>
        {/* Process List */}
        <Col sm={2} className="border-end" style={{
          height: "100%",
          overflow: "auto",
          backgroundColor: "#f8f9fa",
        }}>
          <ProcessList
            processes={processes}
            selectedProcess={selectedProcess}
            onSelectProcess={handleSelectProcess}
            loading={loading}
          />
        </Col>

        {/* Process Details */}
        <Col sm={5} className="border-end p-3 d-flex flex-column" style={{ 
          height: "100%", 
          overflow: "hidden" 
        }}>
          <ProcessDetails
            selectedProcess={selectedProcess}
            onKillProcess={onKillProcess}
          />
        </Col>

        {/* Terminal */}
        <Col sm={5} className="p-3 d-flex flex-column" style={{ 
          height: "100%", 
          overflow: "hidden" 
        }}>
          <ProcessTerminal
            selectedProcess={selectedProcess}
            ws={ws}
          />
        </Col>
      </Row>
    </Container>
  );
};
