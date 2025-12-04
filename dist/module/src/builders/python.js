const fs = await import("fs");
import { PitonoBuild } from "../PM/pitonoBuild.js";
import path from "path";
async function runPythonBuild() {
    try {
        const configPath = process.argv[2];
        if (!configPath) {
            throw new Error("Configuration path not provided");
        }
        const absoluteConfigPath = path.resolve(process.cwd(), configPath);
        const configModule = await import(absoluteConfigPath);
        const config = configModule.default;
        const pitonoBuild = new PitonoBuild(config, configPath);
        const entryPoints = await pitonoBuild.build();
        // Use environment variables for output directories
        const metafileDir = process.env.METAFILES_DIR || "/workspace/testeranto/metafiles/python";
        const bundlesDir = process.env.BUNDLES_DIR || "/workspace/testeranto/bundles/allTests/python";
        console.log("PYTHON BUILDER: Using metafiles directory:", metafileDir);
        console.log("PYTHON BUILDER: Using bundles directory:", bundlesDir);
        // Write metafile
        const metafilePath = path.join(metafileDir, `${path.basename(configPath, path.extname(configPath))}.json`);
        if (!fs.existsSync(metafileDir)) {
            fs.mkdirSync(metafileDir, { recursive: true });
        }
        const metafile = {
            entryPoints: entryPoints,
            buildTime: new Date().toISOString(),
            runtime: "python",
        };
        fs.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
        console.log("PYTHON BUILDER: Metafile written to:", metafilePath);
        // Ensure bundles directory exists
        if (!fs.existsSync(bundlesDir)) {
            fs.mkdirSync(bundlesDir, { recursive: true });
            console.log("PYTHON BUILDER: Created bundles directory:", bundlesDir);
        }
        // Note: The actual bundle generation should be handled by PitonoBuild
        // This is just to ensure the directory exists
    }
    catch (error) {
        console.error("Python build failed:", error);
        process.exit(1);
    }
}
runPythonBuild();
