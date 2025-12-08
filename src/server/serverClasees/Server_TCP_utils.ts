/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Utility functions for Server_TCP
 */
import path from "path";
import { CONTENT_TYPES } from "./Server_TCP_constants";

/**
 * Determine content type based on file extension
 */
export function getContentType(filePath: string): string {
  if (filePath.endsWith(".html")) return CONTENT_TYPES.HTML;
  else if (filePath.endsWith(".js") || filePath.endsWith(".mjs"))
    return CONTENT_TYPES.JAVASCRIPT;
  else if (filePath.endsWith(".css")) return CONTENT_TYPES.CSS;
  else if (filePath.endsWith(".json")) return CONTENT_TYPES.JSON;
  else if (filePath.endsWith(".png")) return CONTENT_TYPES.PNG;
  else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg"))
    return CONTENT_TYPES.JPEG;
  else if (filePath.endsWith(".gif")) return CONTENT_TYPES.GIF;
  else if (filePath.endsWith(".svg")) return CONTENT_TYPES.SVG;
  else return CONTENT_TYPES.PLAIN;
}

/**
 * Generate a unique stream ID
 */
export function generateStreamId(): string {
  return "stream_" + Math.random().toString(36).substr(2, 9);
}

/**
 * Check if a URL starts with a given prefix
 */
export function urlStartsWith(
  url: string | undefined,
  prefix: string
): boolean {
  return url?.startsWith(prefix) ?? false;
}

/**
 * Extract relative path from URL by removing prefix
 */
export function extractRelativePath(url: string, prefixRegex: RegExp): string {
  return url.replace(prefixRegex, "");
}

/**
 * Build full file path for web test files
 */
export function buildWebTestFilePath(
  relativePath: string,
  baseDir: string
): string {
  return path.join(process.cwd(), baseDir, relativePath);
}

/**
 * Process info serialization helper
 */
export function serializeProcessInfo(
  id: string,
  procInfo: any,
  logs: any[]
): Record<string, any> {
  return {
    processId: id,
    command: procInfo.command,
    pid: procInfo.pid,
    status: procInfo.status,
    exitCode: procInfo.exitCode,
    error: procInfo.error,
    timestamp: procInfo.timestamp,
    category: procInfo.category,
    testName: procInfo.testName,
    platform: procInfo.platform,
    logs: logs || [],
  };
}

/**
 * Prepare arguments for command execution
 */
export function prepareCommandArgs(commandData: any): any[] {
  if (commandData === undefined || commandData === null) {
    return [];
  }
  return Array.isArray(commandData) ? commandData : [commandData];
}

/**
 * Handle promise result and send WebSocket response
 */
export function handlePromiseResult(
  promise: Promise<any>,
  type: string,
  key: string,
  ws: any
): void {
  promise
    .then((resolvedResult) => {
      console.log(`Command ${type} resolved:`, resolvedResult);
      ws.send(
        JSON.stringify({
          key: key,
          payload: resolvedResult,
        })
      );
    })
    .catch((error) => {
      console.error(`Error executing command ${type}:`, error);
      ws.send(
        JSON.stringify({
          key: key,
          payload: null,
          error: error?.toString(),
        })
      );
    });
}

/**
 * Send error response via WebSocket
 */
export function sendErrorResponse(ws: any, key: string, error: any): void {
  ws.send(
    JSON.stringify({
      key: key,
      payload: null,
      error: error?.toString(),
    })
  );
}
