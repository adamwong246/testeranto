/* eslint-disable @typescript-eslint/no-explicit-any */
import http from "http";
import fs from "fs";

import {
  WEB_TEST_FILES_PATH,
  CONTENT_TYPES,
  ERROR_MESSAGES,
} from "./Server_TCP_constants";
import {
  getContentType,
  urlStartsWith,
  extractRelativePath,
  buildWebTestFilePath,
} from "./Server_TCP_utils";
import { Server_TCP_Core } from "./Server_TCP_Core";
import { IMode } from "../../app/frontend/types";
import { ApiEndpoint, ApiFilename } from "../../app/frontend/api2";

export class Server_TCP_Http extends Server_TCP_Core {
  constructor(configs: any, name: string, mode: IMode) {
    super(configs, name, mode);
    this.httpServer.on("request", this.handleHttpRequest.bind(this));
  }

  protected handleHttpRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage;
    }
  ): void {
    console.log(req.method, req.url);

    // Serve bundled web test files from the new location
    if (urlStartsWith(req.url, WEB_TEST_FILES_PATH.NEW_PREFIX)) {
      const url = new URL(req.url!, `http://${req.headers.host}`);
      const pathname = url.pathname;

      const relativePath = extractRelativePath(
        pathname,
        WEB_TEST_FILES_PATH.NEW_PREFIX_REGEX
      );
      const filePath = buildWebTestFilePath(
        relativePath,
        WEB_TEST_FILES_PATH.BASE_DIR
      );

      console.log(`Serving web test file: ${req.url}`);
      console.log(`  Pathname: ${pathname}`);
      console.log(`  Looking for: ${filePath}`);
      console.log(`  File exists: ${fs.existsSync(filePath)}`);

      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error(`Error serving ${req.url}:`, err.message);
          console.error(`  Full path: ${filePath}`);
          res.writeHead(404, { "Content-Type": CONTENT_TYPES.PLAIN });
          res.end(
            `${ERROR_MESSAGES.FILE_NOT_FOUND}: ${req.url}\nPath: ${filePath}\nError: ${err.message}`
          );
          return;
        }
        const contentType = getContentType(pathname);

        console.log(`  Successfully served ${req.url} (${contentType})`);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      });
      return;
    }

    // Also support the old path for backward compatibility
    if (urlStartsWith(req.url, WEB_TEST_FILES_PATH.OLD_PREFIX)) {
      const newPath = req.url!.replace(
        WEB_TEST_FILES_PATH.OLD_PREFIX,
        WEB_TEST_FILES_PATH.NEW_PREFIX
      );
      console.log(`Redirecting ${req.url} to ${newPath}`);
      res.writeHead(301, { Location: newPath });
      res.end();
      return;
    }

    if (req.url === ApiEndpoint.root) {
      fs.readFile(ApiFilename.root, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`500 ${err.toString()}`);
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      });
      return;
    } else if (req.url === ApiEndpoint.style) {
      fs.readFile(ApiFilename.style, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`500 ${err.toString()}`);
          return;
        }
        res.writeHead(200, { "Content-Type": CONTENT_TYPES.CSS });
        res.end(data);
      });
      return;
    } else if (req.url === ApiEndpoint.script) {
      fs.readFile(ApiFilename.script, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end(`500 ${err.toString()}`);
          return;
        }
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(data);
        return;
      });
      return;
    } else if (req.url === "/" || req.url === "/monitor") {
      // Serve a simple HTML page that will load the bundled React app
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Testeranto Process Monitor</title>
        </head>
        <body>
          <div id="root"></div>
          <script src="/static/bundle.js"></script>
        </body>
        </html>
      `);
      return;
    } else if (req.url?.startsWith("/api/")) {
      // Handle monitoring API endpoints
      this.handleMonitoringApi(req, res);
      return;
    } else {
      res.writeHead(404);
      res.end(`404 Not Found. ${req.url}`);
      return;
    }
  }

  private handleMonitoringApi(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage;
    }
  ): void {
    const url = req.url || "";

    if (url === "/api/processes" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify(
          (this as any).getProcessSummary
            ? (this as any).getProcessSummary()
            : { processes: [] }
        )
      );
    } else if (url.startsWith("/api/logs") && req.method === "GET") {
      const urlObj = new URL(url, `http://${req.headers.host}`);
      const processId = urlObj.searchParams.get("processId");

      if (processId && (this as any).getProcessLogs) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            processId,
            logs: (this as any).getProcessLogs(processId) || [],
          })
        );
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ error: "processId query parameter required" })
        );
      }
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
    }
  }
}
