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
        console.log(`${r} > build ended with ${result.errors.length} errors`);
        if (result.errors.length > 0) {
          const errorFile = path3.join(process.cwd(), `testeranto/reports${r}_build_errors`);
          fs2.writeFileSync(
            errorFile,
            JSON.stringify(result, null, 2)
          );
        }
      });
    }
  };
};

// src/esbuildConfigs/node.ts
var node_default = (config, entryPoints, testName) => {
  const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
    "node",
    testName
  );
  return {
    ...esbuildConfigs_default(config),
    splitting: true,
    outdir: `testeranto/bundles/node/${testName}/`,
    // inject: [`./node_modules/testeranto/dist/cjs-shim.js`],
    metafile: true,
    supported: {
      "dynamic-import": true
    },
    define: {
      "process.env.FLUENTFFMPEG_COV": "0",
      ENV: `"node"`
    },
    absWorkingDir: process.cwd(),
    // banner: {
    //   js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
    // },
    platform: "node",
    external: ["react", ...config.node.externals],
    entryPoints: [...entryPoints],
    plugins: [
      featuresPlugin_default,
      inputFilesPluginFactory,
      rebuildPlugin_default("node"),
      ...config.node.plugins.map((p) => p(register2, entryPoints)) || []
    ]
  };
};

// src/builders/node.ts
import esbuild from "esbuild";
import path4 from "path";
async function runNodeBuild() {
  try {
    console.log("NODE BUILDER: Starting build process inside Docker...");
    console.log("NODE BUILDER: Process args:", process.argv);
    const configPath = process.argv[2];
    if (!configPath) {
      throw new Error("Configuration path not provided");
    }
    console.log("NODE BUILDER: Config path:", configPath);
    const absoluteConfigPath = path4.resolve(process.cwd(), configPath);
    console.log("NODE BUILDER: Absolute config path:", absoluteConfigPath);
    console.log("NODE BUILDER: Current working directory:", process.cwd());
    const fs3 = await import("fs");
    if (!fs3.existsSync(absoluteConfigPath)) {
      throw new Error(`Config file does not exist: ${absoluteConfigPath}`);
    }
    console.log("NODE BUILDER: Config file exists");
    const configModule = await import(absoluteConfigPath);
    const config = configModule.default;
    console.log("NODE BUILDER: Config loaded successfully");
    const entryPoints = Object.keys(config.node.tests);
    console.log("NODE BUILDER: Entry points:", entryPoints);
    if (entryPoints.length === 0) {
      console.log("NODE BUILDER: No node tests found");
      const metafileDir = "/workspace/testeranto/metafiles/node";
      const metafilePath = path4.join(metafileDir, `${path4.basename(configPath, path4.extname(configPath))}.json`);
      if (!fs3.existsSync(metafileDir)) {
        fs3.mkdirSync(metafileDir, { recursive: true });
      }
      const emptyMetafile = {
        entryPoints: [],
        buildTime: (/* @__PURE__ */ new Date()).toISOString(),
        runtime: "node",
        message: "No node tests found"
      };
      fs3.writeFileSync(metafilePath, JSON.stringify(emptyMetafile, null, 2));
      console.log(`NODE BUILDER: Empty metafile written to: ${metafilePath}`);
      return;
    }
    console.log("NODE BUILDER: Starting esbuild...");
    const buildOptions = node_default(config, entryPoints, configPath);
    const result = await esbuild.build(buildOptions);
    if (result.errors.length === 0) {
      console.log(`NODE BUILDER: Build completed successfully for test: ${configPath}`);
      console.log(`NODE BUILDER: Entry points: ${entryPoints.join(", ")}`);
      const metafileDir = "/workspace/testeranto/metafiles/node";
      const metafilePath = path4.join(metafileDir, `${path4.basename(configPath, path4.extname(configPath))}.json`);
      console.log("NODE BUILDER: Writing metafile to:", metafilePath);
      if (!fs3.existsSync(metafileDir)) {
        console.log("NODE BUILDER: Creating metafile directory:", metafileDir);
        fs3.mkdirSync(metafileDir, { recursive: true });
      } else {
        console.log("NODE BUILDER: Metafile directory already exists:", metafileDir);
      }
      if (result.metafile) {
        console.log("NODE BUILDER: Writing metafile content...");
        fs3.writeFileSync(metafilePath, JSON.stringify(result.metafile, null, 2));
        console.log(`NODE BUILDER: Metafile written to: ${metafilePath}`);
        if (fs3.existsSync(metafilePath)) {
          console.log("NODE BUILDER: Metafile verified to exist");
        } else {
          console.log("NODE BUILDER: ERROR: Metafile was not created!");
        }
      } else {
        console.log("NODE BUILDER: No metafile generated by esbuild");
        const basicMetafile = {
          entryPoints,
          buildTime: (/* @__PURE__ */ new Date()).toISOString(),
          runtime: "node",
          message: "Build completed but no esbuild metafile generated"
        };
        fs3.writeFileSync(metafilePath, JSON.stringify(basicMetafile, null, 2));
        console.log(`NODE BUILDER: Basic metafile written to: ${metafilePath}`);
      }
    } else {
      console.error("NODE BUILDER: Build errors:", result.errors);
      process.exit(1);
    }
  } catch (error) {
    console.error("NODE BUILDER: Build failed:", error);
    console.error("NODE BUILDER: Full error:", error);
    process.exit(1);
  }
}
runNodeBuild();
