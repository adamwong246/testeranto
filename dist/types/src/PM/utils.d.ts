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
