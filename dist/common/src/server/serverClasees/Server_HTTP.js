"use strict";
// Gives the server HTTP capabilities
// 1) serve static files from the project directory
// 2) handle HTTP requests which are defined by child classes.
////  for instance, Server_Process_Manager will define the react component.
////  So we want the Server_Process_Manager class to handle the react component and logic defined by that child class
////  These extra pages are routed under the ~ (tilde) to seperate the file server from the extra commands
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server_HTTP = void 0;
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const tcp_1 = require("../serverManagers/tcp");
const Server_Base_1 = require("./Server_Base");
class Server_HTTP extends Server_Base_1.Server_Base {
    constructor(configs, mode) {
        super(configs, mode);
        // this.http = new HttpManager();
        this.httpServer = http_1.default.createServer();
        this.httpServer.on("error", (error) => {
            console.error(`[HTTP] error:`, error);
        });
        this.httpServer.on("request", this.handleHttpRequest.bind(this));
        // Note: WebSocket upgrade handling will be set up by child classes if needed
        // Do not call setupWebSocketUpgrade() here
    }
    async start() {
        console.log(`[Server_HTTP] start()`);
        super.start();
        return new Promise((resolve) => {
            this.httpServer.on("listening", () => {
                const addr = this.httpServer.address();
                console.log(`[HTTP] HTTP server is now listening on ${addr}`);
                resolve();
            });
        });
    }
    async stop() {
        console.log(`[Server_HTTP] stop()`);
        this.httpServer.close(() => {
            console.log("[HTTP] HTTP server closed");
        });
        await super.stop();
    }
    handleHttpRequest(req, res) {
        console.log(`[Server_HTTP] handleHttpRequest(${req.url})`);
        // Check if this is a route request (starts with /~/)
        if (req.url && req.url.startsWith("/~/")) {
            this.handleRouteRequest(req, res);
        }
        else {
            // Otherwise serve static files
            this.serveStaticFile(req, res);
        }
    }
    handleRouteRequest(req, res) {
        console.log(`[Server_HTTP] handleRouteRequest(${req.url})`);
        const routeName = this.http.routeName(req);
        console.log(`[HTTP] Handling route: /~/${routeName}`);
        // Use HttpManager to match the route
        const match = this.http.matchRoute(routeName, this.routes);
        if (match) {
            // Add params to request object for handler to use
            req.params = match.params;
            try {
                match.handler(req, res);
            }
            catch (error) {
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
    serveStaticFile(req, res) {
        console.log(`[Server_HTTP] serveStaticFile(${req.url})`);
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
        const filePath = path_1.default.join(projectRoot, normalizedPath);
        // Ensure the file is within the project root
        if (!filePath.startsWith(path_1.default.resolve(projectRoot))) {
            res.writeHead(403);
            res.end("Forbidden");
            return;
        }
        // Check if it's a directory
        fs_1.default.stat(filePath, (err, stats) => {
            if (err) {
                if (err.code === "ENOENT") {
                    res.writeHead(404);
                    res.end(`File not found: ${normalizedPath}`);
                    return;
                }
                else {
                    res.writeHead(500);
                    res.end(`Server Error: ${err.message}`);
                    return;
                }
            }
            if (stats.isDirectory()) {
                // List directory contents
                fs_1.default.readdir(filePath, (readErr, files) => {
                    if (readErr) {
                        res.writeHead(500);
                        res.end(`Server Error: ${readErr.message}`);
                        return;
                    }
                    // Generate directory listing
                    const items = files
                        .map((file) => {
                        try {
                            const stat = fs_1.default.statSync(path_1.default.join(filePath, file));
                            const isDir = stat.isDirectory();
                            const slash = isDir ? "/" : "";
                            return `<li><a href="${path_1.default.join(normalizedPath, file)}${slash}">${file}${slash}</a></li>`;
                        }
                        catch (_a) {
                            // If we can't stat the file, still show it as a link without slash
                            return `<li><a href="${path_1.default.join(normalizedPath, file)}">${file}</a></li>`;
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
            }
            else {
                this.serveFile(filePath, res);
            }
        });
    }
    serveFile(filePath, res) {
        console.log(`[Server_HTTP] serveFile(${filePath})`);
        const contentType = (0, tcp_1.getContentType)(filePath) || tcp_1.CONTENT_TYPES.OCTET_STREAM;
        fs_1.default.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code === "ENOENT") {
                    res.writeHead(404);
                    res.end(`File not found: ${filePath}`);
                }
                else {
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
    router(a) {
        // Default implementation does nothing
        // Inheriting classes can override if needed
        return a;
    }
}
exports.Server_HTTP = Server_HTTP;
