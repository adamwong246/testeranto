import { ReportServerOfPort } from "./ReportServerLib";
import { startDesignEditorServer } from "../design-editor/server";
const port = process.argv[2] || 3000;
const wssPort = Number(port) + 1; // Use next port for WebSocket
// Start both servers
ReportServerOfPort(port);
startDesignEditorServer(wssPort);
console.log(`Report server running on http://localhost:${port}`);
console.log(`Design editor WebSocket running on ws://localhost:${wssPort}`);
