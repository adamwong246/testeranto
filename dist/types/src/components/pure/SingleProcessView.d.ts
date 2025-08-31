import React from 'react';
import { Process } from './ProcessManagerView';
interface SingleProcessViewProps {
    process: Process | null;
    onBack: () => void;
    loading: boolean;
    onKillProcess?: (processId: string) => void;
}
export declare const SingleProcessView: React.FC<SingleProcessViewProps>;
export {};
