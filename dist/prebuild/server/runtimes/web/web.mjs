import {
  esbuildConfigs_default,
  featuresPlugin_default,
  inputFilesPlugin_default,
  rebuildPlugin_default
} from "../../../chunk-SFBHYNUJ.mjs";

// src/server/runtimes/common.ts
import esbuild from "esbuild";
import path from "path";
async function runBuild(getEsbuildConfig, getEntryPoints, builderName) {
  console.error(`${builderName}.ts`);
  try {
    const configPath = process.argv[2];
    if (!configPath) {
      throw new Error("Configuration path not provided");
    }
    const fs2 = await import("fs");
    const absoluteConfigPath = path.resolve(process.cwd(), configPath);
    if (!fs2.existsSync(absoluteConfigPath)) {
      throw new Error(`Config file does not exist: ${absoluteConfigPath}`);
    }
    const configModule = await import(absoluteConfigPath);
    const config = configModule.default;
    const entryPoints = getEntryPoints(config);
    const bundlesDir = process.env.BUNDLES_DIR;
    const buildOptions = getEsbuildConfig(
      config,
      entryPoints,
      configPath,
      bundlesDir
    );
    const result = await esbuild.build(buildOptions);
    const metafileDir = process.env.METAFILES_DIR || `/workspace/testeranto/metafiles/${builderName.toLowerCase()}`;
    const metafilePath = path.join(
      metafileDir,
      `${path.basename(configPath, path.extname(configPath))}.json`
    );
    fs2.writeFileSync(metafilePath, JSON.stringify(result.metafile, null, 2));
  } catch (error) {
    console.error(`${builderName.toUpperCase()} BUILDER: Build failed:`, error);
  }
}

// src/esbuildConfigs/web.ts
import fs from "fs";
import path2 from "path";
var web_default = (config, entryPoints, testName, bundlesDir) => {
  const { inputFilesPluginFactory, register } = inputFilesPlugin_default(
    "web",
    testName
  );
  const entryPointsObj = {};
  for (const entryPoint of entryPoints) {
    const withoutExt = entryPoint.replace(/\.ts$/, "");
    const baseName = path2.basename(withoutExt);
    const dirName = path2.dirname(entryPoint);
    const outputKey = path2.join(dirName, baseName);
    entryPointsObj[outputKey] = entryPoint;
  }
  const effectiveBundlesDir = process.env.BUNDLES_DIR || bundlesDir || `testeranto/bundles/allTests/web/`;
  const absoluteBundlesDir = path2.isAbsolute(effectiveBundlesDir) ? effectiveBundlesDir : path2.join(process.cwd(), effectiveBundlesDir);
  return {
    ...esbuildConfigs_default(config),
    define: {
      "process.env.FLUENTFFMPEG_COV": "0",
      ENV: `"web"`
    },
    treeShaking: true,
    outdir: absoluteBundlesDir,
    outbase: ".",
    // Preserve directory structure relative to outdir
    absWorkingDir: process.cwd(),
    // Set working directory for resolving paths
    alias: {
      react: path2.resolve("./node_modules/react")
    },
    metafile: true,
    external: [
      "path",
      "fs",
      "stream",
      "http",
      "constants",
      "net",
      "assert",
      "tls",
      "os",
      "child_process",
      "readline",
      "zlib",
      "crypto",
      "https",
      "util",
      "process",
      "dns"
    ],
    platform: "browser",
    entryPoints: entryPointsObj,
    loader: config.web.loaders,
    plugins: [
      featuresPlugin_default,
      inputFilesPluginFactory,
      rebuildPlugin_default("web"),
      ...(config.web.plugins || []).map((p) => p(register, entryPoints)) || [],
      {
        name: "list-output-files",
        setup(build) {
          build.onEnd((result) => {
            if (result.errors.length === 0) {
              try {
                let listDir2 = function(dir, indent = "") {
                  const items = fs.readdirSync(dir, { withFileTypes: true });
                  for (const item of items) {
                    console.log(indent + item.name);
                    if (item.isDirectory()) {
                      listDir2(path2.join(dir, item.name), indent + "  ");
                    }
                  }
                };
                var listDir = listDir2;
                const files = fs.readdirSync(absoluteBundlesDir);
                listDir2(absoluteBundlesDir);
              } catch (e) {
                console.log("[web esbuild] Error listing output:", e.message);
              }
            }
          });
        }
      }
    ]
  };
};

// src/server/runtimes/web/web.ts
var isDev = process.argv.includes("dev");
runBuild(web_default, (config) => Object.keys(config.web.tests), "WEB");
