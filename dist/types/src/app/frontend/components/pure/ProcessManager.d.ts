import React from 'react';
interface ProcessManagerProps {
    show: boolean;
    onHide: () => void;
    ws: WebSocket | null;
}
export declare const ProcessManager: React.FC<ProcessManagerProps>;
export {};
