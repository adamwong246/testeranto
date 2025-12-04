import * as esbuild from "esbuild";

await esbuild.build({
  outExtension: { ".js": ".mjs" },
  entryPoints: [
    "src/init-docs.ts",
    "src/esbuildConfigs/eslint-formatter-testeranto.ts",
    "src/builders/node.ts",
    "src/builders/web.ts",
    "src/builders/golang.ts",
    "src/builders/python.ts",
    "src/cli/cli.ts",
    "src/cli/tui.ts",
  ],
  bundle: true,
  format: "esm",
  splitting: true,
  platform: "node",
  target: "node20",
  outdir: "dist/prebuild",
  packages: "external",
  // Don't bundle Node.js built-ins
  external: [
    "fs", "path", "child_process", "util", "os", "events", "stream",
    "http", "https", "zlib", "crypto", "buffer", "net", "dns", "tls",
    "assert", "querystring", "punycode", "readline", "repl", "vm",
    "perf_hooks", "async_hooks", "timers", "console", "module", "process",
    // External dependencies
    "commander"
  ],
  plugins: [],
  logLevel: "debug",
});
