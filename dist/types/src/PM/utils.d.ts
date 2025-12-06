import fs from "fs";
import { IRunTime } from "../Types";
export type IOutputs = Record<string, {
    entryPoint: string;
    inputs: Record<string, string>;
}>;
export type LogStreams = {
    closeAll: () => void;
    writeExitCode: (code: number, error?: Error) => void;
    stdout?: fs.WriteStream;
    stderr?: fs.WriteStream;
    info?: fs.WriteStream;
    warn?: fs.WriteStream;
    error?: fs.WriteStream;
    debug?: fs.WriteStream;
    exit: fs.WriteStream;
};
export declare function runtimeLogs(runtime: IRunTime, reportDest: string): Record<string, fs.WriteStream>;
export declare function createLogStreams(reportDest: string, runtime: IRunTime): LogStreams;
export declare function fileHash(filePath: any, algorithm?: string): Promise<string>;
export declare const statusMessagePretty: (failures: number, test: string, runtime: IRunTime) => void;
export declare function writeFileAndCreateDir(filePath: any, data: any): Promise<void>;
export declare const filesHash: (files: string[], algorithm?: string) => Promise<string>;
export declare function isValidUrl(string: any): boolean;
export declare function pollForFile(path: any, timeout?: number): Promise<void>;
export declare const puppeteerConfigs: {
    slowMo: number;
    waitForInitialPage: boolean;
    executablePath: string;
    defaultViewport: null;
    dumpio: boolean;
    headless: boolean;
    devtools: boolean;
    args: string[];
};
