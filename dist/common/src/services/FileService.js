"use strict";
// // api endpoints
// //
// // /api/files/tree?path                = get tree of file names in a dir
// //                                       This tree precisely matches the filesystem
// // /api/projects/list                  = get list of projects via project.json
// // /api/projects/tests?project         = get list of tests associated with a project
// // /api/projects/tree?project=X&test=Y = get tree of files associated with test within a project.
// //                                       This tree will be composed dynamically from
// //                                          - source files in the metafile
// //                                          - the reports for the project and test
// /* eslint-disable @typescript-eslint/no-unused-vars */
// export interface FileEntry {
//   name: string;
//   path: string;
//   type: "file" | "directory";
//   size?: number;
//   modified?: Date;
// }
// export interface FileStatus {
//   status: "unchanged" | "modified" | "added" | "deleted" | "conflicted";
// }
// export interface FileChange extends FileStatus {
//   path: string;
//   diff?: string;
// }
// export interface RemoteStatus {
//   ahead: number;
//   behind: number;
// }
// export interface FileService {
//   // Read operations
//   readFile(path: string): Promise<string>;
//   readDirectory(path: string): Promise<FileEntry[]>;
//   exists(path: string): Promise<boolean>;
//   // todo
//   // return the file paths as a tree
//   fsTree(path: string): Promise<object>;
//   // return the file paths of a project as a tree.
//   projectTree(project: string): Promise<object>;
//   // Write operations (mode-dependent)
//   writeFile(path: string, content: string): Promise<void>;
//   createDirectory(path: string): Promise<void>;
//   deleteFile(path: string): Promise<void>;
//   // Git integration
//   getFileStatus(path: string): Promise<FileStatus>;
//   getChanges(): Promise<FileChange[]>;
//   commitChanges(message: string, description?: string): Promise<void>;
//   pushChanges(): Promise<void>;
//   pullChanges(): Promise<void>;
//   getCurrentBranch(): Promise<string>;
//   getRemoteStatus(): Promise<RemoteStatus>;
// }
// // Static Mode Service (Read-only)
// class StaticFileService implements FileService {
//   async readFile(path: string): Promise<string> {
//     const response = await fetch(path);
//     if (!response.ok) throw new Error(`Failed to read file: ${path}`);
//     return await response.text();
//   }
//   async readDirectory(path: string): Promise<FileEntry[]> {
//     // In static mode, we can't list directories from the client
//     // This would need to be provided by a server endpoint
//     return [];
//   }
//   async exists(path: string): Promise<boolean> {
//     try {
//       const response = await fetch(path, { method: "HEAD" });
//       return response.ok;
//     } catch {
//       return false;
//     }
//   }
//   // Write operations are no-ops in static mode
//   async writeFile(): Promise<void> {
//     /* no-op */
//   }
//   async createDirectory(): Promise<void> {
//     /* no-op */
//   }
//   async deleteFile(): Promise<void> {
//     /* no-op */
//   }
//   // Git operations are not available in static mode
//   async getFileStatus(): Promise<FileStatus> {
//     return { status: "unchanged" };
//   }
//   async getChanges(): Promise<FileChange[]> {
//     return [];
//   }
//   async commitChanges(): Promise<void> {
//     throw new Error("Commit not available in static mode");
//   }
//   async pushChanges(): Promise<void> {
//     throw new Error("Push not available in static mode");
//   }
//   async pullChanges(): Promise<void> {
//     throw new Error("Pull not available in static mode");
//   }
//   async getCurrentBranch(): Promise<string> {
//     return "main";
//   }
//   async getRemoteStatus(): Promise<{ ahead: number; behind: number }> {
//     return { ahead: 0, behind: 0 };
//   }
// }
// // Development Mode Service (Full filesystem access via server)
// class DevelopmentFileService implements FileService {
//   private ws: WebSocket | null = null;
//   private changeCallbacks: ((changes: FileChange[]) => void)[] = [];
//   private statusCallbacks: ((status: RemoteStatus) => void)[] = [];
//   private branchCallbacks: ((branch: string) => void)[] = [];
//   constructor() {
//     // WebSocket connection should not be established here
//     // This is a server-side service that handles HTTP requests
//     // WebSocket connections should be managed separately
//   }
//   private connectWebSocket() {
//     try {
//       const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
//       const wsUrl = `${protocol}//${window.location.host}/api/git-ws`;
//       this.ws = new WebSocket(wsUrl);
//       this.ws.onopen = () => {
//         console.log("Git WebSocket connected");
//         // Request initial state
//         this.ws?.send(JSON.stringify({ type: "get-initial-state" }));
//       };
//       this.ws.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           switch (data.type) {
//             case "changes":
//               this.changeCallbacks.forEach((callback) =>
//                 callback(data.changes)
//               );
//               break;
//             case "status":
//               this.statusCallbacks.forEach((callback) => callback(data.status));
//               break;
//             case "branch":
//               this.branchCallbacks.forEach((callback) => callback(data.branch));
//               break;
//             case "error":
//               console.error("Git WebSocket error:", data.message);
//               break;
//           }
//         } catch (error) {
//           console.error("Error parsing WebSocket message:", error);
//         }
//       };
//       this.ws.onclose = () => {
//         console.log("Git WebSocket disconnected, attempting to reconnect...");
//         setTimeout(() => this.connectWebSocket(), 3000);
//       };
//       this.ws.onerror = (error) => {
//         console.error("Git WebSocket error:", error);
//       };
//     } catch (error) {
//       console.error("Failed to connect Git WebSocket:", error);
//     }
//   }
//   // Subscribe to real-time changes
//   onChanges(callback: (changes: FileChange[]) => void) {
//     this.changeCallbacks.push(callback);
//     return () => {
//       this.changeCallbacks = this.changeCallbacks.filter(
//         (cb) => cb !== callback
//       );
//     };
//   }
//   onStatusUpdate(callback: (status: RemoteStatus) => void) {
//     this.statusCallbacks.push(callback);
//     return () => {
//       this.statusCallbacks = this.statusCallbacks.filter(
//         (cb) => cb !== callback
//       );
//     };
//   }
//   onBranchUpdate(callback: (branch: string) => void) {
//     this.branchCallbacks.push(callback);
//     return () => {
//       this.branchCallbacks = this.branchCallbacks.filter(
//         (cb) => cb !== callback
//       );
//     };
//   }
//   async readFile(path: string): Promise<string> {
//     // This should be implemented to read from the file system directly
//     // Since this is server-side code, we can use Node.js fs module
//     // However, this method should not be called on the client side
//     // For now, throw an error to indicate this needs proper implementation
//     throw new Error("FileService.readFile should be implemented server-side");
//   }
//   async readDirectory(path: string): Promise<FileEntry[]> {
//     // This should be implemented to read from the file system directly
//     // Since this is server-side code, we can use Node.js fs module
//     // However, this method should not be called on the client side
//     // For now, throw an error to indicate this needs proper implementation
//     throw new Error("FileService.readDirectory should be implemented server-side");
//   }
//   private async readDirectoryViaWebSocket(path: string): Promise<FileEntry[]> {
//     // This should not be used - WebSocket communication should be handled separately
//     throw new Error("WebSocket directory listing not implemented");
//   }
//   async exists(path: string): Promise<boolean> {
//     // This should be implemented to check file existence directly
//     // Since this is server-side code, we can use Node.js fs module
//     // However, this method should not be called on the client side
//     // For now, throw an error to indicate this needs proper implementation
//     throw new Error("FileService.exists should be implemented server-side");
//   }
//   async writeFile(path: string, content: string): Promise<void> {
//     // This should be implemented to write to the file system directly
//     // Since this is server-side code, we can use Node.js fs module
//     // However, this method should not be called on the client side
//     // For now, throw an error to indicate this needs proper implementation
//     throw new Error("FileService.writeFile should be implemented server-side");
//   }
//   async createDirectory(path: string): Promise<void> {
//     // This should be implemented to create directories directly
//     // Since this is server-side code, we can use Node.js fs module
//     // However, this method should not be called on the client side
//     // For now, throw an error to indicate this needs proper implementation
//     throw new Error("FileService.createDirectory should be implemented server-side");
//   }
//   async deleteFile(path: string): Promise<void> {
//     // This should be implemented to delete files directly
//     // Since this is server-side code, we can use Node.js fs module
//     // However, this method should not be called on the client side
//     // For now, throw an error to indicate this needs proper implementation
//     throw new Error("FileService.deleteFile should be implemented server-side");
//   }
//   async getFileStatus(path: string): Promise<FileStatus> {
//     const response = await fetch(
//       `/api/git/status?path=${encodeURIComponent(path)}`
//     );
//     if (!response.ok) return { status: "unchanged" };
//     return await response.json();
//   }
//   async getChanges(): Promise<FileChange[]> {
//     const response = await fetch("/api/git/changes");
//     if (!response.ok) return [];
//     const changes = await response.json();
//     console.log("Raw changes from server:", JSON.stringify(changes, null, 2));
//     return changes;
//   }
//   async commitChanges(message: string, description?: string): Promise<void> {
//     const response = await fetch("/api/git/commit", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message, description }),
//     });
//     if (!response.ok) {
//       const error = await response.text();
//       throw new Error(`Failed to commit changes: ${error}`);
//     }
//     // Request updated status after commit
//     this.ws?.send(JSON.stringify({ type: "refresh-status" }));
//   }
//   async pushChanges(): Promise<void> {
//     const response = await fetch("/api/git/push", {
//       method: "POST",
//     });
//     if (!response.ok) {
//       const error = await response.text();
//       throw new Error(`Failed to push changes: ${error}`);
//     }
//     this.ws?.send(JSON.stringify({ type: "refresh-status" }));
//   }
//   async pullChanges(): Promise<void> {
//     const response = await fetch("/api/git/pull", {
//       method: "POST",
//     });
//     if (!response.ok) {
//       const error = await response.text();
//       throw new Error(`Failed to pull changes: ${error}`);
//     }
//     this.ws?.send(JSON.stringify({ type: "refresh-status" }));
//   }
//   async getCurrentBranch(): Promise<string> {
//     const response = await fetch("/api/git/branch");
//     if (!response.ok) return "main";
//     return await response.text();
//   }
//   async getRemoteStatus(): Promise<RemoteStatus> {
//     const response = await fetch("/api/git/remote-status");
//     if (!response.ok) return { ahead: 0, behind: 0 };
//     return await response.json();
//   }
// }
// // Git Mode Service (isomorphic-git based)
// class GitFileService implements FileService {
//   private git: typeof import("isomorphic-git") | null = null;
//   private fs: typeof import("isomorphic-git/http/web") | null = null;
//   private dir = "/testeranto-git";
//   private async ensureGit() {
//     if (!this.git) {
//       this.git = await import("isomorphic-git");
//       this.fs = await import("isomorphic-git/http/web");
//     }
//   }
//   private async ensureBufferPolyfill() {
//     if (typeof window !== "undefined" && !window.Buffer) {
//       const buffer = await import("buffer");
//       window.Buffer = buffer.Buffer;
//     }
//   }
//   async readFile(path: string): Promise<string> {
//     await this.ensureBufferPolyfill();
//     await this.ensureGit();
//     try {
//       const content = await this.git!.readBlob({
//         fs: window.fs,
//         dir: this.dir,
//         oid: await this.git!.resolveRef({
//           fs: window.fs,
//           dir: this.dir,
//           ref: "HEAD",
//         }),
//         filepath: path,
//       });
//       return new TextDecoder().decode(content.blob);
//     } catch (error) {
//       throw new Error(`Failed to read file: ${path}`);
//     }
//   }
//   async readDirectory(path: string): Promise<FileEntry[]> {
//     await this.ensureBufferPolyfill();
//     await this.ensureGit();
//     try {
//       const files = await this.git!.listFiles({
//         fs: window.fs,
//         dir: this.dir,
//         ref: "HEAD",
//       });
//       return files.map((name) => ({
//         name,
//         path: name,
//         type: name.includes(".") ? "file" : "directory",
//       }));
//     } catch (error) {
//       return [];
//     }
//   }
//   async exists(path: string): Promise<boolean> {
//     try {
//       await this.readFile(path);
//       return true;
//     } catch {
//       return false;
//     }
//   }
//   async writeFile(path: string, content: string): Promise<void> {
//     await this.ensureBufferPolyfill();
//     await this.ensureGit();
//     // In Git mode, files are written to the virtual file system
//     // This would need proper implementation with IndexedDB or similar
//     console.log("Git mode write:", path);
//   }
//   async createDirectory(path: string): Promise<void> {
//     // Directories are created automatically when writing files
//     console.log("Git mode create directory:", path);
//   }
//   async deleteFile(path: string): Promise<void> {
//     await this.ensureBufferPolyfill();
//     await this.ensureGit();
//     // Mark file for deletion in next commit
//     console.log("Git mode delete:", path);
//   }
//   async getFileStatus(path: string): Promise<FileStatus> {
//     await this.ensureBufferPolyfill();
//     await this.ensureGit();
//     try {
//       const status = await this.git!.status({
//         fs: window.fs,
//         dir: this.dir,
//         filepath: path,
//       });
//       return { status: status as FileStatus["status"] };
//     } catch {
//       return { status: "unchanged" };
//     }
//   }
//   async getChanges(): Promise<FileChange[]> {
//     await this.ensureBufferPolyfill();
//     await this.ensureGit();
//     try {
//       const statusMatrix = await this.git!.statusMatrix({
//         fs: window.fs,
//         dir: this.dir,
//       });
//       return statusMatrix
//         .map(([file, head, workdir, stage]) => {
//           let status: FileChange["status"] = "unchanged";
//           if (head === 0 && workdir === 2) status = "added";
//           else if (head === 1 && workdir === 0) status = "deleted";
//           else if (workdir === 2) status = "modified";
//           else if (head !== workdir) status = "modified";
//           return { path: file, status };
//         })
//         .filter((change) => change.status !== "unchanged");
//     } catch (error) {
//       console.warn("Failed to get changes:", error);
//       return [];
//     }
//   }
//   async commitChanges(message: string, description?: string): Promise<void> {
//     await this.ensureBufferPolyfill();
//     await this.ensureGit();
//     try {
//       // Stage all changes
//       const changes = await this.getChanges();
//       for (const change of changes) {
//         if (change.status === "deleted") {
//           await this.git!.remove({
//             fs: window.fs,
//             dir: this.dir,
//             filepath: change.path,
//           });
//         } else {
//           await this.git!.add({
//             fs: window.fs,
//             dir: this.dir,
//             filepath: change.path,
//           });
//         }
//       }
//       // Commit
//       await this.git!.commit({
//         fs: window.fs,
//         dir: this.dir,
//         author: { name: "Testeranto User", email: "user@testeranto" },
//         message: description ? `${message}\n\n${description}` : message,
//       });
//     } catch (error) {
//       throw new Error(
//         `Failed to commit changes: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//     }
//   }
//   async pushChanges(): Promise<void> {
//     await this.ensureBufferPolyfill();
//     await this.ensureGit();
//     try {
//       await this.git!.push({
//         fs: window.fs,
//         http: this.fs!,
//         dir: this.dir,
//         remote: "origin",
//         ref: "main",
//         onAuth: () => ({ username: "token" }),
//       });
//     } catch (error) {
//       throw new Error(
//         `Failed to push changes: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//     }
//   }
//   async pullChanges(): Promise<void> {
//     await this.ensureBufferPolyfill();
//     await this.ensureGit();
//     try {
//       await this.git!.pull({
//         fs: window.fs,
//         http: this.fs!,
//         dir: this.dir,
//         remote: "origin",
//         ref: "main",
//         singleBranch: true,
//         onAuth: () => ({ username: "token" }),
//       });
//     } catch (error) {
//       throw new Error(
//         `Failed to pull changes: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//     }
//   }
//   async getCurrentBranch(): Promise<string> {
//     await this.ensureBufferPolyfill();
//     await this.ensureGit();
//     try {
//       return (
//         (await this.git!.currentBranch({
//           fs: window.fs,
//           dir: this.dir,
//         })) || "main"
//       );
//     } catch {
//       return "main";
//     }
//   }
//   async getRemoteStatus(): Promise<RemoteStatus> {
//     await this.ensureBufferPolyfill();
//     await this.ensureGit();
//     try {
//       // For now, return mock data
//       // In a real implementation, we'd compare local and remote branches
//       return { ahead: 0, behind: 0 };
//     } catch {
//       return { ahead: 0, behind: 0 };
//     }
//   }
// }
// // Factory function to get the appropriate FileService based on mode
// export const getFileService = (mode: "static" | "dev" | "git"): FileService => {
//   switch (mode) {
//     case "static":
//       return new StaticFileService();
//     case "dev":
//       return new DevelopmentFileService();
//     case "git":
//       return new GitFileService();
//     default:
//       return new StaticFileService();
//   }
// };
