/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// import { buffer } from "stream/consumers";

import {
  FileService,
  FileEntry,
  FileStatus,
  FileChange,
  RemoteStatus,
} from "./FileService";

export class GitFileService extends FileService {
  private git: any = null;
  private fs: any = null;
  private dir = "/testeranto-git";

  files(path: string): Promise<object> {
    throw new Error("Method not implemented.");
  }
  projects(project: string): Promise<object> {
    throw new Error("Method not implemented.");
  }
  tests(project: string): Promise<object> {
    throw new Error("Method not implemented.");
  }
  report(project: string, test: string): Promise<object> {
    throw new Error("Method not implemented.");
  }
  fsTree(path: string): Promise<object> {
    throw new Error("Method not implemented.");
  }
  projectTree(project: string): Promise<object> {
    throw new Error("Method not implemented.");
  }

  private async ensureGit() {
    // if (!this.git && typeof window !== "undefined") {
    //   // Dynamically import isomorphic-git only in browser environment
    //   // this.git = await import("isomorphic-git");
    //   // this.fs = await import("isomorphic-git/http/web");
    // }
  }

  private async ensureBufferPolyfill() {
    if (typeof window !== "undefined" && !window.Buffer) {
      try {
        // const buffer = await import("buffer");
        window.Buffer = buffer.Buffer;
      } catch (error) {
        console.warn("Buffer polyfill not available:", error);
      }
    }
  }

  async readFile(path: string): Promise<string> {
    // Only run in browser environment
    if (typeof window === "undefined") {
      throw new Error(
        "GitFileService is only available in browser environment"
      );
    }

    await this.ensureBufferPolyfill();
    await this.ensureGit();
    try {
      const content = await this.git!.readBlob({
        fs: window.fs,
        dir: this.dir,
        oid: await this.git!.resolveRef({
          fs: window.fs,
          dir: this.dir,
          ref: "HEAD",
        }),
        filepath: path,
      });
      return new TextDecoder().decode(content.blob);
    } catch (error) {
      throw new Error(`Failed to read file: ${path}`);
    }
  }

  async readDirectory(path: string): Promise<FileEntry[]> {
    // Only run in browser environment
    if (typeof window === "undefined") {
      return [];
    }

    await this.ensureBufferPolyfill();
    await this.ensureGit();
    try {
      const files = await this.git!.listFiles({
        fs: window.fs,
        dir: this.dir,
        ref: "HEAD",
      });
      return files.map((name) => ({
        name,
        path: name,
        type: name.includes(".") ? "file" : "directory",
      }));
    } catch (error) {
      return [];
    }
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
    await this.ensureGit();
    // In Git mode, files are written to the virtual file system
    // This would need proper implementation with IndexedDB or similar
    console.log("Git mode write:", path);
  }

  async createDirectory(path: string): Promise<void> {
    // Directories are created automatically when writing files
    console.log("Git mode create directory:", path);
  }

  async deleteFile(path: string): Promise<void> {
    await this.ensureBufferPolyfill();
    await this.ensureGit();
    // Mark file for deletion in next commit
    console.log("Git mode delete:", path);
  }

  async getFileStatus(path: string): Promise<FileStatus> {
    await this.ensureBufferPolyfill();
    await this.ensureGit();
    try {
      const status = await this.git!.status({
        fs: window.fs,
        dir: this.dir,
        filepath: path,
      });
      return { status: status as FileStatus["status"] };
    } catch {
      return { status: "unchanged" };
    }
  }

  async getChanges(): Promise<FileChange[]> {
    await this.ensureBufferPolyfill();
    await this.ensureGit();
    try {
      const statusMatrix = await this.git!.statusMatrix({
        fs: window.fs,
        dir: this.dir,
      });

      return statusMatrix
        .map(([file, head, workdir, stage]) => {
          let status: FileChange["status"] = "unchanged";
          if (head === 0 && workdir === 2) status = "added";
          else if (head === 1 && workdir === 0) status = "deleted";
          else if (workdir === 2) status = "modified";
          else if (head !== workdir) status = "modified";

          return { path: file, status };
        })
        .filter((change) => change.status !== "unchanged");
    } catch (error) {
      console.warn("Failed to get changes:", error);
      return [];
    }
  }

  async commitChanges(message: string, description?: string): Promise<void> {
    await this.ensureBufferPolyfill();
    await this.ensureGit();
    try {
      // Stage all changes
      const changes = await this.getChanges();
      for (const change of changes) {
        if (change.status === "deleted") {
          await this.git!.remove({
            fs: window.fs,
            dir: this.dir,
            filepath: change.path,
          });
        } else {
          await this.git!.add({
            fs: window.fs,
            dir: this.dir,
            filepath: change.path,
          });
        }
      }

      // Commit
      await this.git!.commit({
        fs: window.fs,
        dir: this.dir,
        author: { name: "Testeranto User", email: "user@testeranto" },
        message: description ? `${message}\n\n${description}` : message,
      });
    } catch (error) {
      throw new Error(
        `Failed to commit changes: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async pushChanges(): Promise<void> {
    await this.ensureBufferPolyfill();
    await this.ensureGit();
    try {
      await this.git!.push({
        fs: window.fs,
        http: this.fs!,
        dir: this.dir,
        remote: "origin",
        ref: "main",
        onAuth: () => ({ username: "token" }),
      });
    } catch (error) {
      throw new Error(
        `Failed to push changes: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async pullChanges(): Promise<void> {
    await this.ensureBufferPolyfill();
    await this.ensureGit();
    try {
      await this.git!.pull({
        fs: window.fs,
        http: this.fs!,
        dir: this.dir,
        remote: "origin",
        ref: "main",
        singleBranch: true,
        onAuth: () => ({ username: "token" }),
      });
    } catch (error) {
      throw new Error(
        `Failed to pull changes: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getCurrentBranch(): Promise<string> {
    await this.ensureBufferPolyfill();
    await this.ensureGit();
    try {
      return (
        (await this.git!.currentBranch({
          fs: window.fs,
          dir: this.dir,
        })) || "main"
      );
    } catch {
      return "main";
    }
  }

  async getRemoteStatus(): Promise<RemoteStatus> {
    await this.ensureBufferPolyfill();
    await this.ensureGit();
    try {
      // For now, return mock data
      // In a real implementation, we'd compare local and remote branches
      return { ahead: 0, behind: 0 };
    } catch {
      return { ahead: 0, behind: 0 };
    }
  }
}
