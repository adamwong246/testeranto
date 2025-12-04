import { execSync } from "child_process";
import fs from "fs";
import path from "path";
/**
 * Build the example Go project by ensuring go.mod is correctly set up
 * and running go mod tidy.
 */
async function main() {
    console.log("Building example project...");
    // Determine paths
    const scriptDir = import.meta.dirname;
    const projectRoot = path.resolve(scriptDir, "..");
    const exampleDir = path.join(projectRoot, "src/example");
    const goModPath = path.join(exampleDir, "go.mod");
    console.log(`Project root: ${projectRoot}`);
    console.log(`Example directory: ${exampleDir}`);
    // Ensure we're in the right place
    if (!fs.existsSync(exampleDir)) {
        throw new Error(`Example directory not found: ${exampleDir}`);
    }
    // Always write a fresh go.mod with the correct content
    // This ensures consistency and avoids complex manipulation
    const goModContent = `module example

go 1.19

replace github.com/adamwong246/testeranto => ../

require github.com/adamwong246/testeranto/src/golingvu v0.0.0-20251009224308-c2fde1410839
`;
    fs.writeFileSync(goModPath, goModContent);
    console.log("Generated go.mod with correct directives");
    // Run go mod tidy to fetch dependencies and verify the module
    console.log("Running go mod tidy...");
    try {
        const output = execSync("go mod tidy", {
            cwd: exampleDir,
            encoding: "utf-8",
            stdio: "pipe",
        });
        console.log("go mod tidy succeeded:");
        console.log(output);
    }
    catch (error) {
        console.error("go mod tidy encountered issues:");
        if (error.stdout)
            console.error("stdout:", error.stdout);
        if (error.stderr)
            console.error("stderr:", error.stderr);
        // Don't exit on error - the module might still be usable
        console.log("Continuing despite tidy warnings/errors");
    }
    console.log("Example project build completed.");
}
main().catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
});
