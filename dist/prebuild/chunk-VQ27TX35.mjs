import {
  esbuildConfigs_default,
  featuresPlugin_default,
  inputFilesPlugin_default,
  rebuildPlugin_default
} from "./chunk-SFBHYNUJ.mjs";

// src/esbuildConfigs/web.ts
import path from "path";
var web_default = (config, entryPoints, testName, bundlesDir) => {
  const { inputFilesPluginFactory, register } = inputFilesPlugin_default(
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
    outdir: bundlesDir || `testeranto/bundles/web/${testName}`,
    alias: {
      react: path.resolve("./node_modules/react")
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
      ...(config.web.plugins || []).map((p) => p(register, entryPoints)) || []
    ]
  };
};

export {
  web_default
};
