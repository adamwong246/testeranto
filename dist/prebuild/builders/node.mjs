// src/esbuildConfigs/node.ts
import fs3 from "fs";
import path4 from "path";

// src/esbuildConfigs/featuresPlugin.ts
import path from "path";
var featuresPlugin_default = {
  name: "feature-markdown",
  setup(build) {
    build.onResolve({ filter: /\.md$/ }, (args) => {
      if (args.resolveDir === "")
        return;
      return {
        path: path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path),
        namespace: "feature-markdown"
      };
    });
    build.onLoad(
      { filter: /.*/, namespace: "feature-markdown" },
      async (args) => {
        return {
          contents: `file://${args.path}`,
          loader: "text"
          // contents: JSON.stringify({ path: args.path }),
          // loader: "json",
          // contents: JSON.stringify({
          //   // html: markdownHTML,
          //   raw: markdownContent,
          //   filename: args.path, //path.basename(args.path),
          // }),
          // loader: "json",
        };
      }
    );
  }
};

// src/esbuildConfigs/index.ts
var esbuildConfigs_default = (config) => {
  return {
    // packages: "external",
    target: "esnext",
    format: "esm",
    splitting: true,
    outExtension: { ".js": ".mjs" },
    outbase: ".",
    jsx: "transform",
    bundle: true,
    minify: config.minify === true,
    write: true,
    loader: {
      ".js": "jsx",
      ".png": "binary",
      ".jpg": "binary"
    }
  };
};

// src/esbuildConfigs/inputFilesPlugin.ts
import fs from "fs";
import path2 from "path";
var otherInputs = {};
var register = (entrypoint, sources) => {
  if (!otherInputs[entrypoint]) {
    otherInputs[entrypoint] = /* @__PURE__ */ new Set();
  }
  sources.forEach((s) => otherInputs[entrypoint].add(s));
};
var inputFilesPlugin_default = (platform, testName) => {
  const f = path2.join(process.cwd(), `testeranto/metafiles/${platform}/${testName}.json`);
  const metafilesDir = path2.join(process.cwd(), `testeranto/metafiles/${platform}`);
  if (!fs.existsSync(metafilesDir)) {
    fs.mkdirSync(metafilesDir, { recursive: true });
  }
  return {
    register,
    inputFilesPluginFactory: {
      name: "metafileWriter",
      setup(build) {
        build.onEnd((result) => {
          fs.writeFileSync(f, JSON.stringify(result, null, 2));
        });
      }
    }
  };
};

// src/esbuildConfigs/rebuildPlugin.ts
import fs2 from "fs";
import path3 from "path";
var rebuildPlugin_default = (r) => {
  return {
    name: "rebuild-notify",
    setup: (build) => {
      build.onEnd((result) => {
        console.log(`${r} > build qqq with ${result.errors.length} errors`);
        if (result.errors.length > 0) {
          const errorFile = path3.join(
            process.cwd(),
            `testeranto/reports${r}_build_errors`
          );
          fs2.writeFileSync(errorFile, JSON.stringify(result, null, 2));
        }
      });
    }
  };
};

// src/esbuildConfigs/node.ts
var node_default = (config, entryPoints, testName, bundlesDir) => {
  const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
    "node",
    testName
  );
  const entryPointsObj = {};
  for (const entryPoint of entryPoints) {
    const withoutExt = entryPoint.replace(/\.ts$/, "");
    const baseName = path4.basename(withoutExt);
    const dirName = path4.dirname(entryPoint);
    const outputKey = path4.join(dirName, baseName);
    entryPointsObj[outputKey] = entryPoint;
    console.log(`  ${entryPoint} -> ${outputKey}.mjs`);
  }
  const effectiveBundlesDir = process.env.BUNDLES_DIR || bundlesDir;
  const absoluteBundlesDir = path4.isAbsolute(effectiveBundlesDir) ? effectiveBundlesDir : path4.join(process.cwd(), effectiveBundlesDir);
  return {
    ...esbuildConfigs_default(config),
    // splitting: false, // Disable splitting since each entry point is separate
    outdir: absoluteBundlesDir,
    outbase: ".",
    // Preserve directory structure relative to outdir
    metafile: true,
    supported: {
      "dynamic-import": true
    },
    define: {
      "process.env.FLUENTFFMPEG_COV": "0",
      ENV: `"node"`
    },
    absWorkingDir: process.cwd(),
    platform: "node",
    external: ["react", ...config.node.externals],
    entryPoints: entryPointsObj,
    plugins: [
      featuresPlugin_default,
      inputFilesPluginFactory,
      rebuildPlugin_default("node"),
      ...config.node.plugins.map((p) => p(register2, entryPoints)) || [],
      {
        name: "list-output-files",
        setup(build) {
          build.onEnd((result) => {
            if (result.errors.length === 0) {
              console.log(
                "Build completed successfully. Listing output directory:"
              );
              try {
                let listDir2 = function(dir, indent = "") {
                  const items = fs3.readdirSync(dir, { withFileTypes: true });
                  for (const item of items) {
                    console.log(indent + item.name);
                    if (item.isDirectory()) {
                      listDir2(path4.join(dir, item.name), indent + "  ");
                    }
                  }
                };
                var listDir = listDir2;
                const files = fs3.readdirSync(absoluteBundlesDir);
                console.log("Top level:", files);
                listDir2(absoluteBundlesDir);
              } catch (e) {
                console.log("Error listing output:", e.message);
              }
            }
          });
        }
      }
    ]
  };
};

// src/builders/node.ts
import esbuild from "esbuild";
import path5 from "path";
var fs4 = await import("fs");
console.error("NODE.ts");
async function runNodeBuild() {
  console.error("runNodeBuild");
  try {
    const configPath = process.argv[2];
    if (!configPath) {
      throw new Error("Configuration path not provided");
    }
    const absoluteConfigPath = path5.resolve(process.cwd(), configPath);
    if (!fs4.existsSync(absoluteConfigPath)) {
      throw new Error(`Config file does not exist: ${absoluteConfigPath}`);
    }
    const configModule = await import(absoluteConfigPath);
    const config = configModule.default;
    const entryPoints = Object.keys(config.node.tests);
    const bundlesDir = process.env.BUNDLES_DIR;
    const buildOptions = node_default(
      config,
      entryPoints,
      configPath,
      bundlesDir
    );
    const result = await esbuild.build(buildOptions);
    const metafileDir = process.env.METAFILES_DIR || "/workspace/testeranto/metafiles/node";
    const metafilePath = path5.join(
      metafileDir,
      `${path5.basename(configPath, path5.extname(configPath))}.json`
    );
    fs4.writeFileSync(metafilePath, JSON.stringify(result.metafile, null, 2));
  } catch (error) {
    console.error("NODE BUILDER: Build failed:", error);
  }
}
runNodeBuild();
