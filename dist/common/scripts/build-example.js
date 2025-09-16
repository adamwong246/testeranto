"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
console.log("Building example project (ES module version)...");
try {
    // Always work from the project root
    const projectRoot = path_1.default.resolve(import.meta.dirname, "..");
    console.log(`Project root: ${projectRoot}`);
    // Change to project root
    process.chdir(projectRoot);
    console.log(`Current working directory (build-example): ${projectRoot}`);
    // The example directory is now relative to project root
    const exampleDir = path_1.default.join(projectRoot, "example");
    console.log(`Example directory: ${exampleDir}`);
    // Ensure go.mod exists - create one if it doesn't
    const goModPath = path_1.default.join(exampleDir, "go.mod");
    if (!fs_1.default.existsSync(goModPath)) {
        console.log("go.mod not found, creating a new one...");
        const defaultGoMod = `module example

go 1.19
`;
        fs_1.default.writeFileSync(goModPath, defaultGoMod);
        console.log("Created default go.mod");
    }
    else {
        // Read the existing go.mod and remove any replace directives
        let goModContent = fs_1.default.readFileSync(goModPath, "utf8");
        // Remove any replace directives that might cause issues
        const lines = goModContent.split('\n').filter(line => !line.trim().startsWith('replace '));
        // Also remove any require directives for testeranto
        const cleanedLines = lines.filter(line => !line.trim().startsWith('require github.com/adamwong246/testeranto'));
        goModContent = cleanedLines.join('\n');
        fs_1.default.writeFileSync(goModPath, goModContent);
        console.log("Cleaned up go.mod by removing replace and testeranto require directives");
    }
    let goModContent = fs_1.default.readFileSync(goModPath, "utf8");
    // Use go mod edit commands to properly manage the go.mod file
    try {
        // First, ensure we have a module name
        if (!goModContent.includes("module ")) {
            console.log("Initializing go module...");
            (0, child_process_1.execSync)("go mod init example/calculator", {
                stdio: "pipe",
                cwd: exampleDir,
            });
        }
        // Add the replace directive using go mod edit
        console.log("Adding replace directive...");
        (0, child_process_1.execSync)("go mod edit -replace github.com/adamwong246/testeranto=../", {
            stdio: "pipe",
            cwd: exampleDir,
        });
        // Read the updated content
        goModContent = fs_1.default.readFileSync(goModPath, "utf8");
        console.log("Updated go.mod content:");
        console.log(goModContent);
    }
    catch (error) {
        console.error("Error using go mod edit:", error);
        console.log("Falling back to manual go.mod editing...");
        // Fallback to manual editing if go mod edit fails
        const lines = goModContent.split("\n");
        const cleanedLines = [];
        let hasModule = false;
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith("module ")) {
                if (!hasModule) {
                    cleanedLines.push(trimmedLine);
                    hasModule = true;
                }
                continue;
            }
            if (trimmedLine.length > 0) {
                cleanedLines.push(trimmedLine);
            }
        }
        if (!hasModule) {
            cleanedLines.unshift("module example/calculator");
        }
        let hasGoVersion = false;
        for (const line of cleanedLines) {
            if (line.startsWith("go ")) {
                hasGoVersion = true;
                break;
            }
        }
        if (!hasGoVersion) {
            cleanedLines.push("go 1.19");
        }
        let hasReplace = false;
        const correctReplace = "replace github.com/adamwong246/testeranto => ../";
        for (const line of cleanedLines) {
            if (line.includes("replace github.com/adamwong246/testeranto")) {
                hasReplace = true;
                break;
            }
        }
        if (!hasReplace) {
            cleanedLines.push(correctReplace);
        }
        goModContent = cleanedLines.join("\n") + "\n";
        fs_1.default.writeFileSync(goModPath, goModContent);
        console.log("Manually updated go.mod:");
        console.log(goModContent);
    }
    // Run go mod tidy to ensure dependencies are correct and generate go.sum
    console.log("Running go mod tidy...");
    try {
        const tidyOutput = (0, child_process_1.execSync)("go mod tidy -v", {
            stdio: "pipe",
            encoding: "utf-8",
            cwd: exampleDir,
        });
        console.log("go mod tidy output:");
        console.log(tidyOutput);
    }
    catch (error) {
        console.error("go mod tidy failed:");
        console.error("stdout:", (_a = error.stdout) === null || _a === void 0 ? void 0 : _a.toString());
        console.error("stderr:", (_b = error.stderr) === null || _b === void 0 ? void 0 : _b.toString());
        console.error("error:", error);
        // Don't exit on error, as it might be due to missing dependencies
        // that aren't critical for the basic functionality
        console.log("Continuing despite go mod tidy error...");
    }
    console.log("Example project built successfully!");
}
catch (error) {
    console.error("Failed to build example project:");
    console.error(error);
    process.exit(1);
}
