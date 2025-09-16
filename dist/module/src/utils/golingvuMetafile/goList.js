/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
export function runGoList(pattern) {
    try {
        // First, check if the pattern is a file path and convert it to a package path
        let processedPattern = pattern;
        if (fs.existsSync(pattern) && pattern.endsWith(".go")) {
            // Get the directory of the file
            const dir = path.dirname(pattern);
            // Use the directory as the pattern
            processedPattern = dir;
        }
        const output = execSync(`go list -mod=readonly -json ${processedPattern}`, {
            encoding: "utf-8",
            cwd: process.cwd(),
            stdio: ["pipe", "pipe", "pipe"],
        });
        // The output is a sequence of JSON objects, not a JSON array
        // We need to split them and parse individually
        const objects = [];
        let buffer = "";
        let depth = 0;
        let inString = false;
        let escapeNext = false;
        for (const char of output) {
            if (escapeNext) {
                buffer += char;
                escapeNext = false;
                continue;
            }
            if (char === "\\") {
                escapeNext = true;
                buffer += char;
                continue;
            }
            if (char === '"') {
                inString = !inString;
            }
            if (!inString) {
                if (char === "{") {
                    depth++;
                }
                else if (char === "}") {
                    depth--;
                    if (depth === 0) {
                        try {
                            objects.push(JSON.parse(buffer + char));
                            buffer = "";
                            continue;
                        }
                        catch (e) {
                            console.warn("Failed to parse JSON object:", buffer + char);
                            buffer = "";
                        }
                    }
                }
            }
            if (depth > 0 || buffer.length > 0) {
                buffer += char;
            }
        }
        return objects;
    }
    catch (error) {
        console.warn(`Error running 'go list -json ${pattern}':`, error);
        // Fall back to using the current directory
        try {
            const output = execSync(`go list -mod=readonly -json .`, {
                encoding: "utf-8",
                cwd: process.cwd(),
                stdio: ["pipe", "pipe", "pipe"],
            });
            // Parse the output
            const objects = [];
            let buffer = "";
            let depth = 0;
            let inString = false;
            let escapeNext = false;
            for (const char of output) {
                if (escapeNext) {
                    buffer += char;
                    escapeNext = false;
                    continue;
                }
                if (char === "\\") {
                    escapeNext = true;
                    buffer += char;
                    continue;
                }
                if (char === '"') {
                    inString = !inString;
                }
                if (!inString) {
                    if (char === "{") {
                        depth++;
                    }
                    else if (char === "}") {
                        depth--;
                        if (depth === 0) {
                            try {
                                objects.push(JSON.parse(buffer + char));
                                buffer = "";
                                continue;
                            }
                            catch (e) {
                                console.warn("Failed to parse JSON object:", buffer + char);
                                buffer = "";
                            }
                        }
                    }
                }
                if (depth > 0 || buffer.length > 0) {
                    buffer += char;
                }
            }
            return objects;
        }
        catch (fallbackError) {
            console.warn("Fallback go list also failed:", fallbackError);
            return [];
        }
    }
}
