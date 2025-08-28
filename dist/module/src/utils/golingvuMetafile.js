import fs from "fs";
import path from "path";
export async function generateGolangMetafile(testName, entryPoints) {
    const outputs = {};
    // Process each Go entry point
    for (const entryPoint of entryPoints) {
        try {
            // Get the package directory to find all Go files in the same package
            const entryDir = path.dirname(entryPoint);
            // Find all .go files in the same directory
            const goFiles = fs.readdirSync(entryDir)
                .filter(file => file.endsWith('.go'))
                .map(file => path.join(entryDir, file));
            // Create inputs record
            const inputs = {};
            let totalBytes = 0;
            for (const file of goFiles) {
                try {
                    const stats = fs.statSync(file);
                    inputs[file] = { bytesInOutput: stats.size };
                    totalBytes += stats.size;
                }
                catch (_a) {
                    inputs[file] = { bytesInOutput: 0 };
                }
            }
            // Add the entry point itself if not already included
            if (!inputs[entryPoint]) {
                try {
                    const entryStats = fs.statSync(entryPoint);
                    inputs[entryPoint] = { bytesInOutput: entryStats.size };
                    totalBytes += entryStats.size;
                }
                catch (_b) {
                    inputs[entryPoint] = { bytesInOutput: 0 };
                }
            }
            // The output path should match the Node.js structure - use a path in testeranto/bundles
            // For Go, we don't have actual bundled outputs, so we'll use a placeholder
            const outputPath = `testeranto/bundles/golang/${testName}/${entryPoint}`;
            outputs[outputPath] = {
                entryPoint: entryPoint, // Use the source file path, not the bundle path
                inputs,
                bytes: totalBytes
            };
        }
        catch (error) {
            console.error(`Error processing Go entry point ${entryPoint}:`, error);
        }
    }
    // Create inputs record for the metafile - include all Go files
    const allInputs = {};
    // Collect all unique Go files from all entry points
    const allGoFiles = new Set();
    for (const entryPoint of entryPoints) {
        try {
            const entryDir = path.dirname(entryPoint);
            // Find all .go files in the same directory
            const goFiles = fs.readdirSync(entryDir)
                .filter(file => file.endsWith('.go'))
                .map(file => path.join(entryDir, file));
            goFiles.forEach(file => allGoFiles.add(file));
            // Add the entry point itself
            allGoFiles.add(entryPoint);
        }
        catch (error) {
            console.error(`Error processing Go entry point ${entryPoint} for source files:`, error);
        }
    }
    // Add all Go files to inputs
    for (const filePath of Array.from(allGoFiles)) {
        try {
            const stats = fs.statSync(filePath);
            allInputs[filePath] = {
                bytes: stats.size,
                imports: [] // Go files don't have imports like JS
            };
        }
        catch (_c) {
            allInputs[filePath] = {
                bytes: 0,
                imports: []
            };
        }
    }
    // Reformat outputs to match esbuild structure
    const esbuildOutputs = {};
    for (const [outputPath, output] of Object.entries(outputs)) {
        esbuildOutputs[outputPath] = {
            bytes: output.bytes,
            inputs: output.inputs,
            entryPoint: output.entryPoint
        };
    }
    return {
        errors: [],
        warnings: [],
        metafile: {
            inputs: allInputs,
            outputs: esbuildOutputs
        }
    };
}
export function writeGolangMetafile(testName, metafile) {
    const metafileDir = path.join(process.cwd(), "testeranto", "metafiles", "golang");
    fs.mkdirSync(metafileDir, { recursive: true });
    const metafilePath = path.join(metafileDir, `${testName}.json`);
    fs.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
}
