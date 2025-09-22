import React from "react";
import { Process } from './ProcessManagerViewTypes';
export interface ProcessManagerViewProps {
    processes: Process[];
    onRefresh: () => void;
    onBack: () => void;
    loading: boolean;
    onKillProcess?: (processId: string) => void;
}
export declare const ProcessManagerView: React.FC<ProcessManagerViewProps>;
export { Process };
