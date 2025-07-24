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
          if (!res.headersSent) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("File not found");
          }
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
