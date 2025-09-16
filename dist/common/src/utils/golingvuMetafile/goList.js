"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runGoList = runGoList;
/* eslint-disable @typescript-eslint/no-unused-vars */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
function runGoList(pattern) {
    try {
        // Handle directory paths by using '.' for the current directory when appropriate
        let processedPattern = pattern;
        // If it's a directory that exists, try to use it as a package path
        if (fs_1.default.existsSync(pattern)) {
            const stat = fs_1.default.statSync(pattern);
            if (stat.isDirectory()) {
                // Change to that directory and use '.' to list the current package
                // But this might not work if the directory isn't a valid Go package
                // So we'll try to use the relative path from the module root
                const cwd = process.cwd();
                try {
                    // Try to run go list from the target directory
                    const output = (0, child_process_1.execSync)(`go list -mod=readonly -json .`, {
                        encoding: "utf-8",
                        cwd: pattern,
                        stdio: ["pipe", "pipe", "pipe"],
                    });
                    return parseGoListOutput(output);
                }
                catch (error) {
                    // If that fails, fall back to using the absolute path as a pattern
                    processedPattern = pattern;
                }
            }
            else if (stat.isFile() && pattern.endsWith(".go")) {
                // For .go files, use their directory
                processedPattern = path_1.default.dirname(pattern);
            }
        }
        // Try to run go list with the processed pattern
        const output = (0, child_process_1.execSync)(`go list -mod=readonly -json "${processedPattern}"`, {
            encoding: "utf-8",
            cwd: process.cwd(),
            stdio: ["pipe", "pipe", "pipe"],
        });
        return parseGoListOutput(output);
    }
    catch (error) {
        console.warn(`Error running 'go list -json ${pattern}':`, error);
        // Return empty array instead of trying fallbacks that will likely also fail
        return [];
    }
}
// Helper function to parse the JSON output from go list
function parseGoListOutput(output) {
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
