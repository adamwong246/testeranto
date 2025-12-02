import * as esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

// Build other entry points without shebang
await esbuild.build({
  outExtension: { '.js': '.mjs' },
  entryPoints: [
    'src/init-docs.ts',
    'src/esbuildConfigs/eslint-formatter-testeranto.ts',
    'src/testeranto.ts'
  ],
  bundle: true,
  format: "esm",
  platform: "node",
  outdir: 'dist/prebuild',
  packages: "external",
  supported: {
    "dynamic-import": true,
  },

  // external: [
  //   "fs", "path", "os", "child_process", "crypto", "http", "https", 
  //   "net", "dns", "stream", "util", "events", "buffer", "url", 
  //   "assert", "tls", "zlib", "querystring", "readline", "cluster", 
  //   "module", "vm", "perf_hooks", "inspector"
  // ],
  banner: {
    // js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
})

await esbuild.build({
  entryPoints: [
    'src/app/frontend/App.scss',
    'src/app/frontend/App.tsx',
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
