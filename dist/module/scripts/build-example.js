import { execSync } from "child_process";
import fs from "fs";
import path from "path";
console.log("Building example project (ES module version)...");
try {
    // Always work from the project root
    const projectRoot = path.resolve(import.meta.dirname, "..");
    console.log(`Project root: ${projectRoot}`);
    // Change to project root
    process.chdir(projectRoot);
    console.log(`Current working directory (build-example): ${projectRoot}`);
    // The example directory is now relative to project root
    const exampleDir = path.join(projectRoot, "example");
    console.log(`Example directory: ${exampleDir}`);
    // Ensure go.mod exists - create one if it doesn't
    const goModPath = path.join(exampleDir, "go.mod");
    if (!fs.existsSync(goModPath)) {
        console.log("go.mod not found, creating a new one...");
        const defaultGoMod = `module example

go 1.19
`;
        fs.writeFileSync(goModPath, defaultGoMod);
        console.log("Created default go.mod");
    }
    else {
        // Read the existing go.mod and remove any replace directives
        let goModContent = fs.readFileSync(goModPath, "utf8");
        // Remove any replace directives that might cause issues
        const lines = goModContent.split('\n').filter(line => !line.trim().startsWith('replace '));
        // Also remove any require directives for testeranto
        const cleanedLines = lines.filter(line => !line.trim().startsWith('require github.com/adamwong246/testeranto'));
        goModContent = cleanedLines.join('\n');
        fs.writeFileSync(goModPath, goModContent);
        console.log("Cleaned up go.mod by removing replace and testeranto require directives");
    }
    // Read the current go.mod content
    let goModContent = fs.readFileSync(goModPath, "utf8");
    // Ensure the module is properly set up
    if (!goModContent.includes("module ")) {
        console.log("Initializing go module...");
        execSync("go mod init example", {
            stdio: "pipe",
            cwd: exampleDir,
        });
        // Re-read the content
        goModContent = fs.readFileSync(goModPath, "utf8");
    }
    // Add the replace directive to point to the local testeranto
    // This tells Go to use the local directory instead of trying to download from GitHub
    if (!goModContent.includes("replace github.com/adamwong246/testeranto")) {
        console.log("Adding replace directive...");
        execSync("go mod edit -replace github.com/adamwong246/testeranto=../", {
            stdio: "pipe",
            cwd: exampleDir,
        });
    }
    // Add the require directive to explicitly list the dependency
    // This ensures the dependency is tracked even if it's not imported directly in the example
    console.log("Adding require directive...");
    try {
        execSync("go mod edit -require github.com/adamwong246/testeranto@v0.0.0", {
            stdio: "pipe",
            cwd: exampleDir,
        });
    }
    catch (error) {
        // It's okay if this fails - the require might already be there
        console.log("Require directive may already exist");
    }
    // Read the updated content
    goModContent = fs.readFileSync(goModPath, "utf8");
    console.log("Updated go.mod content:");
    console.log(goModContent);
    // Run go mod tidy to ensure dependencies are correct
    console.log("Running go mod tidy...");
    try {
        const tidyOutput = execSync("go mod tidy -v", {
            stdio: "pipe",
            encoding: "utf-8",
            cwd: exampleDir,
        });
        console.log("go mod tidy output:");
        console.log(tidyOutput);
    }
    catch (error) {
        console.error("go mod tidy failed:");
        if (error.stdout)
            console.error("stdout:", error.stdout.toString());
        if (error.stderr)
            console.error("stderr:", error.stderr.toString());
        console.error("Continuing despite go mod tidy error...");
    }
    console.log("Example project built successfully!");
}
catch (error) {
    console.error("Failed to build example project:");
    console.error(error);
    process.exit(1);
}
