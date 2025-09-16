import fs from "fs";
import path from "path";
export function findProjectRoot() {
    // Start from current directory and walk up until we find package.json
    let currentDir = process.cwd();
    while (currentDir !== path.parse(currentDir).root) {
        const packageJsonPath = path.join(currentDir, "package.json");
        if (fs.existsSync(packageJsonPath)) {
            return currentDir;
        }
        currentDir = path.dirname(currentDir);
    }
    // Fallback to current directory if package.json not found
    return process.cwd();
}
// Helper function to find and parse go.mod file
export function findAndParseGoMod(startDir) {
    let currentDir = startDir;
    while (currentDir !== path.parse(currentDir).root) {
        const goModPath = path.join(currentDir, "go.mod");
        if (fs.existsSync(goModPath)) {
            try {
                const goModContent = fs.readFileSync(goModPath, "utf-8");
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
        currentDir = path.dirname(currentDir);
    }
    return null;
}
// Helper function to calculate import path from file path
export function calculateImportPath(filePath) {
    const goModInfo = findAndParseGoMod(path.dirname(filePath));
    if (!goModInfo) {
        return null;
    }
    const relativePath = path.relative(goModInfo.root, path.dirname(filePath));
    if (relativePath && relativePath !== ".") {
        return path.join(goModInfo.modulePath, relativePath).replace(/\\/g, "/");
    }
    return goModInfo.modulePath;
}
// Helper function to normalize import path
export function normalizeImportPath(importPath) {
    // Remove leading ./
    if (importPath.startsWith("./")) {
        return importPath.substring(2);
    }
    return importPath;
}
