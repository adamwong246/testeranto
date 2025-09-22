"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitFileService = void 0;
// import { buffer } from "stream/consumers";
const FileService_1 = require("../FileService");
class GitFileService extends FileService_1.FileService {
    constructor() {
        super(...arguments);
        this.git = null;
        this.fs = null;
        this.dir = "/testeranto-git";
    }
    files(path) {
        throw new Error("Method not implemented.");
    }
    projects(project) {
        throw new Error("Method not implemented.");
    }
    tests(project) {
        throw new Error("Method not implemented.");
    }
    report(project, test) {
        throw new Error("Method not implemented.");
    }
    fsTree(path) {
        throw new Error("Method not implemented.");
    }
    projectTree(project) {
        throw new Error("Method not implemented.");
    }
    async ensureGit() {
        // if (!this.git && typeof window !== "undefined") {
        //   // Dynamically import isomorphic-git only in browser environment
        //   // this.git = await import("isomorphic-git");
        //   // this.fs = await import("isomorphic-git/http/web");
        // }
    }
    async ensureBufferPolyfill() {
        if (typeof window !== "undefined" && !window.Buffer) {
            try {
                // const buffer = await import("buffer");
                window.Buffer = buffer.Buffer;
            }
            catch (error) {
                console.warn("Buffer polyfill not available:", error);
            }
        }
    }
    async readFile(path) {
        // Only run in browser environment
        if (typeof window === "undefined") {
            throw new Error("GitFileService is only available in browser environment");
        }
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            const content = await this.git.readBlob({
                fs: window.fs,
                dir: this.dir,
                oid: await this.git.resolveRef({
                    fs: window.fs,
                    dir: this.dir,
                    ref: "HEAD",
                }),
                filepath: path,
            });
            return new TextDecoder().decode(content.blob);
        }
        catch (error) {
            throw new Error(`Failed to read file: ${path}`);
        }
    }
    async readDirectory(path) {
        // Only run in browser environment
        if (typeof window === "undefined") {
            return [];
        }
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            const files = await this.git.listFiles({
                fs: window.fs,
                dir: this.dir,
                ref: "HEAD",
            });
            return files.map((name) => ({
                name,
                path: name,
                type: name.includes(".") ? "file" : "directory",
            }));
        }
        catch (error) {
            return [];
        }
    }
    async exists(path) {
        try {
            await this.readFile(path);
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    async writeFile(path, content) {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        // In Git mode, files are written to the virtual file system
        // This would need proper implementation with IndexedDB or similar
        console.log("Git mode write:", path);
    }
    async createDirectory(path) {
        // Directories are created automatically when writing files
        console.log("Git mode create directory:", path);
    }
    async deleteFile(path) {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        // Mark file for deletion in next commit
        console.log("Git mode delete:", path);
    }
    async getFileStatus(path) {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            const status = await this.git.status({
                fs: window.fs,
                dir: this.dir,
                filepath: path,
            });
            return { status: status };
        }
        catch (_a) {
            return { status: "unchanged" };
        }
    }
    async getChanges() {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            const statusMatrix = await this.git.statusMatrix({
                fs: window.fs,
                dir: this.dir,
            });
            return statusMatrix
                .map(([file, head, workdir, stage]) => {
                let status = "unchanged";
                if (head === 0 && workdir === 2)
                    status = "added";
                else if (head === 1 && workdir === 0)
                    status = "deleted";
                else if (workdir === 2)
                    status = "modified";
                else if (head !== workdir)
                    status = "modified";
                return { path: file, status };
            })
                .filter((change) => change.status !== "unchanged");
        }
        catch (error) {
            console.warn("Failed to get changes:", error);
            return [];
        }
    }
    async commitChanges(message, description) {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            // Stage all changes
            const changes = await this.getChanges();
            for (const change of changes) {
                if (change.status === "deleted") {
                    await this.git.remove({
                        fs: window.fs,
                        dir: this.dir,
                        filepath: change.path,
                    });
                }
                else {
                    await this.git.add({
                        fs: window.fs,
                        dir: this.dir,
                        filepath: change.path,
                    });
                }
            }
            // Commit
            await this.git.commit({
                fs: window.fs,
                dir: this.dir,
                author: { name: "Testeranto User", email: "user@testeranto" },
                message: description ? `${message}\n\n${description}` : message,
            });
        }
        catch (error) {
            throw new Error(`Failed to commit changes: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    async pushChanges() {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            await this.git.push({
                fs: window.fs,
                http: this.fs,
                dir: this.dir,
                remote: "origin",
                ref: "main",
                onAuth: () => ({ username: "token" }),
            });
        }
        catch (error) {
            throw new Error(`Failed to push changes: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    async pullChanges() {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            await this.git.pull({
                fs: window.fs,
                http: this.fs,
                dir: this.dir,
                remote: "origin",
                ref: "main",
                singleBranch: true,
                onAuth: () => ({ username: "token" }),
            });
        }
        catch (error) {
            throw new Error(`Failed to pull changes: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    async getCurrentBranch() {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            return ((await this.git.currentBranch({
                fs: window.fs,
                dir: this.dir,
            })) || "main");
        }
        catch (_a) {
            return "main";
        }
    }
    async getRemoteStatus() {
        await this.ensureBufferPolyfill();
        await this.ensureGit();
        try {
            // For now, return mock data
            // In a real implementation, we'd compare local and remote branches
            return { ahead: 0, behind: 0 };
        }
        catch (_a) {
            return { ahead: 0, behind: 0 };
        }
    }
}
exports.GitFileService = GitFileService;
