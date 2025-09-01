export type ProcessStatus = "running" | "exited" | "error" | "completed";
export type ProcessType = "process" | "promise";
export type ProcessCategory = "aider" | "bdd-test" | "build-time" | "other";
export type ProcessPlatform = "node" | "web" | "pure" | "pitono" | "golang";
export interface ProcessInfo {
    child?: any;
    promise?: Promise<any>;
    status: ProcessStatus;
    exitCode?: number;
    error?: string;
    command: string;
    pid?: number;
    timestamp: string;
    type: ProcessType;
    category: ProcessCategory;
    testName?: string;
    platform?: ProcessPlatform;
}
export interface ProcessData {
    processId: string;
    command: string;
    pid?: number;
    status: ProcessStatus;
    exitCode?: number;
    error?: string;
    timestamp: string;
    category: ProcessCategory;
    testName?: string;
    platform?: ProcessPlatform;
    logs: string[];
}
export interface ProcessManager {
    allProcesses: Map<string, ProcessInfo>;
    processLogs: Map<string, string[]>;
    addPromiseProcess: (processId: string, promise: Promise<any>, command: string, category?: ProcessCategory, testName?: string, platform?: ProcessPlatform, onResolve?: (result: any) => void, onReject?: (error: any) => void) => string;
    broadcast: (message: any) => void;
    getProcessesByCategory: (category: ProcessCategory) => any[];
    getBDDTestProcesses: () => any[];
    getBuildTimeProcesses: () => any[];
    getAiderProcesses: () => any[];
    getProcessesByTestName: (testName: string) => any[];
    getProcessesByPlatform: (platform: ProcessPlatform) => any[];
}
export interface WebSocketMessage {
    type: string;
    [key: string]: any;
}
export interface ExecuteCommandMessage extends WebSocketMessage {
    type: "executeCommand";
    command: string;
}
export interface GetRunningProcessesMessage extends WebSocketMessage {
    type: "getRunningProcesses";
}
export interface GetProcessMessage extends WebSocketMessage {
    type: "getProcess";
    processId: string;
}
export interface StdinMessage extends WebSocketMessage {
    type: "stdin";
    processId: string;
    data: string;
}
export interface KillProcessMessage extends WebSocketMessage {
    type: "killProcess";
    processId: string;
}
export interface ProcessStartedEvent {
    type: "processStarted";
    processId: string;
    command: string;
    timestamp: string;
    logs: string[];
}
export interface ProcessStdoutEvent {
    type: "processStdout";
    processId: string;
    data: string;
    timestamp: string;
}
export interface ProcessStderrEvent {
    type: "processStderr";
    processId: string;
    data: string;
    timestamp: string;
}
export interface ProcessExitedEvent {
    type: "processExited";
    processId: string;
    exitCode: number;
    timestamp: string;
    logs?: string[];
}
export interface ProcessErrorEvent {
    type: "processError";
    processId: string;
    error: string;
    timestamp: string;
    logs?: string[];
}
export interface RunningProcessesEvent {
    type: "runningProcesses";
    processes: ProcessData[];
}
export interface ProcessDataEvent {
    type: "processData";
    processId: string;
    command: string;
    pid?: number;
    status: ProcessStatus;
    exitCode?: number;
    error?: string;
    timestamp: string;
    category: ProcessCategory;
    testName?: string;
    platform?: ProcessPlatform;
    logs: string[];
}
