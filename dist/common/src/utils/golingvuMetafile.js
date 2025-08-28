"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGolangMetafile = generateGolangMetafile;
exports.writeGolangMetafile = writeGolangMetafile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function generateGolangMetafile(testName, entryPoints) {
    const outputs = {};
    // Process each Go entry point
    for (const entryPoint of entryPoints) {
        try {
            // Get the package directory to find all Go files in the same package
            const entryDir = path_1.default.dirname(entryPoint);
            // Find all .go files in the same directory
            const goFiles = fs_1.default.readdirSync(entryDir)
                .filter(file => file.endsWith('.go'))
                .map(file => path_1.default.join(entryDir, file));
            // Create inputs record
            const inputs = {};
            let totalBytes = 0;
            for (const file of goFiles) {
                try {
                    const stats = fs_1.default.statSync(file);
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
                    const entryStats = fs_1.default.statSync(entryPoint);
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
            const entryDir = path_1.default.dirname(entryPoint);
            // Find all .go files in the same directory
            const goFiles = fs_1.default.readdirSync(entryDir)
                .filter(file => file.endsWith('.go'))
                .map(file => path_1.default.join(entryDir, file));
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
            const stats = fs_1.default.statSync(filePath);
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
function writeGolangMetafile(testName, metafile) {
    const metafileDir = path_1.default.join(process.cwd(), "testeranto", "metafiles", "golang");
    fs_1.default.mkdirSync(metafileDir, { recursive: true });
    const metafilePath = path_1.default.join(metafileDir, `${testName}.json`);
    fs_1.default.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
}
