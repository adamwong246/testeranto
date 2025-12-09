import * as esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

await esbuild.build({
  outExtension: { '.js': '.mjs' },
  entryPoints: [
    'src/init-docs.ts',
    'src/esbuildConfigs/eslint-formatter-testeranto.ts',
    "src/server/builders/node.ts",
    "src/server/builders/web.ts",
    "src/server/builders/golang.ts",
    "src/server/builders/python.ts",
    'src/testeranto.ts',
    // 'src/mothership/mothership.ts',
  ],
  bundle: true,
  format: "esm",
  splitting: true,
  platform: "node",
  target: "node20",
  outdir: "dist/prebuild",
  packages: "external",
  // packages: "external",
  supported: {
    "dynamic-import": true,
  },

  external: [
    "fs", "path", "child_process", "util", "os", "events", "stream",
    "http", "https", "zlib", "crypto", "buffer", "net", "dns", "tls",
    "assert", "querystring", "punycode", "readline", "repl", "vm",
    "perf_hooks", "async_hooks", "timers", "console", "module", "process",
    // External dependencies
    // "commander"
  ],


  // banner: {
  //   js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  // },
})

await esbuild.build({
  entryPoints: [
    'src/frontend/Index.tsx',
    'src/frontend/ProcessManger.tsx',
    'src/frontend/Report.tsx',
  ],
  bundle: true,
  format: "iife",
  platform: "browser",
  outdir: 'dist/prebuild',
  logLevel: 'error',
  loader: {
    ".scss": "text",
    ".ttf": "binary",
    ".png": "binary",
    ".jpg": "binary",
  },
  plugins: [sassPlugin()]
})
