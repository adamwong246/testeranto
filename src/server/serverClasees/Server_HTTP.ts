import fs from "fs";
import http from "http";
import path from "path";
import { IMode } from "../types";
import { CONTENT_TYPES } from "./utils/Server_TCP_constants";
import { Server_TCP } from "./Server_TCP";
import { getContentType } from "./utils/Server_TCP_utils";

export class Server_HTTP extends Server_TCP {
  constructor(configs: any, name: string, mode: IMode) {
    super(configs, name, mode);

    if (this.httpServer) {
      const address = this.httpServer.address();
      console.log(`[HTTP] HTTP server address:`, address);

      // Listen for server listening event
      this.httpServer.on("listening", () => {
        const addr = this.httpServer.address();
        console.log(`[HTTP] HTTP server is now listening on port ${addr.port}`);
      });

      // Listen for errors
      this.httpServer.on("error", (error) => {
        console.error(`[HTTP] HTTP server error:`, error);
      });

      // Listen for close
      this.httpServer.on("close", () => {
        console.log(`[HTTP] HTTP server closed`);
      });
    }
    this.httpServer.on("request", this.handleHttpRequest.bind(this));
    console.log(`[HTTP] HTTP request handler attached`);
  }

  protected handleHttpRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage;
    }
  ): void {
    // Always serve static files from the project directory
    this.serveStaticFile(req, res);
    return;
  }

  private serveStaticFile(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage;
    }
  ): void {
    if (!req.url) {
      res.writeHead(400);
      res.end("Bad Request");
      return;
    }

    // Remove query parameters
    const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;

    // Prevent directory traversal attacks
    const decodedPath = decodeURIComponent(urlPath);
    // Remove leading slash to make it relative
    const relativePath = decodedPath.startsWith("/")
      ? decodedPath.slice(1)
      : decodedPath;
    const normalizedPath = path.normalize(relativePath);

    // Check for any remaining '..' components
    if (normalizedPath.includes("..")) {
      res.writeHead(403);
      res.end("Forbidden: Directory traversal not allowed");
      return;
    }

    // Start from the project root (current working directory)
    const projectRoot = process.cwd();
    const filePath = path.join(projectRoot, normalizedPath);

    // Ensure the file is within the project root
    if (!filePath.startsWith(path.resolve(projectRoot))) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    // Check if it's a directory
    fs.stat(filePath, (err, stats) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.writeHead(404);
          res.end(`File not found: ${urlPath}`);
          return;
        } else {
          res.writeHead(500);
          res.end(`Server Error: ${err.message}`);
          return;
        }
      }

      if (stats.isDirectory()) {
        // List directory contents
        fs.readdir(filePath, (readErr, files) => {
          if (readErr) {
            res.writeHead(500);
            res.end(`Server Error: ${readErr.message}`);
            return;
          }
          // Generate directory listing
          const items = files
            .map((file) => {
              try {
                const stat = fs.statSync(path.join(filePath, file));
                const isDir = stat.isDirectory();
                const slash = isDir ? "/" : "";
                return `<li><a href="${path.join(
                  urlPath,
                  file
                )}${slash}">${file}${slash}</a></li>`;
              } catch {
                // If we can't stat the file, still show it as a link without slash
                return `<li><a href="${path.join(
                  urlPath,
                  file
                )}">${file}</a></li>`;
              }
            })
            .join("");

          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`
            <!DOCTYPE html>
            <html>
            <head><title>Directory listing for ${urlPath}</title></head>
            <body>
              <h1>Directory listing for ${urlPath}</h1>
              <ul>
                ${items}
              </ul>
            </body>
            </html>
          `);
        });
      } else {
        this.serveFile(filePath, res);
      }
    });
  }

  private serveFile(
    filePath: string,
    res: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage;
    }
  ): void {
    const contentType = getContentType(filePath) || CONTENT_TYPES.OCTET_STREAM;

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.writeHead(404);
          res.end(`File not found: ${filePath}`);
        } else {
          res.writeHead(500);
          res.end(`Server Error: ${err.message}`);
        }
        return;
      }

      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  }

  async stop() {
    // Safely close HTTP server if it exists
    if (this.httpServer) {
      this.httpServer.close(() => {
        console.log("HTTP server closed");
      });
    }
    await super.stop();
  }
}
