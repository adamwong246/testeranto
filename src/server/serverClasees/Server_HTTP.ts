// Gives the server HTTP capabilities
// 1) serve static files from the project directory
// 2) handle HTTP requests which are defined by child classes.
////  for instance, Server_Process_Manager will define the react component.
////  So we want the Server_Process_Manager class to handle the react component and logic defined by that child class
////  These extra pages are routed under the ~ (tilde) to seperate the file server from the extra commands

import fs from "fs";
import http from "http";
import path from "path";
import { IMode } from "../types";
import { Server_Docker } from "./Server_Docker";
import { CONTENT_TYPES, getContentType } from "../serverManagers/tcp";
import { HttpManager } from "../serverManagers/HttpManager";

export abstract class Server_HTTP extends Server_Docker {

  http: HttpManager;
  protected httpServer: http.Server;
  routes: any;

  constructor(configs: any, name: string, mode: IMode, routes: any) {
    super(configs, name, mode);
    this.http = new HttpManager();
    this.httpServer = http.createServer();
    this.httpServer.on("error", (error) => {
      console.error(`[HTTP] error:`, error);
    });

    this.httpServer.on("request", this.handleHttpRequest.bind(this));
    this.routes = routes;

    // Note: WebSocket upgrade handling will be set up by child classes if needed
    // Do not call setupWebSocketUpgrade() here
  }

  async start(): Promise<void> {
    console.log(`[Server_HTTP] start()`)
    super.start()
    return new Promise((resolve) => {
      this.httpServer.on("listening", () => {
        const addr = this.httpServer.address();
        console.log(`[HTTP] HTTP server is now listening on port ${3456}`);
        resolve()
      });
    });
  }

  async stop() {
    console.log(`[Server_HTTP] stop()`)
    this.httpServer.close(() => {
      console.log("[HTTP] HTTP server closed");
    });
    await super.stop();
  }

  protected handleHttpRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage;
    }
  ): void {

    console.log(`[Server_HTTP] handleHttpRequest(${req.url})`)

    // Check if this is a route request (starts with /~/)
    if (req.url && req.url.startsWith("/~/")) {
      this.handleRouteRequest(req, res);
    } else {
      // Otherwise serve static files
      this.serveStaticFile(req, res);
    }
  }

  private handleRouteRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage;
    }
  ): void {
    console.log(`[Server_HTTP] handleRouteRequest(${req.url})`);

    const routeName = this.http.routeName(req);
    console.log(`[HTTP] Handling route: /~/${routeName}`);

    // Use HttpManager to match the route
    const match = this.http.matchRoute(routeName, this.routes);
    if (match) {
      // Add params to request object for handler to use
      (req as any).params = match.params;
      try {
        match.handler(req, res);
      } catch (error) {
        console.error(`[HTTP] Error in route handler for /~/${routeName}:`, error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`Internal Server Error: ${error}`);
      }
      return;
    }

    // No route found
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end(`Route not found: /~/${routeName}`);
  }

  private serveStaticFile(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage;
    }
  ): void {

    console.log(`[Server_HTTP] serveStaticFile(${req.url})`)

    if (!req.url) {
      res.writeHead(400);
      res.end("Bad Request");
      return;
    }

    const normalizedPath = this.http.decodedPath(req);


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
          res.end(`File not found: ${normalizedPath}`);
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
                  normalizedPath,
                  file
                )}${slash}">${file}${slash}</a></li>`;
              } catch {
                // If we can't stat the file, still show it as a link without slash
                return `<li><a href="${path.join(
                  normalizedPath,
                  file
                )}">${file}</a></li>`;
              }
            })
            .join("");

          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`
            <!DOCTYPE html>
            <html>
            <head><title>Directory listing for ${normalizedPath}</title></head>
            <body>
              <h1>Directory listing for ${normalizedPath}</h1>
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
    console.log(`[Server_HTTP] serveFile(${filePath})`)

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


  // The route method is no longer abstract since we're using the routes() method
  // This is kept for backward compatibility
  router(a: any): any {
    // Default implementation does nothing
    // Inheriting classes can override if needed
    return a;
  }



}
