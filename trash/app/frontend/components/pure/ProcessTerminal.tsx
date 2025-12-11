import React, { useCallback } from "react";

import { useTerminalWebSocket } from "../../useTerminalWebSocket";

import { Process } from "./ProcessManagerViewTypes";
import { TerminalLogs } from "./TerminalLogs";
import { TerminalInput } from "./TerminalInput";

interface ProcessTerminalProps {
  selectedProcess: Process | null;
  ws: WebSocket | null;
}

export const ProcessTerminal: React.FC<ProcessTerminalProps> = ({
  selectedProcess,
  ws,
}) => {
  const { processLogs } = useTerminalWebSocket(ws, selectedProcess);

  const handleInput = useCallback(
    (data: string) => {
      if (
        ws &&
        ws.readyState === WebSocket.OPEN &&
        selectedProcess?.status === "running"
      ) {
        ws.send(
          JSON.stringify({
            type: "stdin",
            processId: selectedProcess.processId,
            data: data,
          })
        );
      }
    },
    [ws, selectedProcess]
  );

  if (!selectedProcess) {
    return (
      <div className="text-center text-muted mt-5">
        <i>Terminal will appear here when a process is selected</i>
      </div>
    );
  }

  return (
    <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
      <TerminalLogs logs={processLogs} />
      {selectedProcess.status === "running" && (
        <TerminalInput onInput={handleInput} />
      )}
    </div>
  );
};
