/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ChildProcess, spawn } from "node:child_process";
import ansiColors from "ansi-colors";
import net from "net";
import fs, { watch } from "fs";
import path from "path";
import puppeteer, { ConsoleMessage, executablePath } from "puppeteer-core";
import ansiC from "ansi-colors";
import { WebSocketServer } from "ws";
import http from "http";
import url from "url";
import mime from "mime-types";

import { IFinalResults, ITTestResourceConfiguration } from "../lib/index.js";
import { getRunnables, webEvaluator } from "../utils";
import { IBuiltConfig, IRunTime } from "../Types.js";
import { Queue } from "../utils/queue.js";

import { PM_WithEslintAndTsc } from "./PM_WithEslintAndTsc.js";
import {
  fileHash,
  createLogStreams,
  IOutputs,
  statusMessagePretty,
  filesHash,
  isValidUrl,
  pollForFile,
  writeFileAndCreateDir,
  puppeteerConfigs,
} from "./utils.js";
import {
  FileStatus,
  FileChange,
  RemoteStatus,
} from "../services/FileService.js";

const changes: Record<string, string> = {};
const fileHashes = {};
const files: Record<string, Set<string>> = {};
const screenshots: Record<string, Promise<Uint8Array>[]> = {};

export abstract class PM_WithGit extends PM_WithEslintAndTsc {
  // pureSidecars: Record<number, Sidecar>;
  // nodeSidecars: Record<number, ChildProcess>;
  // webSidecars: Record<number, Page>;
  // sidecars: Record<number, any> = {};
  launchers: Record<string, () => void>;

  clients: Set<any> = new Set();

  runningProcesses: Map<string, ChildProcess> = new Map();
  processLogs: Map<string, string[]> = new Map();
  gitWatchTimeout: NodeJS.Timeout | null = null;
  gitWatcher: any = null;

  constructor(configs: IBuiltConfig, name: string, mode: "once" | "dev") {
    super(configs, name, mode);
  }

  // this method is so horrible. Don't drink and vibe-code kids
  requestHandler(req: http.IncomingMessage, res: http.ServerResponse) {
    const parsedUrl = url.parse(req.url || "/");
    let pathname = parsedUrl.pathname || "/";

    // Handle Git API endpoints
    if (pathname?.startsWith("/api/git/")) {
      this.handleGitApi(req, res);
      return;
    }

    if (pathname === "/") {
      pathname = "/index.html";
    }

    let filePath = pathname.substring(1);

    // Determine which directory to serve from
    if (filePath.startsWith("reports/")) {
      filePath = `testeranto/${filePath}`;
    } else if (filePath.startsWith("metafiles/")) {
      filePath = `testeranto/${filePath}`;
    } else if (filePath === "projects.json") {
      filePath = `testeranto/${filePath}`;
    } else {
      // For frontend assets, try multiple possible locations
      // First, try the dist directory
      const possiblePaths = [
        `dist/${filePath}`,
        `testeranto/dist/${filePath}`,
        `../dist/${filePath}`,
        `./${filePath}`,
      ];

      // Find the first existing file
      let foundPath = null;
      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          foundPath = possiblePath;
          break;
        }
      }

      if (foundPath) {
        filePath = foundPath;
      } else {
        // If no file found, serve index.html for SPA routing
        const indexPath = this.findIndexHtml();
        if (indexPath) {
          fs.readFile(indexPath, (err, data) => {
            if (err) {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end("404 Not Found");
              return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
          });
          return;
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
          return;
        }
      }
    }

    // Check if file exists
    fs.exists(filePath, (exists) => {
      if (!exists) {
        // For SPA routing, serve index.html if the path looks like a route
        if (!pathname.includes(".") && pathname !== "/") {
          const indexPath = this.findIndexHtml();
          if (indexPath) {
            fs.readFile(indexPath, (err, data) => {
              if (err) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 Not Found");
                return;
              }
              res.writeHead(200, { "Content-Type": "text/html" });
              res.end(data);
            });
            return;
          } else {
            // Serve a simple message if index.html is not found
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`
              <html>
                <body>
                  <h1>Testeranto is running</h1>
                  <p>Frontend files are not built yet. Run 'npm run build' to build the frontend.</p>
                </body>
              </html>
            `);
            return;
          }
        }
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
        return;
      }

      // Read and serve the file
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("500 Internal Server Error");
          return;
        }

        // Get MIME type
        const mimeType = mime.lookup(filePath) || "application/octet-stream";
        res.writeHead(200, { "Content-Type": mimeType });
        res.end(data);
      });
    });
  }

  // this method is also horrible
  private handleGitApi(req: http.IncomingMessage, res: http.ServerResponse) {
    const parsedUrl = url.parse(req.url || "/");
    const pathname = parsedUrl.pathname || "/";

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    try {
      if (pathname === "/api/git/changes" && req.method === "GET") {
        this.handleGitChanges(req, res);
      } else if (pathname === "/api/git/status" && req.method === "GET") {
        this.handleGitFileStatus(req, res);
      } else if (pathname === "/api/git/commit" && req.method === "POST") {
        this.handleGitCommit(req, res);
      } else if (pathname === "/api/git/push" && req.method === "POST") {
        this.handleGitPush(req, res);
      } else if (pathname === "/api/git/pull" && req.method === "POST") {
        this.handleGitPull(req, res);
      } else if (pathname === "/api/git/branch" && req.method === "GET") {
        this.handleGitBranch(req, res);
      } else if (
        pathname === "/api/git/remote-status" &&
        req.method === "GET"
      ) {
        this.handleGitRemoteStatus(req, res);
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not found" }));
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  }

  private async handleGitChanges(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    try {
      const changes = await this.getGitChanges();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(changes));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to get changes" }));
    }
  }

  private async handleGitFileStatus(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    const parsedUrl = url.parse(req.url || "/");
    const query = parsedUrl.query || "";
    const params = new URLSearchParams(query);
    const path = params.get("path");

    if (!path) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Path parameter required" }));
      return;
    }

    try {
      const status = await this.getGitFileStatus(path);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(status));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to get file status" }));
    }
  }

  private async handleGitCommit(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { message, description } = JSON.parse(body);
        await this.executeGitCommit(message, description);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to commit" }));
      }
    });
  }

  private async handleGitPush(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    try {
      await this.executeGitPush();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to push" }));
    }
  }

  private async handleGitPull(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    try {
      await this.executeGitPull();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to pull" }));
    }
  }

  private async handleGitBranch(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    try {
      const branch = await this.getCurrentGitBranch();
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(branch);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to get branch" }));
    }
  }

  private async handleGitRemoteStatus(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    try {
      const status = await this.getGitRemoteStatus();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(status));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to get remote status" }));
    }
  }

  private async getGitFileStatus(path: string): Promise<FileStatus> {
    try {
      const changes = await this.getGitChanges();
      const fileChange = changes.find((change) => change.path === path);

      if (fileChange) {
        return { status: fileChange.status };
      }
      return { status: "unchanged" };
    } catch (error) {
      console.error("Failed to get file status:", error);
      return { status: "unchanged" };
    }
  }

  private async executeGitCommit(
    message: string,
    description?: string
  ): Promise<void> {
    try {
      const { exec } = await import("child_process");

      const fullMessage = description
        ? `${message}\n\n${description}`
        : message;

      return new Promise((resolve, reject) => {
        // Stage all changes first
        exec("git add -A", { cwd: process.cwd() }, (error) => {
          if (error) {
            reject(new Error(`Failed to stage changes: ${error.message}`));
            return;
          }

          // Commit with message
          const commitCommand = `git commit -m "${fullMessage.replace(
            /"/g,
            '\\"'
          )}"`;
          exec(commitCommand, { cwd: process.cwd() }, (commitError) => {
            if (commitError) {
              reject(new Error(`Failed to commit: ${commitError.message}`));
              return;
            }

            resolve();
          });
        });
      });
    } catch (error) {
      throw new Error(
        `Failed to execute commit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private async executeGitPush(): Promise<void> {
    try {
      const { exec } = await import("child_process");

      return new Promise((resolve, reject) => {
        exec("git push", { cwd: process.cwd() }, (error) => {
          if (error) {
            reject(new Error(`Failed to push: ${error.message}`));
            return;
          }
          resolve();
        });
      });
    } catch (error) {
      throw new Error(
        `Failed to execute push: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private async executeGitPull(): Promise<void> {
    try {
      const { exec } = await import("child_process");

      return new Promise((resolve, reject) => {
        exec("git pull", { cwd: process.cwd() }, (error) => {
          if (error) {
            reject(new Error(`Failed to pull: ${error.message}`));
            return;
          }
          resolve();
        });
      });
    } catch (error) {
      throw new Error(
        `Failed to execute pull: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // private async sendInitialState(ws: WebSocket) {
  //   try {
  //     const changes = await this.getGitChanges();
  //     const status = await this.getGitRemoteStatus();
  //     const branch = await this.getCurrentGitBranch();

  //     ws.send(JSON.stringify({ type: "changes", changes }));
  //     ws.send(JSON.stringify({ type: "status", status }));
  //     ws.send(JSON.stringify({ type: "branch", branch }));
  //   } catch (error) {
  //     console.error("Error sending initial state:", error);
  //     ws.send(
  //       JSON.stringify({
  //         type: "error",
  //         message: "Failed to get Git status",
  //       })
  //     );
  //   }
  // }

  // private async refreshGitStatus() {
  //   try {
  //     const changes = await this.getGitChanges();
  //     const status = await this.getGitRemoteStatus();
  //     const branch = await this.getCurrentGitBranch();

  //     this.broadcast({ type: "changes", changes });
  //     this.broadcast({ type: "status", status });
  //     this.broadcast({ type: "branch", branch });
  //   } catch (error) {
  //     console.error("Error refreshing Git status:", error);
  //   }
  // }

  onBuildDone(): void {
    console.log("Build processes completed");
    // The builds are done, which means the files are ready to be watched
    // This matches the original behavior where builds completed before PM_Main started

    // Start Git watcher for development mode
    this.startGitWatcher();
  }

  private async startGitWatcher() {
    console.log("Starting Git watcher for real-time updates");

    // Watch for file system changes in the current directory
    const watcher = (await import("fs")).watch(
      process.cwd(),
      { recursive: true },
      async (eventType, filename) => {
        if (filename && !filename.includes(".git")) {
          try {
            // Debounce the Git status check
            clearTimeout(this.gitWatchTimeout);
            this.gitWatchTimeout = setTimeout(async () => {
              const changes = await this.getGitChanges();
              const status = await this.getGitRemoteStatus();
              const branch = await this.getCurrentGitBranch();

              this.broadcast({ type: "changes", changes });
              this.broadcast({ type: "status", status });
              this.broadcast({ type: "branch", branch });
            }, 500); // Wait 500ms after last change
          } catch (error) {
            console.error("Error checking Git status:", error);
          }
        }
      }
    );

    // Also set up a periodic check in case file watching misses something
    setInterval(async () => {
      try {
        const changes = await this.getGitChanges();
        const status = await this.getGitRemoteStatus();
        const branch = await this.getCurrentGitBranch();

        this.broadcast({ type: "changes", changes });
        this.broadcast({ type: "status", status });
        this.broadcast({ type: "branch", branch });
      } catch (error) {
        console.error("Error checking Git status:", error);
      }
    }, 10000); // Check every 10 seconds as a fallback

    this.gitWatcher = watcher;
  }

  private async getGitChanges(): Promise<FileChange[]> {
    try {
      // Use git status --porcelain to get machine-readable output
      const { exec } = await import("child_process");

      return new Promise((resolve, reject) => {
        exec(
          "git status --porcelain",
          { cwd: process.cwd() },
          (error, stdout, stderr) => {
            if (error) {
              console.error("Error getting git changes:", error);
              resolve([]);
              return;
            }

            const changes: FileChange[] = [];
            const lines = stdout.trim().split("\n");

            for (const line of lines) {
              if (!line.trim()) continue;

              // Parse git status output (XY PATH)
              const status = line.substring(0, 2).trim();
              const path = line.substring(3).trim();

              let fileStatus: FileChange["status"] = "unchanged";

              if (status.startsWith("M")) {
                fileStatus = "modified";
              } else if (status.startsWith("A")) {
                fileStatus = "added";
              } else if (status.startsWith("D")) {
                fileStatus = "deleted";
              } else if (status.startsWith("U") || status.includes("U")) {
                fileStatus = "conflicted";
              } else if (status.startsWith("??")) {
                fileStatus = "added";
              }

              if (fileStatus !== "unchanged") {
                changes.push({
                  path,
                  status: fileStatus,
                });
              }
            }

            resolve(changes);
          }
        );
      });
    } catch (error) {
      console.error("Failed to get git changes:", error);
      return [];
    }
  }

  private async getGitRemoteStatus(): Promise<RemoteStatus> {
    try {
      const { exec } = await import("child_process");

      return new Promise((resolve) => {
        // Get ahead/behind status for current branch
        exec(
          "git rev-list --left-right --count HEAD...@{u}",
          { cwd: process.cwd() },
          (error, stdout, stderr) => {
            if (error) {
              // If there's no upstream branch, return 0 for both
              resolve({ ahead: 0, behind: 0 });
              return;
            }

            const [behind, ahead] = stdout.trim().split("\t").map(Number);
            resolve({ ahead, behind });
          }
        );
      });
    } catch (error) {
      console.error("Failed to get remote status:", error);
      return { ahead: 0, behind: 0 };
    }
  }

  private async getCurrentGitBranch(): Promise<string> {
    try {
      const { exec } = await import("child_process");

      return new Promise((resolve) => {
        exec(
          "git branch --show-current",
          { cwd: process.cwd() },
          (error, stdout, stderr) => {
            if (error) {
              console.error("Error getting current branch:", error);
              resolve("main");
              return;
            }

            resolve(stdout.trim() || "main");
          }
        );
      });
    } catch (error) {
      console.error("Failed to get current branch:", error);
      return "main";
    }
  }
}
