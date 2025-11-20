import React from 'react';
interface ProcessInputProps {
    inputValue: string;
    webSocketStatus: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
}
export declare const ProcessInput: React.FC<ProcessInputProps>;
export {};
