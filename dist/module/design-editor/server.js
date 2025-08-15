/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocketServer } from "ws";
import fs from "fs";
import path from "path";
const projects = new Map();
export function startDesignEditorServer(wssPort, httpPort) {
    const wss = new WebSocketServer({ port: wssPort });
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
    const designsDir = path.join(process.cwd(), "designs");
    const filePath = path.join(designsDir, `${projectId}.json`);
    try {
        const data = fs.readFileSync(filePath, "utf-8");
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
    const designsDir = path.join(process.cwd(), "designs");
    if (!fs.existsSync(designsDir)) {
        fs.mkdirSync(designsDir, { recursive: true });
    }
    const filePath = path.join(designsDir, `${projectId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(design, null, 2));
}
