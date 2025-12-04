"use strict";
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// /* eslint-disable no-async-promise-executor */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// const { exec } = await import("child_process");
// import fs from "fs";
// import url from "url";
// import http from "http";
// import { IBuiltConfig } from "../../Types.js";
// import { PM_WithEslintAndTsc } from "./PM_WithEslintAndTsc.js";
// import { FileStatus, FileChange, RemoteStatus } from "../FileService.js";
// export abstract class PM_WithGit extends PM_WithEslintAndTsc {
//   gitWatchTimeout: NodeJS.Timeout | null = null;
//   gitWatcher: any = null;
//   constructor(configs: IBuiltConfig, name, mode) {
//     super(configs, name, mode);
//   }
//   // Override requestHandler to add Git-specific endpoints
//   //   httpRequest(req: http.IncomingMessage, res: http.ServerResponse) {
//   //     const parsedUrl = url.parse(req.url || "/");
//   //     const pathname = parsedUrl.pathname || "/";
//   //     // Handle Git API endpoints
//   //     if (pathname?.startsWith("/api/git/")) {
//   //       // this.handleGitApi(req, res);
//   //       return;
//   //     }
//   //     if (pathname === "/api/auth/github/token" && req.method === "POST") {
//   //       this.handleGitHubTokenExchange(req, res);
//   //       return;
//   //     }
//   //     // Handle GitHub OAuth callback
//   //     if (pathname === "/auth/github/callback") {
//   //       // Serve the callback HTML page
//   //       const callbackHtml = `
//   // <!DOCTYPE html>
//   // <html>
//   // <head>
//   //     <title>GitHub Authentication - Testeranto</title>
//   //     <script>
//   //         // Extract the code from the URL and send it to the parent window
//   //         const urlParams = new URLSearchParams(window.location.search);
//   //         const code = urlParams.get('code');
//   //         const error = urlParams.get('error');
//   //         if (code) {
//   //             window.opener.postMessage({ type: 'github-auth-callback', code }, '*');
//   //         } else if (error) {
//   //             window.opener.postMessage({ type: 'github-auth-error', error }, '*');
//   //         }
//   //         window.close();
//   //     </script>
//   // </head>
//   // <body>
//   //     <p>Completing authentication...</p>
//   // </body>
//   // </html>`;
//   //       res.writeHead(200, { "Content-Type": "text/html" });
//   //       res.end(callbackHtml);
//   //       return;
//   //     }
//   //     // Call the parent class's requestHandler for all other requests
//   //     // super.httpRequest(req, res);
//   //   }
//   // this method is also horrible
//   // private handleGitApi(req: http.IncomingMessage, res: http.ServerResponse) {
//   //   const parsedUrl = url.parse(req.url || "/");
//   //   const pathname = parsedUrl.pathname || "/";
//   //   // Set CORS headers
//   //   res.setHeader("Access-Control-Allow-Origin", "*");
//   //   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   //   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   //   if (req.method === "OPTIONS") {
//   //     res.writeHead(200);
//   //     res.end();
//   //     return;
//   //   }
//   //   try {
//   //     if (pathname === "/api/git/changes" && req.method === "GET") {
//   //       this.handleGitChanges(req, res);
//   //     } else if (pathname === "/api/git/status" && req.method === "GET") {
//   //       this.handleGitFileStatus(req, res);
//   //     } else if (pathname === "/api/git/commit" && req.method === "POST") {
//   //       this.handleGitCommit(req, res);
//   //     } else if (pathname === "/api/git/push" && req.method === "POST") {
//   //       this.handleGitPush(req, res);
//   //     } else if (pathname === "/api/git/pull" && req.method === "POST") {
//   //       this.handleGitPull(req, res);
//   //     } else if (pathname === "/api/git/branch" && req.method === "GET") {
//   //       this.handleGitBranch(req, res);
//   //     } else if (
//   //       pathname === "/api/git/remote-status" &&
//   //       req.method === "GET"
//   //     ) {
//   //       this.handleGitRemoteStatus(req, res);
//   //     } else {
//   //       res.writeHead(404, { "Content-Type": "application/json" });
//   //       res.end(JSON.stringify({ error: "Not found" }));
//   //     }
//   //   } catch (error) {
//   //     res.writeHead(500, { "Content-Type": "application/json" });
//   //     res.end(JSON.stringify({ error: "Internal server error" }));
//   //   }
//   // }
//   private async handleGitChanges(
//     req: http.IncomingMessage,
//     res: http.ServerResponse
//   ) {
//     try {
//       const changes = await this.getGitChanges();
//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.end(JSON.stringify(changes));
//     } catch (error) {
//       res.writeHead(500, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ error: "Failed to get changes" }));
//     }
//   }
//   private async handleGitFileStatus(
//     req: http.IncomingMessage,
//     res: http.ServerResponse
//   ) {
//     const parsedUrl = url.parse(req.url || "/");
//     const query = parsedUrl.query || "";
//     const params = new URLSearchParams(query);
//     const path = params.get("path");
//     if (!path) {
//       res.writeHead(400, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ error: "Path parameter required" }));
//       return;
//     }
//     try {
//       const status = await this.getGitFileStatus(path);
//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.end(JSON.stringify(status));
//     } catch (error) {
//       res.writeHead(500, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ error: "Failed to get file status" }));
//     }
//   }
//   private async handleGitCommit(
//     req: http.IncomingMessage,
//     res: http.ServerResponse
//   ) {
//     let body = "";
//     req.on("data", (chunk) => {
//       body += chunk.toString();
//     });
//     req.on("end", async () => {
//       try {
//         const { message, description } = JSON.parse(body);
//         await this.executeGitCommit(message, description);
//         res.writeHead(200, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({ success: true }));
//       } catch (error) {
//         res.writeHead(500, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({ error: "Failed to commit" }));
//       }
//     });
//   }
//   private async handleGitPush(
//     req: http.IncomingMessage,
//     res: http.ServerResponse
//   ) {
//     try {
//       await this.executeGitPush();
//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ success: true }));
//     } catch (error) {
//       res.writeHead(500, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ error: "Failed to push" }));
//     }
//   }
//   private async handleGitPull(
//     req: http.IncomingMessage,
//     res: http.ServerResponse
//   ) {
//     try {
//       await this.executeGitPull();
//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ success: true }));
//     } catch (error) {
//       res.writeHead(500, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ error: "Failed to pull" }));
//     }
//   }
//   private async handleGitBranch(
//     req: http.IncomingMessage,
//     res: http.ServerResponse
//   ) {
//     try {
//       const branch = await this.getCurrentGitBranch();
//       res.writeHead(200, { "Content-Type": "text/plain" });
//       res.end(branch);
//     } catch (error) {
//       res.writeHead(500, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ error: "Failed to get branch" }));
//     }
//   }
//   private async handleGitHubTokenExchange(
//     req: http.IncomingMessage,
//     res: http.ServerResponse
//   ) {
//     let body = "";
//     req.on("data", (chunk) => {
//       body += chunk.toString();
//     });
//     req.on("end", async () => {
//       try {
//         const { code } = JSON.parse(body);
//         // Exchange code for access token
//         const tokenResponse = await fetch(
//           "https://github.com/login/oauth/access_token",
//           {
//             method: "POST",
//             headers: {
//               Accept: "application/json",
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               client_id: process.env.GITHUB_CLIENT_ID,
//               client_secret: process.env.GITHUB_CLIENT_SECRET,
//               code,
//             }),
//           }
//         );
//         const tokenData = await tokenResponse.json();
//         if (tokenData.error) {
//           res.writeHead(400, { "Content-Type": "application/json" });
//           res.end(JSON.stringify({ error: tokenData.error_description }));
//           return;
//         }
//         res.writeHead(200, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({ access_token: tokenData.access_token }));
//       } catch (error) {
//         res.writeHead(500, { "Content-Type": "application/json" });
//         res.end(JSON.stringify({ error: "Failed to exchange token" }));
//       }
//     });
//   }
//   private async handleGitRemoteStatus(
//     req: http.IncomingMessage,
//     res: http.ServerResponse
//   ) {
//     try {
//       const status = await this.getGitRemoteStatus();
//       res.writeHead(200, { "Content-Type": "application/json" });
//       res.end(JSON.stringify(status));
//     } catch (error) {
//       res.writeHead(500, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ error: "Failed to get remote status" }));
//     }
//   }
//   private async getGitFileStatus(path: string): Promise<FileStatus> {
//     try {
//       const changes = await this.getGitChanges();
//       const fileChange = changes.find((change) => change.path === path);
//       if (fileChange) {
//         return { status: fileChange.status };
//       }
//       return { status: "unchanged" };
//     } catch (error) {
//       console.error("Failed to get file status:", error);
//       return { status: "unchanged" };
//     }
//   }
//   private async executeGitCommit(
//     message: string,
//     description?: string
//   ): Promise<void> {
//     try {
//       const fullMessage = description
//         ? `${message}\n\n${description}`
//         : message;
//       return new Promise((resolve, reject) => {
//         // Stage all changes first
//         exec("git add -A", { cwd: process.cwd() }, (error) => {
//           if (error) {
//             reject(new Error(`Failed to stage changes: ${error.message}`));
//             return;
//           }
//           // Commit with message
//           const commitCommand = `git commit -m "${fullMessage.replace(
//             /"/g,
//             '\\"'
//           )}"`;
//           exec(commitCommand, { cwd: process.cwd() }, (commitError) => {
//             if (commitError) {
//               reject(new Error(`Failed to commit: ${commitError.message}`));
//               return;
//             }
//             resolve();
//           });
//         });
//       });
//     } catch (error) {
//       throw new Error(
//         `Failed to execute commit: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//     }
//   }
//   private async executeGitPush(): Promise<void> {
//     try {
//       return new Promise((resolve, reject) => {
//         exec("git push", { cwd: process.cwd() }, (error) => {
//           if (error) {
//             reject(new Error(`Failed to push: ${error.message}`));
//             return;
//           }
//           resolve();
//         });
//       });
//     } catch (error) {
//       throw new Error(
//         `Failed to execute push: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//     }
//   }
//   private async executeGitPull(): Promise<void> {
//     try {
//       return new Promise((resolve, reject) => {
//         exec("git pull", { cwd: process.cwd() }, (error) => {
//           if (error) {
//             reject(new Error(`Failed to pull: ${error.message}`));
//             return;
//           }
//           resolve();
//         });
//       });
//     } catch (error) {
//       throw new Error(
//         `Failed to execute pull: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//     }
//   }
//   // private async sendInitialState(ws: WebSocket) {
//   //   try {
//   //     const changes = await this.getGitChanges();
//   //     const status = await this.getGitRemoteStatus();
//   //     const branch = await this.getCurrentGitBranch();
//   //     ws.send(JSON.stringify({ type: "changes", changes }));
//   //     ws.send(JSON.stringify({ type: "status", status }));
//   //     ws.send(JSON.stringify({ type: "branch", branch }));
//   //   } catch (error) {
//   //     console.error("Error sending initial state:", error);
//   //     ws.send(
//   //       JSON.stringify({
//   //         type: "error",
//   //         message: "Failed to get Git status",
//   //       })
//   //     );
//   //   }
//   // }
//   // private async refreshGitStatus() {
//   //   try {
//   //     const changes = await this.getGitChanges();
//   //     const status = await this.getGitRemoteStatus();
//   //     const branch = await this.getCurrentGitBranch();
//   //     this.broadcast({ type: "changes", changes });
//   //     this.broadcast({ type: "status", status });
//   //     this.broadcast({ type: "branch", branch });
//   //   } catch (error) {
//   //     console.error("Error refreshing Git status:", error);
//   //   }
//   // }
//   onBuildDone(): void {
//     console.log("Build processes completed");
//     // The builds are done, which means the files are ready to be watched
//     // This matches the original behavior where builds completed before PM_Main started
//     // Start Git watcher for development mode
//     this.startGitWatcher();
//   }
//   async startGitWatcher() {
//     console.log("Starting Git watcher for real-time updates");
//     // Watch for file system changes in the current directory
//     const watcher = fs.watch(
//       process.cwd(),
//       { recursive: true },
//       async (eventType, filename) => {
//         if (filename && !filename.includes(".git")) {
//           try {
//             // Debounce the Git status check
//             clearTimeout(this.gitWatchTimeout);
//             this.gitWatchTimeout = setTimeout(async () => {
//               const changes = await this.getGitChanges();
//               const status = await this.getGitRemoteStatus();
//               const branch = await this.getCurrentGitBranch();
//               this.webSocketBroadcastMessage({ type: "changes", changes });
//               this.webSocketBroadcastMessage({ type: "status", status });
//               this.webSocketBroadcastMessage({ type: "branch", branch });
//               // Broadcast file system changes, but only if not ignored
//               if (filename) {
//                 // Check if the file should be ignored
//                 const ignorePatterns = this.configs?.ignore || [];
//                 const shouldIgnore = ignorePatterns.some((pattern) => {
//                   // Convert glob pattern to regex
//                   let regexPattern = pattern
//                     .replace(/\./g, "\\.")
//                     .replace(/\*\*/g, ".*")
//                     .replace(/\*/g, "[^/]*")
//                     .replace(/\?/g, "[^/]");
//                   if (!regexPattern.startsWith("^"))
//                     regexPattern = "^" + regexPattern;
//                   if (!regexPattern.endsWith("$"))
//                     regexPattern = regexPattern + "$";
//                   const regex = new RegExp(regexPattern);
//                   return regex.test(filename);
//                 });
//                 if (!shouldIgnore) {
//                   // Get the updated file content
//                   try {
//                     const fullPath = `${process.cwd()}/${filename}`;
//                     if (fs.existsSync(fullPath)) {
//                       const content = await fs.promises.readFile(
//                         fullPath,
//                         "utf-8"
//                       );
//                       this.webSocketBroadcastMessage({
//                         type: "fileChanged",
//                         path: filename,
//                         content,
//                         eventType,
//                       });
//                     }
//                   } catch (error) {
//                     console.error("Error reading changed file:", error);
//                   }
//                 }
//               }
//             }, 500); // Wait 500ms after last change
//           } catch (error) {
//             console.error("Error checking Git status:", error);
//           }
//         }
//       }
//     );
//     // Also set up a periodic check in case file watching misses something
//     setInterval(async () => {
//       try {
//         const changes = await this.getGitChanges();
//         const status = await this.getGitRemoteStatus();
//         const branch = await this.getCurrentGitBranch();
//         this.webSocketBroadcastMessage({ type: "changes", changes });
//         this.webSocketBroadcastMessage({ type: "status", status });
//         this.webSocketBroadcastMessage({ type: "branch", branch });
//       } catch (error) {
//         console.error("Error checking Git status:", error);
//       }
//     }, 10000); // Check every 10 seconds as a fallback
//     this.gitWatcher = watcher;
//   }
//   private async getGitChanges(): Promise<FileChange[]> {
//     try {
//       // Use git status --porcelain to get machine-readable output
//       return new Promise((resolve, reject) => {
//         // console.log("Current working directory:", process.cwd());
//         exec(
//           "git status --porcelain=v1",
//           { cwd: process.cwd() },
//           async (error, stdout, stderr) => {
//             if (stderr) {
//               // console.error("Git stderr:", stderr);
//             }
//             if (error) {
//               // console.error("Error getting git changes:", error);
//               resolve([]);
//               return;
//             }
//             // console.log("Raw git status output:", stdout);
//             const changes: FileChange[] = [];
//             const lines = stdout.trim().split("\n");
//             for (const line of lines) {
//               // console.log("Processing git status line:", JSON.stringify(line));
//               if (!line.trim()) continue;
//               // Parse git status output using a more reliable approach
//               // The format is always: XY PATH (exactly two status characters, space, then path)
//               // Use a regex to match the pattern
//               const match = line.match(/^(.{2}) (.*)$/);
//               if (!match) {
//                 // console.warn("Could not parse git status line:", line);
//                 continue;
//               }
//               const status = match[1];
//               let path = match[2];
//               // Handle renames which look like: R  ORIG_PATH -> NEW_PATH
//               // For renames, status will be 'R ' (note the space)
//               if (status === "R " && path.includes(" -> ")) {
//                 const parts = path.split(" -> ");
//                 path = parts[parts.length - 1];
//               }
//               // Trim whitespace from the path
//               path = path.trim();
//               let fileStatus: FileChange["status"] = "unchanged";
//               // Check the first character of the status
//               const firstChar = status.charAt(0);
//               if (firstChar === "M" || firstChar === " ") {
//                 fileStatus = "modified";
//               } else if (firstChar === "A") {
//                 fileStatus = "added";
//               } else if (firstChar === "D") {
//                 fileStatus = "deleted";
//               } else if (firstChar === "U") {
//                 fileStatus = "conflicted";
//               } else if (status === "??") {
//                 fileStatus = "added";
//               } else if (status === "R ") {
//                 fileStatus = "modified"; // Treat renames as modifications
//               }
//               if (fileStatus !== "unchanged") {
//                 // console.log("Git change detected:", {
//                 //   path,
//                 //   status,
//                 //   fileStatus,
//                 // });
//                 // Verify the path exists to make sure it's correct
//                 const fullPath = `${process.cwd()}/${path}`;
//                 try {
//                   await fs.promises.access(fullPath);
//                   // console.log("Path exists:", fullPath);
//                 } catch (error) {
//                   // console.warn("Path does not exist:", fullPath);
//                   // Let's still add it to changes, as it might be a deleted file
//                 }
//                 // Add the change
//                 changes.push({
//                   path: path,
//                   status: fileStatus,
//                 });
//               }
//             }
//             resolve(changes);
//           }
//         );
//       });
//     } catch (error) {
//       // console.error("Failed to get git changes:", error);
//       return [];
//     }
//   }
//   private async getGitRemoteStatus(): Promise<RemoteStatus> {
//     try {
//       return new Promise((resolve) => {
//         // Get ahead/behind status for current branch
//         exec(
//           "git rev-list --left-right --count HEAD...@{u}",
//           { cwd: process.cwd() },
//           (error, stdout, stderr) => {
//             if (error) {
//               // If there's no upstream branch, return 0 for both
//               resolve({ ahead: 0, behind: 0 });
//               return;
//             }
//             const [behind, ahead] = stdout.trim().split("\t").map(Number);
//             resolve({ ahead, behind });
//           }
//         );
//       });
//     } catch (error) {
//       console.error("Failed to get remote status:", error);
//       return { ahead: 0, behind: 0 };
//     }
//   }
//   private async getCurrentGitBranch(): Promise<string> {
//     try {
//       return new Promise((resolve) => {
//         exec(
//           "git branch --show-current",
//           { cwd: process.cwd() },
//           (error, stdout, stderr) => {
//             if (error) {
//               console.error("Error getting current branch:", error);
//               resolve("main");
//               return;
//             }
//             resolve(stdout.trim() || "main");
//           }
//         );
//       });
//     } catch (error) {
//       console.error("Failed to get current branch:", error);
//       return "main";
//     }
//   }
// }
