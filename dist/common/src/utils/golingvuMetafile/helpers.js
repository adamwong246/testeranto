"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProjectRoot = findProjectRoot;
exports.findAndParseGoMod = findAndParseGoMod;
exports.calculateImportPath = calculateImportPath;
exports.normalizeImportPath = normalizeImportPath;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function findProjectRoot() {
    // Start from current directory and walk up until we find package.json
    let currentDir = process.cwd();
    while (currentDir !== path_1.default.parse(currentDir).root) {
        const packageJsonPath = path_1.default.join(currentDir, "package.json");
        if (fs_1.default.existsSync(packageJsonPath)) {
            return currentDir;
        }
        currentDir = path_1.default.dirname(currentDir);
    }
    // Fallback to current directory if package.json not found
    return process.cwd();
}
// Helper function to find and parse go.mod file
function findAndParseGoMod(startDir) {
    let currentDir = startDir;
    while (currentDir !== path_1.default.parse(currentDir).root) {
        const goModPath = path_1.default.join(currentDir, "go.mod");
        if (fs_1.default.existsSync(goModPath)) {
            try {
                const goModContent = fs_1.default.readFileSync(goModPath, "utf-8");
                const moduleMatch = goModContent.match(/^module\s+(\S+)/m);
                if (moduleMatch && moduleMatch[1]) {
                    return {
                        root: currentDir,
                        modulePath: moduleMatch[1],
                    };
                }
            }
            catch (error) {
                console.warn(`Error reading go.mod at ${goModPath}:`, error);
            }
        }
        currentDir = path_1.default.dirname(currentDir);
    }
    return null;
}
// Helper function to calculate import path from file path
function calculateImportPath(filePath) {
    const goModInfo = findAndParseGoMod(path_1.default.dirname(filePath));
    if (!goModInfo) {
        return null;
    }
    const relativePath = path_1.default.relative(goModInfo.root, path_1.default.dirname(filePath));
    if (relativePath && relativePath !== ".") {
        return path_1.default.join(goModInfo.modulePath, relativePath).replace(/\\/g, "/");
    }
    return goModInfo.modulePath;
}
// Helper function to normalize import path
function normalizeImportPath(importPath) {
    // Remove leading ./
    if (importPath.startsWith("./")) {
        return importPath.substring(2);
    }
    return importPath;
}
