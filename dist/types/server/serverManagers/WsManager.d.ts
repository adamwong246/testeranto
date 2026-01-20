export declare class WsManager {
    constructor();
    escapeXml(unsafe: string): string;
    processMessage(type: string, data: any, getProcessSummary?: () => any, getProcessLogs?: (processId: string) => string[]): any;
    getProcessesResponse(processSummary: any): any;
    getLogsResponse(processId: string, logs: string[]): any;
    getSourceFilesUpdatedResponse(testName: string, runtime: string, status: string, message?: string): any;
    getErrorResponse(type: string, errorMessage: string): any;
    getSuccessResponse(type: string, data?: any): any;
}
