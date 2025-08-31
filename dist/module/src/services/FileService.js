// Static Mode Service (Read-only)
class StaticFileService {
    async readFile(path) {
        const response = await fetch(path);
        if (!response.ok)
            throw new Error(`Failed to read file: ${path}`);
        return await response.text();
    }
    async readDirectory(path) {
        // In static mode, we can't list directories from the client
        // This would need to be provided by a server endpoint
        return [];
    }
    async exists(path) {
        try {
            const response = await fetch(path, { method: "HEAD" });
            return response.ok;
        }
        catch (_a) {
            return false;
        }
    }
    // Write operations are no-ops in static mode
    async writeFile() {
        /* no-op */
    }
    async createDirectory() {
        /* no-op */
    }
    async deleteFile() {
        /* no-op */
    }
    // Git operations are not available in static mode
    async getFileStatus() {
        return { status: "unchanged" };
    }
    async getChanges() {
        return [];
    }
    async commitChanges() {
        throw new Error("Commit not available in static mode");
    }
    async pushChanges() {
        throw new Error("Push not available in static mode");
    }
    async pullChanges() {
        throw new Error("Pull not available in static mode");
    }
    async getCurrentBranch() {
        return "main";
    }
    async getRemoteStatus() {
        return { ahead: 0, behind: 0 };
    }
}
// Development Mode Service (Full filesystem access via server)
class DevelopmentFileService {
    async readFile(path) {
        const response = await fetch(`/api/files/read?path=${encodeURIComponent(path)}`);
        if (!response.ok)
            throw new Error(`Failed to read file: ${path}`);
        return await response.text();
    }
    async readDirectory(path) {
        const response = await fetch(`/api/files/list?path=${encodeURIComponent(path)}`);
        if (!response.ok)
            throw new Error(`Failed to list directory: ${path}`);
        return await response.json();
    }
    async exists(path) {
        const response = await fetch(`/api/files/exists?path=${encodeURIComponent(path)}`);
        return response.ok;
    }
    async writeFile(path, content) {
        const response = await fetch("/api/files/write", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path, content }),
        });
        if (!response.ok)
            throw new Error(`Failed to write file: ${path}`);
    }
    async createDirectory(path) {
        const response = await fetch("/api/files/mkdir", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path }),
        });
        if (!response.ok)
            throw new Error(`Failed to create directory: ${path}`);
    }
    async deleteFile(path) {
        const response = await fetch("/api/files/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path }),
        });
        if (!response.ok)
            throw new Error(`Failed to delete file: ${path}`);
    }
    async getFileStatus() {
        // This would need server-side implementation
        return { status: "unchanged" };
    }
    async getChanges() {
        // This would need server-side implementation
        return [];
    }
    async commitChanges() {
        throw new Error("Git operations not implemented in development mode");
    }
    async pushChanges() {
        throw new Error("Git operations not implemented in development mode");
    }
    async pullChanges() {
        throw new Error("Git operations not implemented in development mode");
    }
    async getCurrentBranch() {
        return "main";
    }
    async getRemoteStatus() {
        return { ahead: 0, behind: 0 };
    }
}
// Git Mode Service (isomorphic-git based)
class GitFileService {
    async ensureBufferPolyfill() {
        // Ensure buffer is available in the global scope
        if (typeof window !== 'undefined' && !window.Buffer) {
            // Use dynamic import to avoid issues during build
            const buffer = await import('buffer');
            window.Buffer = buffer.Buffer;
        }
    }
    async readFile(path) {
        await this.ensureBufferPolyfill();
        // Use isomorphic-git to read files
        const git = await import("isomorphic-git");
        // This would need proper implementation with IndexedDB
        return "";
    }
    async readDirectory(path) {
        await this.ensureBufferPolyfill();
        // Use isomorphic-git to list files
        return [];
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
        // In Git mode, files are written to IndexedDB
        // This would need proper implementation
    }
    async createDirectory(path) {
        await this.ensureBufferPolyfill();
        // Directories are virtual in IndexedDB
    }
    async deleteFile(path) {
        await this.ensureBufferPolyfill();
        // Delete from IndexedDB
    }
    async getFileStatus(path) {
        await this.ensureBufferPolyfill();
        const git = await import("isomorphic-git");
        // This would need proper implementation
        return { status: "unchanged" };
    }
    async getChanges() {
        await this.ensureBufferPolyfill();
        const git = await import("isomorphic-git");
        // This would need proper implementation
        return [];
    }
    async commitChanges(message, description) {
        await this.ensureBufferPolyfill();
        const git = await import("isomorphic-git");
        // This would need proper implementation
    }
    async pushChanges() {
        await this.ensureBufferPolyfill();
        const git = await import("isomorphic-git");
        // This would need proper implementation
    }
    async pullChanges() {
        await this.ensureBufferPolyfill();
        const git = await import("isomorphic-git");
        // This would need proper implementation
    }
    async getCurrentBranch() {
        await this.ensureBufferPolyfill();
        const git = await import("isomorphic-git");
        // This would need proper implementation
        return "main";
    }
    async getRemoteStatus() {
        await this.ensureBufferPolyfill();
        // This would need proper implementation
        return { ahead: 0, behind: 0 };
    }
}
// Factory function to get the appropriate FileService based on mode
export const getFileService = (mode) => {
    switch (mode) {
        case "static":
            return new StaticFileService();
        case "dev":
            return new DevelopmentFileService();
        case "git":
            return new GitFileService();
        default:
            return new StaticFileService();
    }
};
