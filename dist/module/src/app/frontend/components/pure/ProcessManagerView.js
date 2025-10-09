import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ProcessList } from './ProcessList';
import { ProcessDetails } from './ProcessDetails';
import { ProcessTerminal } from './ProcessTerminal';
import { useWebSocket } from "../../useWebSocket";
export const ProcessManagerView = ({ processes, 
// onRefresh,
// onBack,
loading, onKillProcess, }) => {
    const [selectedProcess, setSelectedProcess] = useState(null);
    const { ws } = useWebSocket();
    // Handle process selection
    const handleSelectProcess = useCallback((process) => {
        setSelectedProcess(process);
    }, []);
    // Request process data when selected
    useEffect(() => {
        if (selectedProcess && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: "getProcess",
                processId: selectedProcess.processId,
            }));
        }
    }, [selectedProcess, ws]);
    return (React.createElement(Container, { fluid: true, className: "px-0 h-100" },
        React.createElement(Row, { className: "g-0", style: { height: "calc(100vh - 56px)" } },
            React.createElement(Col, { sm: 2, className: "border-end", style: {
                    height: "100%",
                    overflow: "auto",
                    backgroundColor: "#f8f9fa",
                } },
                React.createElement(ProcessList, { processes: processes, selectedProcess: selectedProcess, onSelectProcess: handleSelectProcess, loading: loading })),
            React.createElement(Col, { sm: 5, className: "border-end p-3 d-flex flex-column", style: {
                    height: "100%",
                    overflow: "hidden"
                } },
                React.createElement(ProcessDetails, { selectedProcess: selectedProcess, onKillProcess: onKillProcess })),
            React.createElement(Col, { sm: 5, className: "p-3 d-flex flex-column", style: {
                    height: "100%",
                    overflow: "hidden"
                } },
                React.createElement(ProcessTerminal, { selectedProcess: selectedProcess, ws: ws })))));
};
// export { Process };
