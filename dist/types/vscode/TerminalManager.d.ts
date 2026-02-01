import * as vscode from 'vscode';
import { IRunTime } from '../Types';
export declare class TerminalManager {
    private terminals;
    getTerminalKey(runtime: string, testName: string): string;
    createTerminal(runtime: string, testName: string): vscode.Terminal;
    getTerminal(runtime: string, testName: string): vscode.Terminal | undefined;
    showTerminal(runtime: string, testName: string): vscode.Terminal | undefined;
    sendTextToTerminal(runtime: string, testName: string, text: string): void;
    disposeTerminal(runtime: string, testName: string): void;
    disposeAll(): void;
    getAllTestConfigs(): {
        runtime: string;
        testName: string;
    }[];
    createAiderTerminal(runtime: IRunTime, testName: string): vscode.Terminal;
    createAllTerminals(): void;
}
