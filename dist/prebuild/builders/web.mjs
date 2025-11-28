// src/esbuildConfigs/web.ts
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

// src/esbuildConfigs/web.ts
var web_default = (config, entryPoints, testName) => {
  const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
    "web",
    testName
  );
  return {
    ...esbuildConfigs_default(config),
    define: {
      "process.env.FLUENTFFMPEG_COV": "0",
      ENV: `"web"`
    },
    treeShaking: true,
    outdir: `testeranto/bundles/web/${testName}`,
    alias: {
      react: path4.resolve("./node_modules/react")
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
    entryPoints: [...entryPoints],
    loader: config.web.loaders,
    plugins: [
      featuresPlugin_default,
      inputFilesPluginFactory,
      rebuildPlugin_default("web"),
      ...(config.web.plugins || []).map((p) => p(register2, entryPoints)) || []
    ]
  };
};

// src/builders/web.ts
import esbuild from "esbuild";
import path5 from "path";
async function runWebBuild() {
  try {
    console.log("WEB BUILDER: Starting build process inside Docker...");
    console.log("WEB BUILDER: Process args:", process.argv);
    const configPath = process.argv[2];
    if (!configPath) {
      throw new Error("Configuration path not provided");
    }
    console.log("WEB BUILDER: Config path:", configPath);
    console.log("WEB BUILDER: Current working directory:", process.cwd());
    const fs3 = await import("fs");
    const absoluteConfigPath = path5.resolve(process.cwd(), configPath);
    if (!fs3.existsSync(absoluteConfigPath)) {
      throw new Error(`Config file does not exist: ${absoluteConfigPath}`);
    }
    console.log("WEB BUILDER: Config file exists");
    const configModule = await import(absoluteConfigPath);
    const config = configModule.default;
    console.log("WEB BUILDER: Config loaded successfully");
    const entryPoints = Object.keys(config.web.tests);
    console.log("WEB BUILDER: Entry points:", entryPoints);
    if (entryPoints.length === 0) {
      console.log("WEB BUILDER: No web tests found");
      const metafileDir = "/workspace/testeranto/metafiles/web";
      const metafilePath = path5.join(metafileDir, `${path5.basename(configPath, path5.extname(configPath))}.json`);
      if (!fs3.existsSync(metafileDir)) {
        fs3.mkdirSync(metafileDir, { recursive: true });
      }
      const emptyMetafile = {
        entryPoints: [],
        buildTime: (/* @__PURE__ */ new Date()).toISOString(),
        runtime: "web",
        message: "No web tests found"
      };
      fs3.writeFileSync(metafilePath, JSON.stringify(emptyMetafile, null, 2));
      console.log(`WEB BUILDER: Empty metafile written to: ${metafilePath}`);
      return;
    }
    console.log("WEB BUILDER: Starting esbuild...");
    const buildOptions = web_default(config, entryPoints, configPath);
    const result = await esbuild.build(buildOptions);
    if (result.errors.length === 0) {
      console.log(`WEB BUILDER: Build completed successfully for test: ${configPath}`);
      console.log(`WEB BUILDER: Entry points: ${entryPoints.join(", ")}`);
      const metafileDir = "/workspace/testeranto/metafiles/web";
      const metafilePath = path5.join(metafileDir, `${path5.basename(configPath, path5.extname(configPath))}.json`);
      console.log("WEB BUILDER: Writing metafile to:", metafilePath);
      if (!fs3.existsSync(metafileDir)) {
        console.log("WEB BUILDER: Creating metafile directory:", metafileDir);
        fs3.mkdirSync(metafileDir, { recursive: true });
      } else {
        console.log("WEB BUILDER: Metafile directory already exists:", metafileDir);
      }
      if (result.metafile) {
        console.log("WEB BUILDER: Writing metafile content...");
        fs3.writeFileSync(metafilePath, JSON.stringify(result.metafile, null, 2));
        console.log(`WEB BUILDER: Metafile written to: ${metafilePath}`);
        if (fs3.existsSync(metafilePath)) {
          console.log("WEB BUILDER: Metafile verified to exist");
        } else {
          console.log("WEB BUILDER: ERROR: Metafile was not created!");
        }
      } else {
        console.log("WEB BUILDER: No metafile generated by esbuild");
        const basicMetafile = {
          entryPoints,
          buildTime: (/* @__PURE__ */ new Date()).toISOString(),
          runtime: "web",
          message: "Build completed but no esbuild metafile generated"
        };
        fs3.writeFileSync(metafilePath, JSON.stringify(basicMetafile, null, 2));
        console.log(`WEB BUILDER: Basic metafile written to: ${metafilePath}`);
      }
    } else {
      console.error("WEB BUILDER: Build errors:", result.errors);
      process.exit(1);
    }
  } catch (error) {
    console.error("WEB BUILDER: Build failed:", error);
    console.error("WEB BUILDER: Full error:", error);
    process.exit(1);
  }
}
runWebBuild();
