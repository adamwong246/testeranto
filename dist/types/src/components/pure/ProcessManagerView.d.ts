import React from "react";
export interface Process {
    processId: string;
    command: string;
    pid?: number;
    status?: "running" | "exited" | "error";
    exitCode?: number;
    error?: string;
    timestamp: string;
    logs?: string[];
}
interface ProcessManagerViewProps {
    processes: Process[];
    onRefresh: () => void;
    onBack: () => void;
    loading: boolean;
    onKillProcess?: (processId: string) => void;
}
export declare const ProcessManagerView: React.FC<ProcessManagerViewProps>;
export {};
