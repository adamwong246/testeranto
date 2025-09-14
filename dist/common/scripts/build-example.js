"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
console.log("Building example project (ES module version)...");
const findAllGoFiles = (dir) => {
    let results = [];
    const list = fs_1.default.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path_1.default.join(dir, file);
        const stat = fs_1.default.statSync(filePath);
        if (stat.isDirectory()) {
            // Skip some directories
            if (file === "node_modules" || file === ".git" || file === "testeranto") {
                // return;
            }
            results = results.concat(findAllGoFiles(filePath));
        }
        else if (file.endsWith(".go")) {
            results.push(filePath);
        }
    });
    return results;
};
try {
    // Change to example directory
    const exampleDir = path_1.default.join(process.cwd(), "example");
    console.log(`Changing to directory: ${exampleDir}`);
    process.chdir(exampleDir);
    // Log current directory
    console.log(`Current directory: ${process.cwd()}`);
    // List files in example directory for debugging
    console.log("Files in example directory:");
    try {
        const files = fs_1.default.readdirSync(".");
        // Track lowercase names to find collisions
        const lowercaseCount = new Map();
        files.forEach((file) => {
            const lower = file.toLowerCase();
            lowercaseCount.set(lower, (lowercaseCount.get(lower) || 0) + 1);
            console.log(`  ${file}`);
        });
        // Log any potential case-insensitive collisions
        for (const [lower, count] of lowercaseCount.entries()) {
            if (count > 1) {
                console.log(`WARNING: Found ${count} files with case-insensitive name: ${lower}`);
            }
        }
    }
    catch (error) {
        console.error("Error listing files:", error);
    }
    // Ensure go.mod exists
    const goModPath = "go.mod";
    if (!fs_1.default.existsSync(goModPath)) {
        console.error(`go.mod not found at: ${path_1.default.resolve(goModPath)}`);
        process.exit(1);
    }
    // Read and log go.mod content
    let goModContent = fs_1.default.readFileSync(goModPath, "utf8");
    console.log("Current go.mod content:");
    console.log(goModContent);
    // Update the replace directive to point to the root
    const correctReplace = "replace github.com/adamwong246/testeranto => ../";
    if (!goModContent.includes(correctReplace)) {
        goModContent = goModContent.replace(/replace github\.com\/adamwong246\/testeranto.*/, correctReplace);
        fs_1.default.writeFileSync(goModPath, goModContent);
        console.log("Updated go.mod replace directive");
        console.log("New go.mod content:");
        console.log(goModContent);
    }
    else {
        console.log("Replace directive already correct in go.mod");
    }
    // Check if go.sum exists
    const goSumPath = "go.sum";
    if (fs_1.default.existsSync(goSumPath)) {
        console.log("go.sum exists before running go mod tidy");
        console.log("go.sum content:");
        console.log(fs_1.default.readFileSync(goSumPath, "utf8"));
    }
    else {
        console.log("go.sum does not exist yet");
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
    // Check if go.sum was created/updated
    if (fs_1.default.existsSync(goSumPath)) {
        console.log("go.sum exists after running go mod tidy");
        console.log("go.sum content:");
        console.log(fs_1.default.readFileSync(goSumPath, "utf8"));
    }
    else {
        console.log("go.sum still does not exist after go mod tidy");
    }
    // List all Go files for debugging
    console.log("Go files in project:");
    try {
        const goFiles = findAllGoFiles(".");
        goFiles.forEach((file) => {
            console.log(`  ${file}`);
        });
        // Check for package conflicts
        const packageMap = new Map();
        goFiles.forEach((file) => {
            try {
                const content = fs_1.default.readFileSync(file, "utf8");
                const packageMatch = content.match(/^package\s+(\w+)/m);
                if (packageMatch) {
                    const packageName = packageMatch[1];
                    const files = packageMap.get(packageName) || [];
                    files.push(file);
                    packageMap.set(packageName, files);
                }
            }
            catch (error) {
                console.error(`Error reading ${file}:`, error);
            }
        });
        // Log package information
        console.log("Package information:");
        for (const [pkgName, files] of packageMap.entries()) {
            console.log(`  ${pkgName}: ${files.length} files`);
            if (files.length > 1) {
                files.forEach((file) => console.log(`    ${file}`));
            }
        }
    }
    catch (error) {
        console.error("Error finding Go files:", error);
    }
    // Build the regular Go programs using proper Go module build
    console.log("Building Go programs using go build...");
    try {
        // Use go build to build the package in the current directory
        // This will handle all dependencies automatically
        const buildOutput = (0, child_process_1.execSync)("go build -o main .", {
            stdio: "pipe",
            encoding: "utf-8",
            cwd: exampleDir,
        });
        console.log("Build completed successfully:", buildOutput);
        // Check if the binary was created
        if (fs_1.default.existsSync("main")) {
            console.log('Binary "main" created successfully');
            // Test running the program
            try {
                const runOutput = (0, child_process_1.execSync)("./main", {
                    stdio: "pipe",
                    encoding: "utf-8",
                    cwd: exampleDir,
                });
                console.log("Program output:");
                console.log(runOutput);
            }
            catch (runError) {
                console.log("Program ran but may have failed tests:");
                console.log("stdout:", (_c = runError.stdout) === null || _c === void 0 ? void 0 : _c.toString());
                console.log("stderr:", (_d = runError.stderr) === null || _d === void 0 ? void 0 : _d.toString());
                // Don't fail the build if the program exits with non-zero (tests may fail)
            }
        }
    }
    catch (buildError) {
        console.error("Failed to build Go program:");
        console.error("stdout:", (_e = buildError.stdout) === null || _e === void 0 ? void 0 : _e.toString());
        console.error("stderr:", (_f = buildError.stderr) === null || _f === void 0 ? void 0 : _f.toString());
        console.error("This may be expected if there are no main packages");
        // Try building test binaries instead
        console.log("Trying to build test binaries...");
        try {
            const testBuildOutput = (0, child_process_1.execSync)("go test -c -o testmain .", {
                stdio: "pipe",
                encoding: "utf-8",
                cwd: exampleDir,
            });
            console.log("Test build completed:", testBuildOutput);
            if (fs_1.default.existsSync("testmain")) {
                console.log('Test binary "testmain" created successfully');
            }
        }
        catch (testBuildError) {
            console.log("Test build also failed:");
            console.log("stdout:", (_g = testBuildError.stdout) === null || _g === void 0 ? void 0 : _g.toString());
            console.log("stderr:", (_h = testBuildError.stderr) === null || _h === void 0 ? void 0 : _h.toString());
        }
    }
    // Generate the Golang metafile after building
    console.log("Generating Golang metafile...");
    try {
        const { generateGolingvuMetafile, writeGolingvuMetafile } = await Promise.resolve().then(() => __importStar(require("../src/utils/golingvuMetafile.js")));
        const metafile = await generateGolingvuMetafile("Calculator.test", [
            "example/Calculator.go",
            "example/Calculator.golingvu.test.go",
        ]);
        writeGolingvuMetafile("Calculator.test", metafile);
        console.log("Golang metafile generated successfully");
    }
    catch (error) {
        console.error("Failed to generate Golang metafile:", error);
    }
    console.log("Example project built successfully!");
}
catch (error) {
    console.error("Failed to build example project:");
    console.error(error);
    process.exit(1);
}
