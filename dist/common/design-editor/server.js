"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDesignEditorServer = startDesignEditorServer;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const ws_1 = require("ws");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const projects = new Map();
function startDesignEditorServer(wssPort, httpPort) {
    const wss = new ws_1.WebSocketServer({ port: wssPort });
    wss.on("connection", (ws, req) => {
        // Create URL from request URL and host header
        const url = new URL(req.url || "", `http://${req.headers.host}`);
        const projectId = url.searchParams.get("project") || "default";
        if (!projects.has(projectId)) {
            projects.set(projectId, {
                connections: new Set(),
                design: loadDesign(projectId),
            });
        }
        const project = projects.get(projectId);
        project.connections.add(ws);
        // Send current design to new collaborator
        ws.send(JSON.stringify({
            type: "design_update",
            data: project.design,
        }));
        broadcastCollaborators(projectId);
        ws.on("message", (message) => {
            const data = JSON.parse(message);
            if (data.type === "design_update") {
                project.design = data.data;
                saveDesign(projectId, data.data);
                broadcastToProject(projectId, message.toString());
            }
        });
        ws.on("close", (code, reason) => {
            project.connections.delete(ws);
            if (project.connections.size === 0) {
                projects.delete(projectId);
            }
            else {
                broadcastCollaborators(projectId);
            }
        });
    });
    console.log(`Design editor WebSocket server running on port ${wssPort}`);
}
function broadcastToProject(projectId, message) {
    const project = projects.get(projectId);
    if (project) {
        project.connections.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(message);
            }
        });
    }
}
function broadcastCollaborators(projectId) {
    const project = projects.get(projectId);
    if (project) {
        const collaborators = Array.from(project.connections).map((_, i) => ({
            id: `user-${i}`,
            name: `Collaborator ${i + 1}`,
        }));
        broadcastToProject(projectId, JSON.stringify({
            type: "collaborators_update",
            data: collaborators,
        }));
    }
}
function loadDesign(projectId) {
    const designsDir = path_1.default.join(process.cwd(), "designs");
    const filePath = path_1.default.join(designsDir, `${projectId}.json`);
    try {
        const data = fs_1.default.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
    }
    catch (_a) {
        return {
            version: "1.0",
            background: "#ffffff",
            objects: [],
        };
    }
}
function saveDesign(projectId, design) {
    const designsDir = path_1.default.join(process.cwd(), "designs");
    if (!fs_1.default.existsSync(designsDir)) {
        fs_1.default.mkdirSync(designsDir, { recursive: true });
    }
    const filePath = path_1.default.join(designsDir, `${projectId}.json`);
    fs_1.default.writeFileSync(filePath, JSON.stringify(design, null, 2));
}
