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
import { CONTENT_TYPES, SERVER_CONSTANTS } from "./utils/Server_TCP_constants";
import { Server_WS } from "./Server_WS";
import { getContentType } from "./utils/Server_TCP_utils";

export abstract class Server_HTTP extends Server_WS {
  protected httpServer: http.Server;

  constructor(configs: any, name: string, mode: IMode) {
    super(configs, name, mode);

    this.httpServer = http.createServer();

    // Use the configured httpPort from configs, fallback to environment variables or default
    const httpPort =
      configs.httpPort ||
      Number(process.env.HTTP_PORT) ||
      Number(process.env.WS_PORT) ||
      3456;
    console.log(
      `[Server_TCP] Starting HTTP server on port ${httpPort}, host ${SERVER_CONSTANTS.HOST}`
    );
    this.httpServer.listen(httpPort, SERVER_CONSTANTS.HOST, () => {
      const addr = this.httpServer.address();
      console.log(
        `[Server_TCP] HTTP server running on http://localhost:${httpPort}`
      );
    });

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

    this.httpServer.on("request", this.handleHttpRequest.bind(this));
    console.log(`[HTTP] HTTP request handler attached`);

    // Set up WebSocket upgrade handling
    this.setupWebSocketUpgrade();
  }

  routes(
    routes: Record<string, React.ComponentType<any> | React.ReactElement>
  ) {
    // Store routes for later use in request handling
    (this as any)._routes = routes;
  }

  protected handleHttpRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage;
    }
  ): void {
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
    const urlPath = new URL(req.url!, `http://${req.headers.host}`).pathname;

    // Extract route name (remove /~/ prefix)
    const routeName = urlPath.slice(3); // Remove '/~/'

    // Get routes from instance
    const routes = (this as any)._routes as
      | Record<string, React.ComponentType<any> | React.ReactElement>
      | undefined;

    if (!routes || !routes[routeName]) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(`<h1>Route not found: /~/${routeName}</h1>`);
      return;
    }

    // Serve the process manager React app
    if (routeName === "process_manager") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Process Manager</title>
            <link href="/dist/prebuild/ProcessManger.css" rel="stylesheet">
            
          </head>
          <body>
            <div id="root"></div>
            <script src="/dist/prebuild/ProcessManagerReactApp.js"></script>
            <script>
              // The bundled script automatically calls initApp when loaded
              // Ensure the root element exists
              if (!document.getElementById('root').innerHTML) {
                document.getElementById('root').innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading Process Manager...</p></div>';
              }
            </script>
          </body>
        </html>
      `);
      return;
    }

    // Fallback for other routes (should not happen)
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${routeName}</title>
        </head>
        <body>
          <div id="root"></div>
          <script>
            document.getElementById('root').innerHTML = '<h1>${routeName}</h1><p>Component not fully implemented.</p>';
          </script>
        </body>
      </html>
    `);
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

  protected setupWebSocketUpgrade(): void {
    // Attach WebSocket upgrade handler using the parent class method
    if (this.ws) {
      this.attachWebSocketToHttpServer(this.httpServer);
    } else {
      console.error("[HTTP] WebSocket server not available");
    }
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

  abstract route(a: any): any;
}
