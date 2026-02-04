
import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: [
    'src/index.ts',
  ],
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node20",
  outfile: "dist/module/index.js",
  packages: "external",
  external: [
    "fs", "path", "child_process", "util", "os", "events", "stream",
    "http", "https", "zlib", "crypto", "buffer", "net", "dns", "tls",
    "assert", "querystring", "punycode", "readline", "repl", "vm",
    "perf_hooks", "async_hooks", "timers", "console", "module", "process",
    "vscode"
  ],
})
