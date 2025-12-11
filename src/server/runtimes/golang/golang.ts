import path from "path";
import { IBuiltConfig } from "../../../lib";
import { GolingvuBuild } from "../../../clients/golingvuBuild";

async function runGolangBuild() {
  try {
    const configPath = process.argv[2];

    if (!configPath) {
      throw new Error("Configuration path not provided");
    }

    console.log("DEBUG: Golang build started with configPath:", configPath);

    // Dynamically import the TypeScript configuration file
    // Since we're using --loader tsx, we can import .ts files directly
    const absoluteConfigPath = path.resolve(process.cwd(), configPath);

    console.log("DEBUG: Absolute config path:", absoluteConfigPath);

    const configModule = await import(absoluteConfigPath);
    const config: IBuiltConfig = configModule.default;
    console.log("DEBUG: Config loaded successfully");

    const golingvuBuild = new GolingvuBuild(config, configPath);
    console.log("DEBUG: GolingvuBuild instance created");

    const entryPoints = await golingvuBuild.build();
    console.log("DEBUG: Build completed, entry points:", entryPoints);

    console.log(`Golang build completed successfully for test: ${configPath}`);
    console.log(`Entry points: ${entryPoints.join(", ")}`);

    // Use environment variables for output directories
    const metafileDir =
      process.env.METAFILES_DIR || "/workspace/testeranto/metafiles/golang";
    const bundlesDir =
      process.env.BUNDLES_DIR ||
      "/workspace/testeranto/bundles/allTests/golang";
    const fs = await import("fs");

    console.log("GOLANG BUILDER: Using metafiles directory:", metafileDir);
    console.log("GOLANG BUILDER: Using bundles directory:", bundlesDir);

    // Write metafile
    const metafilePath = path.join(
      metafileDir,
      `${path.basename(configPath, path.extname(configPath))}.json`
    );

    // Ensure the directories exist
    if (!fs.existsSync(metafileDir)) {
      fs.mkdirSync(metafileDir, { recursive: true });
    }

    // For golang, we need to generate a metafile structure
    const metafile = {
      entryPoints: entryPoints,
      buildTime: new Date().toISOString(),
      runtime: "golang",
    };
    fs.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
    console.log(`Metafile written to: ${metafilePath}`);

    // Ensure bundles directory exists
    if (!fs.existsSync(bundlesDir)) {
      fs.mkdirSync(bundlesDir, { recursive: true });
      console.log("GOLANG BUILDER: Created bundles directory:", bundlesDir);
    }

    // Note: The actual bundle generation should be handled by GolingvuBuild
    // This is just to ensure the directory exists
  } catch (error) {
    console.error("Golang build failed:", error);
    console.error("Full error details:", error);
    process.exit(1);
  }
}

runGolangBuild();
