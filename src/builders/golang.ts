import { GolingvuBuild } from "../PM/golingvuBuild.js";
import { IBuiltConfig } from "../Types.js";
import path from "path";

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
    
    // Write metafile to the mounted volume
    const metafileDir = '/workspace/testeranto/metafiles/golang';
    const metafilePath = path.join(metafileDir, `${path.basename(configPath, path.extname(configPath))}.json`);
    const fs = await import('fs');
    
    // Ensure the directory exists
    if (!fs.existsSync(metafileDir)) {
      fs.mkdirSync(metafileDir, { recursive: true });
    }
    
    // For golang, we need to generate a metafile structure
    const metafile = {
      entryPoints: entryPoints,
      buildTime: new Date().toISOString(),
      runtime: 'golang'
    };
    fs.writeFileSync(metafilePath, JSON.stringify(metafile, null, 2));
    console.log(`Metafile written to: ${metafilePath}`);
  } catch (error) {
    console.error("Golang build failed:", error);
    console.error("Full error details:", error);
    process.exit(1);
  }
}

runGolangBuild();
