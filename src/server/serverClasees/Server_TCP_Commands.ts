/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { generateStreamId } from "./utils/Server_TCP_utils";
import { Server_TCP_FileService } from "./Server_TCP_FileService";
import { IMode } from "../types";

export class Server_TCP_Commands extends Server_TCP_FileService {
  constructor(configs: any, name: string, mode: IMode) {
    super(configs, name, mode);
  }

  // Command handlers for PM_Node
  async writeFileSync(
    filepath: string,
    contents: string,
    testName?: string
  ): Promise<boolean> {
    console.log("Server.writeFileSync called:", {
      filepath,
      testName,
      contentsLength: contents.length,
      cwd: process.cwd(),
    });

    // Handle relative paths - if the path doesn't start with /, make it relative to cwd
    let resolvedPath = filepath;
    if (!path.isAbsolute(filepath)) {
      resolvedPath = path.join(process.cwd(), filepath);
      console.log("Resolved relative path to:", resolvedPath);
    }

    // Ensure the directory exists
    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) {
      console.log("Creating directory:", dir);
      fs.mkdirSync(dir, { recursive: true });
    }

    console.log("Writing file:", resolvedPath);
    try {
      fs.writeFileSync(resolvedPath, contents);
      console.log("File written successfully to", resolvedPath);
      return true;
    } catch (error) {
      console.error("Error writing file:", error);
      return false;
    }
  }

  existsSync(filepath: string): boolean {
    // The filepath already includes the full path from the client
    return fs.existsSync(filepath);
  }

  mkdirSync(filepath: string): void {
    // The filepath already includes the full path from the client
    fs.mkdirSync(filepath, { recursive: true });
  }

  readFile(filepath: string): string {
    const fullPath = path.join(process.cwd(), filepath);
    return fs.readFileSync(fullPath, "utf-8");
  }

  createWriteStream(filepath: string, testName?: string): string {
    // The filepath already includes the full path from the client
    // Ensure the directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const stream = fs.createWriteStream(filepath);
    // For now, we don't track the stream, so return a dummy ID
    return generateStreamId();
  }

  end(uid: string): boolean {
    // For now, just return true
    return true;
  }

  customclose(fsPath?: string, testName?: string): any {
    // For now, just return true
    return true;
  }
}
