"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsManager = void 0;
class WsManager {
    constructor() { }
    escapeXml(unsafe) {
        if (!unsafe)
            return '';
        return unsafe.replace(/[<>&'"]/g, (c) => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
                default: return c;
            }
        });
    }
    // Process message and return response data
    processMessage(type, data, getProcessSummary, getProcessLogs) {
        console.log("[WsManager] Processing message:", type);
        switch (type) {
            case "ping":
                return {
                    type: "pong",
                    timestamp: new Date().toISOString()
                };
            case "getProcesses":
                if (getProcessSummary) {
                    const summary = getProcessSummary();
                    return {
                        type: "processes",
                        data: summary,
                        timestamp: new Date().toISOString()
                    };
                }
                else {
                    return {
                        type: "processes",
                        data: { processes: [], totalProcesses: 0, running: 0 },
                        timestamp: new Date().toISOString()
                    };
                }
            case "getLogs":
                const { processId } = data || {};
                if (!processId) {
                    return {
                        type: "logs",
                        status: "error",
                        message: "Missing processId",
                        timestamp: new Date().toISOString()
                    };
                }
                if (getProcessLogs) {
                    const logs = getProcessLogs(processId);
                    return {
                        type: "logs",
                        processId,
                        logs: logs.map((log) => {
                            let level = "info";
                            let source = "process";
                            let message = log;
                            const match = log.match(/\[(.*?)\] \[(.*?)\] (.*)/);
                            if (match) {
                                const timestamp = match[1];
                                source = match[2];
                                message = match[3];
                                if (source === "stderr" || source === "error") {
                                    level = "error";
                                }
                                else if (source === "warn") {
                                    level = "warn";
                                }
                                else if (source === "debug") {
                                    level = "debug";
                                }
                                else {
                                    level = "info";
                                }
                            }
                            return {
                                timestamp: new Date().toISOString(),
                                level: level,
                                message: message,
                                source: source
                            };
                        }),
                        timestamp: new Date().toISOString()
                    };
                }
                else {
                    return {
                        type: "logs",
                        processId,
                        logs: [],
                        timestamp: new Date().toISOString()
                    };
                }
            case "subscribeToLogs":
                const { processId: subProcessId } = data || {};
                if (!subProcessId) {
                    return {
                        type: "logSubscription",
                        status: "error",
                        message: "Missing processId",
                        timestamp: new Date().toISOString()
                    };
                }
                return {
                    type: "logSubscription",
                    status: "subscribed",
                    processId: subProcessId,
                    timestamp: new Date().toISOString()
                };
            case "sourceFilesUpdated":
                const { testName, hash, files, runtime } = data || {};
                if (!testName || !hash || !files || !runtime) {
                    return {
                        type: "sourceFilesUpdated",
                        status: "error",
                        message: "Missing required fields: testName, hash, files, or runtime",
                        timestamp: new Date().toISOString()
                    };
                }
                // Note: Actual processing needs to be done by the server
                return {
                    type: "sourceFilesUpdated",
                    status: "success",
                    testName,
                    runtime,
                    message: "Build update processed successfully",
                    timestamp: new Date().toISOString()
                };
            case "getBuildListenerState":
                // This needs server-side implementation
                return {
                    type: "buildListenerState",
                    status: "error",
                    message: "Build listener state not available",
                    timestamp: new Date().toISOString()
                };
            case "getBuildEvents":
                // This needs server-side implementation
                return {
                    type: "buildEvents",
                    status: "error",
                    message: "Build events not available",
                    timestamp: new Date().toISOString()
                };
            default:
                return {
                    type: "error",
                    message: `Unknown message type: ${type}`,
                    timestamp: new Date().toISOString()
                };
        }
    }
    // Helper methods for specific message types
    getProcessesResponse(processSummary) {
        return {
            type: "processes",
            data: processSummary,
            timestamp: new Date().toISOString()
        };
    }
    getLogsResponse(processId, logs) {
        return {
            type: "logs",
            processId,
            logs: logs.map((log) => {
                let level = "info";
                let source = "process";
                let message = log;
                const match = log.match(/\[(.*?)\] \[(.*?)\] (.*)/);
                if (match) {
                    const timestamp = match[1];
                    source = match[2];
                    message = match[3];
                    if (source === "stderr" || source === "error") {
                        level = "error";
                    }
                    else if (source === "warn") {
                        level = "warn";
                    }
                    else if (source === "debug") {
                        level = "debug";
                    }
                    else {
                        level = "info";
                    }
                }
                return {
                    timestamp: new Date().toISOString(),
                    level: level,
                    message: message,
                    source: source
                };
            }),
            timestamp: new Date().toISOString()
        };
    }
    getSourceFilesUpdatedResponse(testName, runtime, status, message) {
        return {
            type: "sourceFilesUpdated",
            status,
            testName,
            runtime,
            message: message || "Build update processed successfully",
            timestamp: new Date().toISOString()
        };
    }
    getErrorResponse(type, errorMessage) {
        return {
            type: type,
            status: "error",
            message: errorMessage,
            timestamp: new Date().toISOString()
        };
    }
    getSuccessResponse(type, data) {
        return {
            type: type,
            status: "success",
            data: data,
            timestamp: new Date().toISOString()
        };
    }
}
exports.WsManager = WsManager;
