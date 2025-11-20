/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import fs from "fs";
import { findProjectRoot } from "./golingvuMetafile/helpers";
import { collectGoDependencies } from "./golingvuMetafile/fileDiscovery";
import { parseGoImports } from "./golingvuMetafile/importParser";
let generationQueue = null;
export async function generateGolingvuMetafile(testName, entryPoints) {
    // If there's already a generation in progress, wait for it to complete
    if (generationQueue) {
        return generationQueue;
    }
    generationQueue = (async () => {
        const inputs = {};
        const outputs = {};
        const signature = Date.now().toString(36);
        // If entry points are provided, use them directly
        // For test generation, we want to include test files
        const filteredEntryPoints = [];
        for (const entryPoint of entryPoints) {
            // Skip if it's not a .go file
            if (!entryPoint.endsWith(".go")) {
                console.warn(`Skipping non-Go file: ${entryPoint}`);
                continue;
            }
            // Check if the file exists and is a file
            let resolvedPath = entryPoint;
            if (!path.isAbsolute(entryPoint)) {
                resolvedPath = path.join(process.cwd(), entryPoint);
            }
            if (!fs.existsSync(resolvedPath)) {
                console.warn(`Entry point does not exist: ${resolvedPath}`);
                continue;
            }
            if (!fs.statSync(resolvedPath).isFile()) {
                console.warn(`Entry point is not a file: ${resolvedPath}`);
                continue;
            }
            // Add to filtered entry points - don't skip test files for test generation
            filteredEntryPoints.push(resolvedPath);
        }
        entryPoints = filteredEntryPoints;
        // If no valid entry points remain, try to find Go files automatically
        // For test generation, include all files including test files
        // if (entryPoints.length === 0) {
        //   const allGoFiles = findGoFilesInProject();
        //   // Don't filter out test files
        //   entryPoints = allGoFiles.filter((file) => {
        //     const fileName = path.basename(file);
        //     // Only exclude our generated files
        //     return (
        //       !fileName.endsWith(".golingvu.test.go") &&
        //       !fileName.endsWith(".golingvu.go")
        //     );
        //   });
        //   if (entryPoints.length === 0) {
        //     console.warn("No Go files found in the project");
        //   } else {
        //     console.log(`Found ${entryPoints.length} Go files:`, entryPoints);
        //   }
        // }
        // Process all valid entry points to collect their dependencies
        const allDependencies = new Set();
        const validEntryPoints = [];
        for (let i = 0; i < entryPoints.length; i++) {
            let entryPoint = entryPoints[i];
            // Resolve and validate the entry point path
            let resolvedPath = entryPoint;
            if (!path.isAbsolute(entryPoint)) {
                resolvedPath = path.join(process.cwd(), entryPoint);
            }
            if (!fs.existsSync(resolvedPath)) {
                console.warn(`Entry point ${entryPoint} does not exist at ${resolvedPath}`);
                continue;
            }
            // Update the entry point to use the resolved path
            entryPoints[i] = resolvedPath;
            entryPoint = resolvedPath;
            // Don't skip test files for test generation
            validEntryPoints.push(entryPoint);
            // Collect dependencies for this entry point
            const entryPointDependencies = collectGoDependencies(entryPoint);
            entryPointDependencies.forEach((dep) => allDependencies.add(dep));
        }
        // Process all dependencies to add to inputs
        for (const dep of allDependencies) {
            if (!inputs[dep]) {
                const bytes = fs.statSync(dep).size;
                const imports = parseGoImports(dep);
                // Check if this is a test file
                const isTestFile = path.basename(dep).includes("_test.go") ||
                    path.basename(dep).includes(".golingvu.test.go");
                inputs[dep] = Object.assign({ bytes,
                    imports, format: "esm" }, (isTestFile ? { testeranto: { isTest: true } } : {}));
            }
        }
        // Generate the output path based on the project structure
        // Always use the project root as the base
        const projectRoot = findProjectRoot();
        let outputKey = "";
        if (validEntryPoints.length > 0) {
            const firstEntryPoint = validEntryPoints[0];
            // Get the relative path from project root to the entry point
            const relativePath = path.relative(projectRoot, path.dirname(firstEntryPoint));
            // Get the base name without extension
            const baseName = path.basename(firstEntryPoint, ".go");
            // Construct the output key
            // Ensure relativePath is not empty
            const outputPath = relativePath === "" ? baseName : path.join(relativePath, baseName);
            outputKey = `golang/${path.basename(projectRoot)}/${outputPath}.golingvu.go`;
        }
        else {
            // Fallback if no valid entry points
            outputKey = `golang/core/main.golingvu.go`;
        }
        // Calculate total bytes from all inputs
        const inputBytes = {};
        let totalBytes = 0;
        for (const inputPath in inputs) {
            const bytes = inputs[inputPath].bytes;
            inputBytes[inputPath] = { bytesInOutput: bytes };
            totalBytes += bytes;
        }
        // Store the first valid entry point for use in the wrapper generation
        const firstEntryPoint = validEntryPoints.length > 0 ? validEntryPoints[0] : "";
        outputs[outputKey] = {
            imports: [],
            exports: [],
            entryPoint: firstEntryPoint,
            inputs: inputBytes,
            bytes: totalBytes,
            signature,
        };
        // If no valid entry points were found, log a warning
        if (validEntryPoints.length === 0) {
            console.warn("No valid Go files found to process");
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
