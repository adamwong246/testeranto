import React from 'react';
import { Process } from './ProcessManagerViewTypes';
interface ProcessDetailsProps {
    selectedProcess: Process | null;
    onKillProcess?: (processId: string) => void;
}
export declare const ProcessDetails: React.FC<ProcessDetailsProps>;
export {};
