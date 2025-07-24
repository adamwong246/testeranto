"use strict";
// simple http server to preview reports
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_static_1 = __importDefault(require("node-static"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fileServer = new node_static_1.default.Server("./", {
    cache: false,
    headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    }
});
const server = http_1.default.createServer((req, res) => {
    // Handle potential double responses
    let responded = false;
    const safeResponse = (handler) => {
        if (responded)
            return;
        responded = true;
        try {
            handler();
        }
        catch (err) {
            console.error('Error handling request:', err);
            if (!res.headersSent) {
                res.writeHead(500);
            }
            res.end('Internal Server Error');
        }
    };
    req.on('error', (err) => {
        console.error('Request error:', err);
        safeResponse(() => {
            if (!res.headersSent) {
                res.writeHead(400);
            }
            res.end('Bad Request');
        });
    });
    req.on('end', () => {
        safeResponse(() => {
            const filePath = path_1.default.join(process.cwd(), req.url || '');
            // First check if file exists
            fs_1.default.stat(filePath, (err, stats) => {
                if (err || !stats.isFile()) {
                    // File doesn't exist - send 404 once
                    if (!res.headersSent) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('File not found');
                    }
                    return;
                }
                // File exists - serve it through node-static
                const serve = () => {
                    fileServer.serve(req, res, (err) => {
                        if (err && !res.headersSent) {
                            res.writeHead(err.status || 500);
                            res.end(err.message);
                        }
                    });
                };
                // Ensure we don't double-serve
                if (!res.headersSent) {
                    serve();
                }
            });
        });
    });
    req.resume();
});
server.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
    console.log('Serving files from:', process.cwd());
});
server.on('error', (err) => {
    console.error('Server error:', err);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});
