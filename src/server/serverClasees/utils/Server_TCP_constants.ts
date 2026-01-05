/**
 * Constants for Server_TCP configuration
 */
// Import path module for use in constants
import path from "path";

// Network constants
export const SERVER_CONSTANTS = {
  HOST: "0.0.0.0" as const,
};

// Web test files paths
export const WEB_TEST_FILES_PATH = {
  NEW_PREFIX: "/web/" as const,
  NEW_PREFIX_REGEX: /^\/web\//,
  OLD_PREFIX: "/bundles/web/" as const,
  BASE_DIR: path.join("testeranto", "bundles", "allTests", "web"),
};

// Content type mappings
export const CONTENT_TYPES = {
  PLAIN: "text/plain" as const,
  HTML: "text/html" as const,
  JAVASCRIPT: "application/javascript" as const,
  CSS: "text/css" as const,
  JSON: "application/json" as const,
  PNG: "image/png" as const,
  JPEG: "image/jpeg" as const,
  GIF: "image/gif" as const,
  SVG: "image/svg+xml" as const,
  ICO: "image/x-icon" as const,
  WOFF: "font/woff" as const,
  WOFF2: "font/woff2" as const,
  TTF: "font/ttf" as const,
  EOT: "application/vnd.ms-fontobject" as const,
  XML: "application/xml" as const,
  PDF: "application/pdf" as const,
  ZIP: "application/zip" as const,
  OCTET_STREAM: "application/octet-stream" as const,
};

// WebSocket message types
export const WEBSOCKET_MESSAGE_TYPES = {
  GET_RUNNING_PROCESSES: "getRunningProcesses" as const,
  RUNNING_PROCESSES: "runningProcesses" as const,
  GET_PROCESS: "getProcess" as const,
  PROCESS_DATA: "processData" as const,
  STDIN: "stdin" as const,
  KILL_PROCESS: "killProcess" as const,
  GET_CHAT_HISTORY: "getChatHistory" as const,
  CHAT_HISTORY: "chatHistory" as const,
  ERROR: "error" as const,
};

// File service methods (for reference)
export const FILE_SERVICE_METHODS = [
  "writeFile_send",
  "writeFile_receive",
  "readFile_receive",
  "readFile_send",
  "createDirectory_receive",
  "createDirectory_send",
  "deleteFile_receive",
  "deleteFile_send",
  "files_receive",
  "files_send",
  "projects_receive",
  "projects_send",
  "report_receive",
  "report_send",
  "test_receive",
  "test_send",
] as const;

// Process fields for serialization
export const PROCESS_FIELDS = [
  "processId",
  "command",
  "pid",
  "status",
  "exitCode",
  "error",
  "timestamp",
  "category",
  "testName",
  "platform",
  "logs",
] as const;

// Error messages
export const ERROR_MESSAGES = {
  IPC_FORMAT_NO_LONGER_SUPPORTED:
    "IPC format messages are no longer supported. Node tests must use WebSocket messages with 'type' field.",
  FAILED_TO_GET_CHAT_HISTORY: "Failed to get chat history",
  FILE_NOT_FOUND: "404 Not Found",
  INTERNAL_SERVER_ERROR: "500",
} as const;

// Other constants
export const OTHER_CONSTANTS = {
  STREAM_ID_PREFIX: "stream_",
  SIGTERM: "SIGTERM",
} as const;
