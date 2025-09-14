import React from 'react';
import { Process } from './ProcessManagerViewTypes';
interface ProcessTerminalProps {
    selectedProcess: Process | null;
    ws: WebSocket | null;
}
export declare const ProcessTerminal: React.FC<ProcessTerminalProps>;
export {};
