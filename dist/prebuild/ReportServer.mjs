import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/ReportServer.ts
import staticServer from "node-static";
import http from "http";
import path from "path";
import fs from "fs";
var fileServer = new staticServer.Server("./", {
  cache: false,
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
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
                        ${files.map((file) => `
                          <li>
                            <a href="${path.join(req.url || "", file)}">
                              ${file}${file.endsWith("/") ? "/" : ""}
                            </a>
                          </li>
                        `).join("")}
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
server.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
  console.log("Serving files from:", process.cwd());
});
server.on("error", (err) => {
  console.error("Server error:", err);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});
