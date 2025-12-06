import React from 'react';
import { Process } from './ProcessManagerViewTypes';
interface ProcessListProps {
    processes: Process[];
    selectedProcess: Process | null;
    onSelectProcess: (process: Process) => void;
    loading: boolean;
}
export declare const ProcessList: React.FC<ProcessListProps>;
export {};
