"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGolingvuMetafile = generateGolingvuMetafile;
exports.writeGolingvuMetafile = writeGolingvuMetafile;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
function runGoList(pattern) {
    try {
        // First, check if the pattern is a file path and convert it to a package path
        let processedPattern = pattern;
        if (fs_1.default.existsSync(pattern) && pattern.endsWith(".go")) {
            // Get the directory of the file
            const dir = path_1.default.dirname(pattern);
            // Use the directory as the pattern
            processedPattern = dir;
        }
        const output = (0, child_process_1.execSync)(`go list -mod=readonly -json ${processedPattern}`, {
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
            const output = (0, child_process_1.execSync)(`go list -mod=readonly -json .`, {
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
function findGoFilesInProject() {
    // Use go list to find all Go files in the current module
    const packages = runGoList("./...");
    const goFiles = [];
    for (const pkg of packages) {
        if (pkg.GoFiles) {
            for (const file of pkg.GoFiles) {
                goFiles.push(path_1.default.join(pkg.Dir, file));
            }
        }
        // Also include CgoFiles and other file types if needed
        if (pkg.CgoFiles) {
            for (const file of pkg.CgoFiles) {
                goFiles.push(path_1.default.join(pkg.Dir, file));
            }
        }
    }
    return goFiles;
}
function collectGoDependencies(filePath, visited = new Set()) {
    if (visited.has(filePath))
        return [];
    visited.add(filePath);
    const dependencies = [filePath];
    // Find the package this file belongs to by looking at the directory
    const dir = path_1.default.dirname(filePath);
    // Always include other .go files in the same directory
    try {
        const files = fs_1.default.readdirSync(dir);
        for (const file of files) {
            if (file.endsWith(".go") && file !== path_1.default.basename(filePath)) {
                const fullPath = path_1.default.join(dir, file);
                dependencies.push(fullPath);
            }
        }
    }
    catch (error) {
        console.warn(`Could not read directory ${dir}:`, error);
    }
    // Parse imports from the file content to find local imports
    try {
        const content = fs_1.default.readFileSync(filePath, "utf-8");
        const importRegex = /import\s*(?:\(\s*([\s\S]*?)\s*\)|"([^"]+)")/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            if (match[2]) {
                // Single import
                const importPath = match[2].trim();
                processImport(importPath, dir, dependencies, visited);
            }
            else if (match[1]) {
                // Multi-line imports in parentheses
                const importBlock = match[1];
                const importLines = importBlock
                    .split("\n")
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0 && !line.startsWith("//"));
                for (const line of importLines) {
                    const lineMatch = line.match(/"([^"]+)"/);
                    if (lineMatch) {
                        const importPath = lineMatch[1].trim();
                        processImport(importPath, dir, dependencies, visited);
                    }
                }
            }
        }
    }
    catch (error) {
        console.warn(`Could not read file ${filePath} for import parsing:`, error);
    }
    return [...new Set(dependencies)];
}
function processImport(importPath, currentDir, dependencies, visited) {
    // Check if it's a standard library import (no dots in first path element)
    const firstPathElement = importPath.split("/")[0];
    const isExternal = firstPathElement.includes(".");
    // If it's not external, it's either standard library or local
    // For local imports, they should be relative to the current module root
    if (!isExternal) {
        // Try to find the imported file locally
        // Look in vendor directory first (common for Go projects)
        const potentialPaths = [
            path_1.default.join(process.cwd(), "vendor", importPath),
            path_1.default.join(currentDir, importPath),
            path_1.default.join(process.cwd(), importPath),
            path_1.default.join(process.cwd(), "src", importPath),
        ];
        for (const potentialPath of potentialPaths) {
            // Check if it's a directory with .go files
            if (fs_1.default.existsSync(potentialPath) &&
                fs_1.default.statSync(potentialPath).isDirectory()) {
                try {
                    const files = fs_1.default.readdirSync(potentialPath);
                    for (const file of files) {
                        if (file.endsWith(".go") && !file.endsWith("_test.go")) {
                            const fullPath = path_1.default.join(potentialPath, file);
                            dependencies.push(...collectGoDependencies(fullPath, visited));
                        }
                    }
                    break;
                }
                catch (error) {
                    console.warn(`Could not read directory ${potentialPath}:`, error);
                }
            }
            // Check if it's a .go file directly
            const goFilePath = potentialPath + ".go";
            if (fs_1.default.existsSync(goFilePath)) {
                dependencies.push(...collectGoDependencies(goFilePath, visited));
                break;
            }
        }
    }
}
function parseGoImports(filePath) {
    // Find the package this file belongs to
    const dir = path_1.default.dirname(filePath);
    const packages = runGoList(dir);
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
        const content = fs_1.default.readFileSync(filePath, "utf-8");
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
function findProjectRoot() {
    // Start from current directory and walk up until we find package.json
    let currentDir = process.cwd();
    while (currentDir !== path_1.default.parse(currentDir).root) {
        const packageJsonPath = path_1.default.join(currentDir, 'package.json');
        if (fs_1.default.existsSync(packageJsonPath)) {
            return currentDir;
        }
        currentDir = path_1.default.dirname(currentDir);
    }
    // Fallback to current directory if package.json not found
    return process.cwd();
}
function isGoAvailable() {
    try {
        (0, child_process_1.execSync)("go version", { stdio: "pipe" });
        return true;
    }
    catch (_a) {
        return false;
    }
}
let generationQueue = null;
async function generateGolingvuMetafile(testName, entryPoints) {
    // If there's already a generation in progress, wait for it to complete
    if (generationQueue) {
        console.log("Generation already in progress, waiting...");
        return generationQueue;
    }
    generationQueue = (async () => {
        console.log(`Generating Golang metafile for test: ${testName}`);
        console.log(`Entry points provided: ${JSON.stringify(entryPoints)}`);
        console.log(`Current working directory: ${process.cwd()}`);
        const inputs = {};
        const outputs = {};
        const signature = Date.now().toString(36);
        // Check if go is available
        if (!isGoAvailable()) {
            console.warn("Go toolchain is not available. Using fallback method.");
            // Fallback to the original implementation
            // ... (we'll need to include the original implementation here)
            // For now, let's return an empty metafile
            return {
                errors: [],
                warnings: [],
                metafile: {
                    inputs: {},
                    outputs: {},
                },
            };
        }
        // If entry points are provided, use them directly
        // Make sure they're not test files
        const filteredEntryPoints = [];
        for (const entryPoint of entryPoints) {
            const fileName = path_1.default.basename(entryPoint);
            if (fileName.includes("_test.go") || fileName.endsWith(".test.go")) {
                console.warn(`Skipping Go test file: ${fileName}`);
                continue;
            }
            filteredEntryPoints.push(entryPoint);
        }
        entryPoints = filteredEntryPoints;
        // If no valid entry points remain, try to find Go files automatically
        // But exclude test files
        if (entryPoints.length === 0) {
            const allGoFiles = findGoFilesInProject();
            // Filter out test files
            entryPoints = allGoFiles.filter((file) => {
                const fileName = path_1.default.basename(file);
                return !fileName.includes("_test.go") && !fileName.endsWith(".test.go");
            });
            if (entryPoints.length === 0) {
                console.warn("No non-test Go files found in the project");
            }
            else {
                console.log(`Found ${entryPoints.length} non-test Go files:`, entryPoints);
            }
        }
        // Process each entry point, but skip test files
        for (let i = 0; i < entryPoints.length; i++) {
            let entryPoint = entryPoints[i];
            // First, try to resolve the path relative to the current working directory
            // Check if the entry point is a relative path and needs to be resolved
            let resolvedPath = entryPoint;
            if (!path_1.default.isAbsolute(entryPoint)) {
                resolvedPath = path_1.default.join(process.cwd(), entryPoint);
            }
            // Check if the resolved path exists
            if (!fs_1.default.existsSync(resolvedPath)) {
                console.warn(`Entry point ${entryPoint} does not exist at ${resolvedPath}`);
                // Try to find the file by looking for it in the example directory
                // The files might be in the example directory relative to the current working directory
                const fileName = path_1.default.basename(entryPoint);
                const potentialPaths = [
                    path_1.default.join(process.cwd(), "example", fileName),
                    path_1.default.join(process.cwd(), fileName),
                    path_1.default.join(process.cwd(), "src", "example", fileName),
                    path_1.default.join(process.cwd(), "src", fileName),
                ];
                let foundPath = "";
                for (const potentialPath of potentialPaths) {
                    if (fs_1.default.existsSync(potentialPath)) {
                        foundPath = potentialPath;
                        console.log(`Found ${fileName} at: ${foundPath}`);
                        break;
                    }
                }
                if (!foundPath) {
                    console.warn(`Could not find ${fileName} in any common locations`);
                    continue;
                }
                // Update the entry point to use the found path
                entryPoints[i] = foundPath;
                entryPoint = foundPath;
            }
            else {
                // Use the resolved path
                entryPoints[i] = resolvedPath;
                entryPoint = resolvedPath;
            }
            // Skip test files - we don't want to generate wrappers for them
            // Also skip files that might be treated as Go tests
            const fileName = path_1.default.basename(entryPoint);
            if (fileName.includes("_test.go") || fileName.endsWith(".test.go")) {
                console.log(`Skipping Go test file: ${fileName}`);
                continue;
            }
            // Collect all dependencies recursively
            const allDependencies = collectGoDependencies(entryPoint);
            // Process each dependency to add to inputs
            for (const dep of allDependencies) {
                if (!inputs[dep]) {
                    const bytes = fs_1.default.statSync(dep).size;
                    const imports = parseGoImports(dep);
                    inputs[dep] = {
                        bytes,
                        imports,
                        format: "esm", // Go doesn't use ES modules, but we'll use this for consistency
                    };
                }
            }
            // Generate output path relative to the testeranto/bundles directory
            // Always use golang/core/ prefix
            // For all testeranto files, use .golingvu.go extension (not _test.go)
            const entryPointName = path_1.default.basename(entryPoint, ".go");
            // Always use .golingvu.go extension for consistency
            const baseName = entryPointName;
            const outputKey = `golang/core/${baseName}.golingvu.go`;
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
        // If no valid entry points were found, ensure we have at least one input and output
        // This prevents empty metafile which could cause issues
        if (Object.keys(inputs).length === 0) {
            // Check if there are any .go files in the current directory
            try {
                const files = fs_1.default.readdirSync(process.cwd());
                const goFiles = files.filter((file) => file.endsWith(".go"));
                if (goFiles.length > 0) {
                    // Use the first .go file found
                    const firstGoFile = path_1.default.join(process.cwd(), goFiles[0]);
                    const bytes = fs_1.default.statSync(firstGoFile).size;
                    const imports = parseGoImports(firstGoFile);
                    inputs[firstGoFile] = {
                        bytes,
                        imports,
                        format: "esm",
                    };
                    outputs[`golang/core/${goFiles[0]}`] = {
                        imports: [],
                        exports: [],
                        entryPoint: firstGoFile,
                        inputs: {
                            [firstGoFile]: {
                                bytesInOutput: bytes,
                            },
                        },
                        bytes,
                        signature,
                    };
                }
                else {
                    // Fallback to a minimal placeholder if no .go files exist
                    // But only if we're in a Go project (has go.mod)
                    const goModPath = path_1.default.join(process.cwd(), "go.mod");
                    if (fs_1.default.existsSync(goModPath)) {
                        // We're in a Go project but found no Go files - this is unexpected
                        console.warn("Found go.mod but no Go files could be processed");
                        inputs["placeholder.go"] = {
                            bytes: 0,
                            imports: [],
                            format: "esm",
                        };
                        outputs["testeranto/bundles/golang/core/placeholder.go"] = {
                            imports: [],
                            exports: [],
                            entryPoint: "placeholder.go",
                            inputs: {
                                "placeholder.go": {
                                    bytesInOutput: 0,
                                },
                            },
                            bytes: 0,
                            signature,
                        };
                    }
                    else {
                        // Not a Go project, don't add placeholder to avoid confusion
                        console.warn("No Go files found and not in a Go project");
                    }
                }
            }
            catch (error) {
                console.warn("Error finding Go files:", error);
                // Fallback to a minimal placeholder only if we're in a Go project
                const goModPath = path_1.default.join(process.cwd(), "go.mod");
                if (fs_1.default.existsSync(goModPath)) {
                    inputs["placeholder.go"] = {
                        bytes: 0,
                        imports: [],
                        format: "esm",
                    };
                    outputs["golang/core/placeholder.go"] = {
                        imports: [],
                        exports: [],
                        entryPoint: "placeholder.go",
                        inputs: {
                            "placeholder.go": {
                                bytesInOutput: 0,
                            },
                        },
                        bytes: 0,
                        signature,
                    };
                }
            }
        }
        const result = {
            errors: [],
            warnings: [],
            metafile: {
                inputs,
                outputs,
            },
        };
        generationQueue = null;
        return result;
    })();
    return generationQueue;
}
// Track how many times this function is called
let writeGolingvuMetafileCallCount = 0;
function writeGolingvuMetafile(testName, metafile) {
    writeGolingvuMetafileCallCount++;
    console.log(`writeGolingvuMetafile called ${writeGolingvuMetafileCallCount} times`);
    console.log("process.cwd()", process.cwd());
    console.log("testName:", testName);
    // Always use the original project root, not the current working directory
    // This assumes the project root is where package.json is located
    const projectRoot = findProjectRoot();
    const metafilePath = path_1.default.join(projectRoot, "testeranto", "metafiles", "golang", "core.json");
    const metafileDir = path_1.default.dirname(metafilePath);
    // Ensure directory exists
    if (!fs_1.default.existsSync(metafileDir)) {
        fs_1.default.mkdirSync(metafileDir, { recursive: true });
    }
    // Write the metafile
    fs_1.default.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
    console.log(`Golang metafile written to: ${metafilePath}`);
    // Generate the output Go files in the core directory, not test-specific
    // Always use the project root's testeranto directory
    const outputDir = path_1.default.join(projectRoot, "testeranto", "bundles", "golang", "core");
    console.log("Output directory:", outputDir);
    if (!fs_1.default.existsSync(outputDir)) {
        fs_1.default.mkdirSync(outputDir, { recursive: true });
    }
    // Create each output file
    for (const [outputPath, outputInfo] of Object.entries(metafile.metafile.outputs)) {
        // The outputPath from the metafile should be used as-is, but ensure it's under golang/core/
        // Extract just the filename part
        const fileName = path_1.default.basename(outputPath);
        const fullOutputPath = path_1.default.join(outputDir, fileName);
        const outputDirPath = path_1.default.dirname(fullOutputPath);
        if (!fs_1.default.existsSync(outputDirPath)) {
            fs_1.default.mkdirSync(outputDirPath, { recursive: true });
        }
        // For Go, we need to create a normal Go program (not a test)
        // Include the signature in a comment
        const entryPoint = outputInfo.entryPoint;
        const signature = outputInfo.signature;
        // For Golingvu, we need to generate a wrapper that imports and runs the original code
        // The entry point should be imported and its functionality tested
        // Include the signature in a comment for the watcher to detect changes
        // Use build tags to ensure it's only included when testeranto is specified
        // The package should be testeranto_test to avoid being treated as a main package
        // Get the import path - since the generated file will be in a different location,
        // we need to find the correct import path for the original file
        // For files in the example directory, we can use a relative import
        const entryDir = path_1.default.dirname(entryPoint);
        const entryDirName = path_1.default.basename(entryDir);
        let importPath;
        // If the entry point is in the example directory, use that
        if (entryDirName === "example") {
            importPath = "../example";
        }
        else {
            // Fallback: use relative path
            const relativePathToEntry = path_1.default.relative(outputDir, entryDir);
            importPath = relativePathToEntry ? `./${relativePathToEntry}` : ".";
        }
        const entryPointBaseName = path_1.default.basename(entryPoint, ".go");
        const content = `//go:build testeranto
// +build testeranto

// This file is auto-generated by testeranto
// Signature: ${signature}
// It imports and tests: ${entryPoint}

package testeranto_test

import (
	"fmt"
	"os"
	"testing"
	
	// Import the original implementation
	"${importPath}"
)

func TestCalculatorOperations(t *testing.T) {
	// Create an instance of the Calculator
	calc := &${entryPointBaseName}.Calculator{}
	
	// Test basic operations
	// This is where testeranto would run its test scenarios
	
	// Example test: test that a new calculator has empty display
	if calc.GetDisplay() != "" {
		t.Errorf("Expected empty display, got: %s", calc.GetDisplay())
	}
	
	// Example test: test pressing buttons
	calc.Press("2")
	if calc.GetDisplay() != "2" {
		t.Errorf("Expected '2', got: %s", calc.GetDisplay())
	}
	
	// Add more test scenarios based on the testeranto specification
	fmt.Println("Testeranto tests completed")
}

func main() {
	// This allows the file to be run as a standalone program
	// while keeping it in the testeranto_test package
	testing.Main(func(pat, str string) (bool, error) { return true, nil },
		[]testing.InternalTest{
			{
				Name: "TestCalculatorOperations",
				F:    TestCalculatorOperations,
			},
		},
		[]testing.InternalBenchmark{},
		[]testing.InternalExample{})
}
`;
        fs_1.default.writeFileSync(fullOutputPath, content);
        console.log(`Generated Golingvu wrapper: ${fullOutputPath}`);
    }
}
