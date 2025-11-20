/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
function resolvePythonImport(importPath, currentFile) {
    // Handle relative imports
    if (importPath.startsWith(".")) {
        const currentDir = path.dirname(currentFile);
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
            baseDir = path.dirname(baseDir);
        }
        // Handle the case where there's no remaining path (just dots)
        if (remainingPath.length === 0) {
            const initPath = path.join(baseDir, "__init__.py");
            if (fs.existsSync(initPath)) {
                return initPath;
            }
            return null;
        }
        // Resolve the full path
        const resolvedPath = path.join(baseDir, remainingPath);
        // Try different extensions
        const extensions = [".py", "/__init__.py"];
        for (const ext of extensions) {
            const potentialPath = resolvedPath + ext;
            if (fs.existsSync(potentialPath)) {
                return potentialPath;
            }
        }
        // Check if it's a directory with __init__.py
        if (fs.existsSync(resolvedPath) &&
            fs.statSync(resolvedPath).isDirectory()) {
            const initPath = path.join(resolvedPath, "__init__.py");
            if (fs.existsSync(initPath)) {
                return initPath;
            }
        }
        return null;
    }
    // Handle absolute imports by looking in the same directory and parent directories
    // This is a simplification - Python's import system is more complex
    const dirs = [
        path.dirname(currentFile),
        process.cwd(),
        ...(process.env.PYTHONPATH
            ? process.env.PYTHONPATH.split(path.delimiter)
            : []),
    ];
    for (const dir of dirs) {
        const potentialPaths = [
            path.join(dir, importPath + ".py"),
            path.join(dir, importPath, "__init__.py"),
            path.join(dir, importPath.replace(/\./g, "/") + ".py"),
            path.join(dir, importPath.replace(/\./g, "/"), "__init__.py"),
        ];
        for (const potentialPath of potentialPaths) {
            if (fs.existsSync(potentialPath)) {
                return potentialPath;
            }
        }
    }
    return null;
}
function parsePythonImports(filePath) {
    try {
        const content = fs.readFileSync(filePath, "utf-8");
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
            if (resolvedPath && fs.existsSync(resolvedPath)) {
                dependencies.push(...collectDependencies(resolvedPath, visited));
            }
        }
    }
    return [...new Set(dependencies)];
}
export async function generatePitonoMetafile(testName, entryPoints) {
    const inputs = {};
    const outputs = {};
    const signature = Date.now().toString(36);
    // Process each entry point
    for (const entryPoint of entryPoints) {
        if (!fs.existsSync(entryPoint)) {
            console.warn(`Entry point ${entryPoint} does not exist`);
            continue;
        }
        // Collect all dependencies recursively
        const allDependencies = collectDependencies(entryPoint);
        // Process each dependency to add to inputs
        for (const dep of allDependencies) {
            if (!inputs[dep]) {
                const bytes = fs.statSync(dep).size;
                const imports = parsePythonImports(dep);
                inputs[dep] = {
                    bytes,
                    imports,
                };
            }
        }
        // Generate output path
        const entryPointName = path.basename(entryPoint, ".py");
        const outputKey = `python/core/${entryPointName}.py`;
        // Calculate total bytes from all inputs
        const inputBytes = {};
        let totalBytes = 0;
        for (const dep of allDependencies) {
            const bytes = fs.statSync(dep).size;
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
export function writePitonoMetafile(testName, metafile) {
    // Always use the project root for testeranto directories
    const projectRoot = process.cwd();
    const metafilePath = path.join(projectRoot, "testeranto", "metafiles", "python", "core.json");
    const metafileDir = path.dirname(metafilePath);
    // Ensure directory exists
    if (!fs.existsSync(metafileDir)) {
        fs.mkdirSync(metafileDir, { recursive: true });
    }
    // Write the metafile
    fs.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
    // Generate the output Python files in the core directory
    const outputDir = path.join(projectRoot, "testeranto", "bundles", "python", "core");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    // Create each output file
    for (const [outputPath, outputInfo] of Object.entries(metafile.metafile.outputs)) {
        // Use just the filename part of the output path
        const fileName = path.basename(outputPath);
        const fullOutputPath = path.join(outputDir, fileName);
        const outputDirPath = path.dirname(fullOutputPath);
        if (!fs.existsSync(outputDirPath)) {
            fs.mkdirSync(outputDirPath, { recursive: true });
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
        fs.writeFileSync(fullOutputPath, content);
    }
}
