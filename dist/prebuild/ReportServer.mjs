import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/ReportServerLib.ts
import staticServer from "node-static";
import http from "http";
import path from "path";
import fs from "fs";
var fileServer = new staticServer.Server("./", {
  cache: false,
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0"
  }
});
var server = http.createServer((req, res) => {
  let responded = false;
  const safeResponse = (handler) => {
    if (responded)
      return;
    responded = true;
    try {
      handler();
    } catch (err) {
      console.error("Error handling request:", err);
      if (!res.headersSent) {
        res.writeHead(500);
      }
      res.end("Internal Server Error");
    }
  };
  req.on("error", (err) => {
    console.error("Request error:", err);
    safeResponse(() => {
      if (!res.headersSent) {
        res.writeHead(400);
      }
      res.end("Bad Request");
    });
  });
  req.on("end", () => {
    safeResponse(() => {
      const filePath = path.join(process.cwd(), req.url || "");
      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          fs.stat(filePath, (dirErr, dirStats) => {
            if (!dirErr && dirStats.isDirectory()) {
              fs.readdir(filePath, (readErr, files) => {
                if (readErr) {
                  res.writeHead(500);
                  return res.end("Error reading directory");
                }
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(`
                  <html>
                    <head>
                      <title>Directory Listing: ${req.url}</title>
                      <style>
                        body { font-family: sans-serif; margin: 2rem; }
                        h1 { color: #333; }
                        ul { list-style: none; padding: 0; }
                        li { padding: 0.5rem; }
                        li a { color: #0366d6; text-decoration: none; }
                        li a:hover { text-decoration: underline; }
                      </style>
                    </head>
                    <body>
                      <h1>Directory: ${req.url}</h1>
                      <ul>
                        ${files.map(
                  (file) => `
                          <li>
                            <a href="${path.join(req.url || "", file)}">
                              ${file}${file.endsWith("/") ? "/" : ""}
                            </a>
                          </li>
                        `
                ).join("")}
                      </ul>
                    </body>
                  </html>
                `);
                res.end();
              });
            } else {
              if (!res.headersSent) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("File not found");
              }
            }
          });
          return;
        }
        const serve = () => {
          fileServer.serve(req, res, (err2) => {
            if (err2 && !res.headersSent) {
              res.writeHead(err2.status || 500);
              res.end(err2.message);
            }
          });
        };
        if (!res.headersSent) {
          serve();
        }
      });
    });
  });
  req.resume();
});
server.on("error", (err) => {
  console.error("Server error:", err);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});
var start = (port2) => {
  if (port2) {
    server.listen(port2, () => {
      console.log(`Server running on http://localhost:${port2}`);
      console.log("Serving files from:", process.cwd());
    });
  } else {
    console.log("you need to specify a port");
  }
};
var ReportServerOfPort = (port2) => start(port2);

// design-editor/server.ts
import { WebSocketServer } from "ws";
import fs2 from "fs";
import path2 from "path";
var projects = /* @__PURE__ */ new Map();
function startDesignEditorServer(wssPort2, httpPort) {
  const wss = new WebSocketServer({ port: wssPort2 });
  wss.on("connection", (ws, req) => {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const projectId = url.searchParams.get("project") || "default";
    if (!projects.has(projectId)) {
      projects.set(projectId, {
        connections: /* @__PURE__ */ new Set(),
        design: loadDesign(projectId)
      });
    }
    const project = projects.get(projectId);
    project.connections.add(ws);
    ws.send(
      JSON.stringify({
        type: "design_update",
        data: project.design
      })
    );
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
      } else {
        broadcastCollaborators(projectId);
      }
    });
  });
  console.log(`Design editor WebSocket server running on port ${wssPort2}`);
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
      name: `Collaborator ${i + 1}`
    }));
    broadcastToProject(
      projectId,
      JSON.stringify({
        type: "collaborators_update",
        data: collaborators
      })
    );
  }
}
function loadDesign(projectId) {
  const designsDir = path2.join(process.cwd(), "designs");
  const filePath = path2.join(designsDir, `${projectId}.json`);
  try {
    const data = fs2.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      version: "1.0",
      background: "#ffffff",
      objects: []
    };
  }
}
function saveDesign(projectId, design) {
  const designsDir = path2.join(process.cwd(), "designs");
  if (!fs2.existsSync(designsDir)) {
    fs2.mkdirSync(designsDir, { recursive: true });
  }
  const filePath = path2.join(designsDir, `${projectId}.json`);
  fs2.writeFileSync(filePath, JSON.stringify(design, null, 2));
}

// src/ReportServer.ts
var port = process.argv[2] || 3e3;
var wssPort = Number(port) + 1;
ReportServerOfPort(port);
startDesignEditorServer(wssPort);
console.log(`Report server running on http://localhost:${port}`);
console.log(`Design editor WebSocket running on ws://localhost:${wssPort}`);
