import {
  GolingvuBuild
} from "../../../chunk-5YQS2HQH.mjs";
import "../../../chunk-3X2YHN6Q.mjs";

// src/server/runtimes/golang/golang.ts
import path from "path";
async function runGolangBuild() {
  try {
    const configPath = process.argv[2];
    if (!configPath) {
      throw new Error("Configuration path not provided");
    }
    console.log("DEBUG: Golang build started with configPath:", configPath);
    const absoluteConfigPath = path.resolve(process.cwd(), configPath);
    console.log("DEBUG: Absolute config path:", absoluteConfigPath);
    const configModule = await import(absoluteConfigPath);
    const config = configModule.default;
    console.log("DEBUG: Config loaded successfully");
    const golingvuBuild = new GolingvuBuild(config, configPath);
    console.log("DEBUG: GolingvuBuild instance created");
    const entryPoints = await golingvuBuild.build();
    console.log("DEBUG: Build completed, entry points:", entryPoints);
    console.log(`Golang build completed successfully for test: ${configPath}`);
    console.log(`Entry points: ${entryPoints.join(", ")}`);
    const metafileDir = process.env.METAFILES_DIR || "/workspace/testeranto/metafiles/golang";
    const bundlesDir = process.env.BUNDLES_DIR || "/workspace/testeranto/bundles/allTests/golang";
    const fs = await import("fs");
    console.log("GOLANG BUILDER: Using metafiles directory:", metafileDir);
    console.log("GOLANG BUILDER: Using bundles directory:", bundlesDir);
    const metafilePath = path.join(
      metafileDir,
      `${path.basename(configPath, path.extname(configPath))}.json`
    );
    if (!fs.existsSync(metafileDir)) {
      fs.mkdirSync(metafileDir, { recursive: true });
    }
    const metafile = {
      entryPoints,
      buildTime: (/* @__PURE__ */ new Date()).toISOString(),
      runtime: "golang"
    };
    fs.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
    console.log(`Metafile written to: ${metafilePath}`);
    if (!fs.existsSync(bundlesDir)) {
      fs.mkdirSync(bundlesDir, { recursive: true });
      console.log("GOLANG BUILDER: Created bundles directory:", bundlesDir);
    }
  } catch (error) {
    console.error("Golang build failed:", error);
    console.error("Full error details:", error);
    process.exit(1);
  }
}
runGolangBuild();
