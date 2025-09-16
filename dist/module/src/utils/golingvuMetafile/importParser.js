import fs from "fs";
import path from "path";
import { runGoList } from "../golingvuMetafile/goList";
export function parseGoImports(filePath) {
    // Only process .go files
    if (!filePath.endsWith(".go")) {
        return [];
    }
    // Find the package this file belongs to
    const dir = path.dirname(filePath);
    const packages = runGoList(dir) || [];
    if (packages.length === 0) {
        return [];
    }
    const pkg = packages[0];
    const imports = [];
    if (pkg.Imports) {
        for (const importPath of pkg.Imports) {
            // Check if it's a standard library import by seeing if it has a dot in the first path element
            const firstPathElement = importPath.split("/")[0];
            const isExternal = firstPathElement.includes(".");
            imports.push({
                path: importPath,
                kind: "import-statement",
                external: isExternal,
            });
        }
    }
    // Add standard library imports from the file content
    try {
        const content = fs.readFileSync(filePath, "utf-8");
        const importRegex = /import\s*(?:\(\s*([\s\S]*?)\s*\)|"([^"]+)")/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            if (match[2]) {
                const importPath = match[2].trim();
                const firstPathElement = importPath.split("/")[0];
                const isExternal = firstPathElement.includes(".");
                // Check if we already have this import from go list
                if (!imports.some((imp) => imp.path === importPath)) {
                    imports.push({
                        path: importPath,
                        kind: "import-statement",
                        external: isExternal,
                    });
                }
            }
            else if (match[1]) {
                const importBlock = match[1];
                const importLines = importBlock
                    .split("\n")
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0 && !line.startsWith("//"));
                for (const line of importLines) {
                    const lineMatch = line.match(/"([^"]+)"/);
                    if (lineMatch) {
                        const importPath = lineMatch[1].trim();
                        const firstPathElement = importPath.split("/")[0];
                        const isExternal = firstPathElement.includes(".");
                        if (!imports.some((imp) => imp.path === importPath)) {
                            imports.push({
                                path: importPath,
                                kind: "import-statement",
                                external: isExternal,
                            });
                        }
                    }
                }
            }
        }
    }
    catch (error) {
        console.warn(`Could not read file ${filePath} for import parsing:`, error);
    }
    return imports;
}
