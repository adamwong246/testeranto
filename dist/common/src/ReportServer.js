"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReportServerLib_1 = require("./ReportServerLib");
const server_1 = require("../design-editor/server");
const port = process.argv[2] || 3000;
const wssPort = Number(port) + 1; // Use next port for WebSocket
// Start both servers
(0, ReportServerLib_1.ReportServerOfPort)(port);
(0, server_1.startDesignEditorServer)(wssPort);
console.log(`Report server running on http://localhost:${port}`);
console.log(`Design editor WebSocket running on ws://localhost:${wssPort}`);
