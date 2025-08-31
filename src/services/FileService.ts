/* eslint-disable @typescript-eslint/no-unused-vars */
export interface FileEntry {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  modified?: Date;
}

export interface FileStatus {
  status: "unchanged" | "modified" | "added" | "deleted" | "conflicted";
}

export interface FileChange extends FileStatus {
  path: string;
  diff?: string;
}

export interface FileService {
  // Read operations
  readFile(path: string): Promise<string>;
  readDirectory(path: string): Promise<FileEntry[]>;
  exists(path: string): Promise<boolean>;

  // Write operations (mode-dependent)
  writeFile(path: string, content: string): Promise<void>;
  createDirectory(path: string): Promise<void>;
  deleteFile(path: string): Promise<void>;

  // Git integration
  getFileStatus(path: string): Promise<FileStatus>;
  getChanges(): Promise<FileChange[]>;
  commitChanges(message: string, description?: string): Promise<void>;
  pushChanges(): Promise<void>;
  pullChanges(): Promise<void>;
  getCurrentBranch(): Promise<string>;
  getRemoteStatus(): Promise<{ ahead: number; behind: number }>;
}

// Static Mode Service (Read-only)
class StaticFileService implements FileService {
  async readFile(path: string): Promise<string> {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to read file: ${path}`);
    return await response.text();
  }

  async readDirectory(path: string): Promise<FileEntry[]> {
    // In static mode, we can't list directories from the client
    // This would need to be provided by a server endpoint
    return [];
  }

  async exists(path: string): Promise<boolean> {
    try {
      const response = await fetch(path, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Write operations are no-ops in static mode
  async writeFile(): Promise<void> {
    /* no-op */
  }
  async createDirectory(): Promise<void> {
    /* no-op */
  }
  async deleteFile(): Promise<void> {
    /* no-op */
  }

  // Git operations are not available in static mode
  async getFileStatus(): Promise<FileStatus> {
    return { status: "unchanged" };
  }

  async getChanges(): Promise<FileChange[]> {
    return [];
  }

  async commitChanges(): Promise<void> {
    throw new Error("Commit not available in static mode");
  }

  async pushChanges(): Promise<void> {
    throw new Error("Push not available in static mode");
  }

  async pullChanges(): Promise<void> {
    throw new Error("Pull not available in static mode");
  }

  async getCurrentBranch(): Promise<string> {
    return "main";
  }

  async getRemoteStatus(): Promise<{ ahead: number; behind: number }> {
    return { ahead: 0, behind: 0 };
  }
}

// Development Mode Service (Full filesystem access via server)
class DevelopmentFileService implements FileService {
  async readFile(path: string): Promise<string> {
    const response = await fetch(
      `/api/files/read?path=${encodeURIComponent(path)}`
    );
    if (!response.ok) throw new Error(`Failed to read file: ${path}`);
    return await response.text();
  }

  async readDirectory(path: string): Promise<FileEntry[]> {
    const response = await fetch(
      `/api/files/list?path=${encodeURIComponent(path)}`
    );
    if (!response.ok) throw new Error(`Failed to list directory: ${path}`);
    return await response.json();
  }

  async exists(path: string): Promise<boolean> {
    const response = await fetch(
      `/api/files/exists?path=${encodeURIComponent(path)}`
    );
    return response.ok;
  }

  async writeFile(path: string, content: string): Promise<void> {
    const response = await fetch("/api/files/write", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, content }),
    });
    if (!response.ok) throw new Error(`Failed to write file: ${path}`);
  }

  async createDirectory(path: string): Promise<void> {
    const response = await fetch("/api/files/mkdir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    if (!response.ok) throw new Error(`Failed to create directory: ${path}`);
  }

  async deleteFile(path: string): Promise<void> {
    const response = await fetch("/api/files/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    if (!response.ok) throw new Error(`Failed to delete file: ${path}`);
  }

  async getFileStatus(): Promise<FileStatus> {
    // This would need server-side implementation
    return { status: "unchanged" };
  }

  async getChanges(): Promise<FileChange[]> {
    // This would need server-side implementation
    return [];
  }

  async commitChanges(): Promise<void> {
    throw new Error("Git operations not implemented in development mode");
  }

  async pushChanges(): Promise<void> {
    throw new Error("Git operations not implemented in development mode");
  }

  async pullChanges(): Promise<void> {
    throw new Error("Git operations not implemented in development mode");
  }

  async getCurrentBranch(): Promise<string> {
    return "main";
  }

  async getRemoteStatus(): Promise<{ ahead: number; behind: number }> {
    return { ahead: 0, behind: 0 };
  }
}

// Git Mode Service (isomorphic-git based)
class GitFileService implements FileService {
  private async ensureBufferPolyfill() {
    // Ensure buffer is available in the global scope
    if (typeof window !== 'undefined' && !window.Buffer) {
      // Use dynamic import to avoid issues during build
      const buffer = await import('buffer');
      window.Buffer = buffer.Buffer;
    }
  }

  async readFile(path: string): Promise<string> {
    await this.ensureBufferPolyfill();
    // Use isomorphic-git to read files
    const git = await import("isomorphic-git");
    // This would need proper implementation with IndexedDB
    return "";
  }

  async readDirectory(path: string): Promise<FileEntry[]> {
    await this.ensureBufferPolyfill();
    // Use isomorphic-git to list files
    return [];
  }

  async exists(path: string): Promise<boolean> {
    try {
      await this.readFile(path);
      return true;
    } catch {
      return false;
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    await this.ensureBufferPolyfill();
    // In Git mode, files are written to IndexedDB
    // This would need proper implementation
  }

  async createDirectory(path: string): Promise<void> {
    await this.ensureBufferPolyfill();
    // Directories are virtual in IndexedDB
  }

  async deleteFile(path: string): Promise<void> {
    await this.ensureBufferPolyfill();
    // Delete from IndexedDB
  }

  async getFileStatus(path: string): Promise<FileStatus> {
    await this.ensureBufferPolyfill();
    const git = await import("isomorphic-git");
    // This would need proper implementation
    return { status: "unchanged" };
  }

  async getChanges(): Promise<FileChange[]> {
    await this.ensureBufferPolyfill();
    const git = await import("isomorphic-git");
    // This would need proper implementation
    return [];
  }

  async commitChanges(message: string, description?: string): Promise<void> {
    await this.ensureBufferPolyfill();
    const git = await import("isomorphic-git");
    // This would need proper implementation
  }

  async pushChanges(): Promise<void> {
    await this.ensureBufferPolyfill();
    const git = await import("isomorphic-git");
    // This would need proper implementation
  }

  async pullChanges(): Promise<void> {
    await this.ensureBufferPolyfill();
    const git = await import("isomorphic-git");
    // This would need proper implementation
  }

  async getCurrentBranch(): Promise<string> {
    await this.ensureBufferPolyfill();
    const git = await import("isomorphic-git");
    // This would need proper implementation
    return "main";
  }

  async getRemoteStatus(): Promise<{ ahead: number; behind: number }> {
    await this.ensureBufferPolyfill();
    // This would need proper implementation
    return { ahead: 0, behind: 0 };
  }
}

// Factory function to get the appropriate FileService based on mode
export const getFileService = (mode: "static" | "dev" | "git"): FileService => {
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
