"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePitonoMetafile = generatePitonoMetafile;
exports.writePitonoMetafile = writePitonoMetafile;
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function resolvePythonImport(importPath, currentFile) {
    // Handle relative imports
    if (importPath.startsWith(".")) {
        const currentDir = path_1.default.dirname(currentFile);
        // For relative imports, we need to handle the dots properly
        // Count the number of dots to determine how many levels to go up
        let dotCount = 0;
        let remainingPath = importPath;
        while (remainingPath.startsWith(".")) {
            dotCount++;
            remainingPath = remainingPath.substring(1);
        }
        // Remove any leading slash
        if (remainingPath.startsWith("/")) {
            remainingPath = remainingPath.substring(1);
        }
        // Build the base path by going up the appropriate number of directories
        let baseDir = currentDir;
        for (let i = 1; i < dotCount; i++) {
            baseDir = path_1.default.dirname(baseDir);
        }
        // Handle the case where there's no remaining path (just dots)
        if (remainingPath.length === 0) {
            const initPath = path_1.default.join(baseDir, "__init__.py");
            if (fs_1.default.existsSync(initPath)) {
                return initPath;
            }
            return null;
        }
        // Resolve the full path
        const resolvedPath = path_1.default.join(baseDir, remainingPath);
        // Try different extensions
        const extensions = [".py", "/__init__.py"];
        for (const ext of extensions) {
            const potentialPath = resolvedPath + ext;
            if (fs_1.default.existsSync(potentialPath)) {
                return potentialPath;
            }
        }
        // Check if it's a directory with __init__.py
        if (fs_1.default.existsSync(resolvedPath) &&
            fs_1.default.statSync(resolvedPath).isDirectory()) {
            const initPath = path_1.default.join(resolvedPath, "__init__.py");
            if (fs_1.default.existsSync(initPath)) {
                return initPath;
            }
        }
        return null;
    }
    // Handle absolute imports by looking in the same directory and parent directories
    // This is a simplification - Python's import system is more complex
    const dirs = [
        path_1.default.dirname(currentFile),
        process.cwd(),
        ...(process.env.PYTHONPATH
            ? process.env.PYTHONPATH.split(path_1.default.delimiter)
            : []),
    ];
    for (const dir of dirs) {
        const potentialPaths = [
            path_1.default.join(dir, importPath + ".py"),
            path_1.default.join(dir, importPath, "__init__.py"),
            path_1.default.join(dir, importPath.replace(/\./g, "/") + ".py"),
            path_1.default.join(dir, importPath.replace(/\./g, "/"), "__init__.py"),
        ];
        for (const potentialPath of potentialPaths) {
            if (fs_1.default.existsSync(potentialPath)) {
                return potentialPath;
            }
        }
    }
    return null;
}
function parsePythonImports(filePath) {
    try {
        const content = fs_1.default.readFileSync(filePath, "utf-8");
        const imports = [];
        // Match import statements (including multiple imports)
        const importRegex = /^import\s+([\w., ]+)/gm;
        // Match from ... import statements
        const fromImportRegex = /^from\s+([\w.]+)\s+import/gm;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            // Handle multiple imports in one line
            const importPaths = match[1].split(",").map((p) => p.trim());
            for (const importPath of importPaths) {
                // Try to resolve the import to see if it's external
                const resolvedPath = resolvePythonImport(importPath, filePath);
                imports.push({
                    path: importPath,
                    kind: "import-statement",
                    external: resolvedPath === null,
                    original: importPath,
                });
            }
        }
        while ((match = fromImportRegex.exec(content)) !== null) {
            const importPath = match[1];
            // Try to resolve the import to see if it's external
            const resolvedPath = resolvePythonImport(importPath, filePath);
            imports.push({
                path: importPath,
                kind: "import-statement",
                external: resolvedPath === null,
                original: importPath,
            });
        }
        return imports;
    }
    catch (error) {
        console.warn(`Could not parse imports for ${filePath}:`, error);
        return [];
    }
}
function collectDependencies(filePath, visited = new Set()) {
    if (visited.has(filePath))
        return [];
    visited.add(filePath);
    const dependencies = [filePath];
    const imports = parsePythonImports(filePath);
    for (const imp of imports) {
        if (!imp.external && imp.path) {
            const resolvedPath = resolvePythonImport(imp.path, filePath);
            if (resolvedPath && fs_1.default.existsSync(resolvedPath)) {
                dependencies.push(...collectDependencies(resolvedPath, visited));
            }
        }
    }
    return [...new Set(dependencies)];
}
async function generatePitonoMetafile(testName, entryPoints) {
    const inputs = {};
    const outputs = {};
    const signature = Date.now().toString(36);
    // Process each entry point
    for (const entryPoint of entryPoints) {
        if (!fs_1.default.existsSync(entryPoint)) {
            console.warn(`Entry point ${entryPoint} does not exist`);
            continue;
        }
        // Collect all dependencies recursively
        const allDependencies = collectDependencies(entryPoint);
        // Process each dependency to add to inputs
        for (const dep of allDependencies) {
            if (!inputs[dep]) {
                const bytes = fs_1.default.statSync(dep).size;
                const imports = parsePythonImports(dep);
                inputs[dep] = {
                    bytes,
                    imports,
                };
            }
        }
        // Generate output path
        const entryPointName = path_1.default.basename(entryPoint, ".py");
        const outputKey = `python/core/${entryPointName}.py`;
        // Calculate total bytes from all inputs
        const inputBytes = {};
        let totalBytes = 0;
        for (const dep of allDependencies) {
            const bytes = fs_1.default.statSync(dep).size;
            inputBytes[dep] = { bytesInOutput: bytes };
            totalBytes += bytes;
        }
        outputs[outputKey] = {
            imports: [],
            exports: [],
            entryPoint,
            inputs: inputBytes,
            bytes: totalBytes,
            signature,
        };
    }
    return {
        errors: [],
        warnings: [],
        metafile: {
            inputs,
            outputs,
        },
    };
}
function writePitonoMetafile(testName, metafile) {
    // Always use the project root for testeranto directories
    const projectRoot = process.cwd();
    const metafilePath = path_1.default.join(projectRoot, "testeranto", "metafiles", "python", "core.json");
    const metafileDir = path_1.default.dirname(metafilePath);
    // Ensure directory exists
    if (!fs_1.default.existsSync(metafileDir)) {
        fs_1.default.mkdirSync(metafileDir, { recursive: true });
    }
    // Write the metafile
    fs_1.default.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
    // Generate the output Python files in the core directory
    const outputDir = path_1.default.join(projectRoot, "testeranto", "bundles", "python", "core");
    if (!fs_1.default.existsSync(outputDir)) {
        fs_1.default.mkdirSync(outputDir, { recursive: true });
    }
    // Create each output file
    for (const [outputPath, outputInfo] of Object.entries(metafile.metafile.outputs)) {
        // Use just the filename part of the output path
        const fileName = path_1.default.basename(outputPath);
        const fullOutputPath = path_1.default.join(outputDir, fileName);
        const outputDirPath = path_1.default.dirname(fullOutputPath);
        if (!fs_1.default.existsSync(outputDirPath)) {
            fs_1.default.mkdirSync(outputDirPath, { recursive: true });
        }
        const entryPoint = outputInfo.entryPoint;
        const signature = outputInfo.signature;
        const content = `# This file is auto-generated by testeranto
# Signature: ${signature}
# It runs tests from: ${entryPoint}

import os
import sys

# Add the original entry point to the path
sys.path.insert(0, os.path.dirname(os.path.abspath("${entryPoint}")))

# Import and run the tests
try:
    # Import the module
    module_name = os.path.basename("${entryPoint}").replace('.py', '')
    module = __import__(module_name)
    
    # Run the tests if there's a main block
    if hasattr(module, 'main'):
        module.main()
    else:
        print(f"No main function found in {module_name}")
except Exception as e:
    print(f"Error running tests from ${entryPoint}: {e}")
    sys.exit(1)
`;
        fs_1.default.writeFileSync(fullOutputPath, content);
    }
}
