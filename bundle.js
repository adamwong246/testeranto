import * as esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

await esbuild.build({
  outExtension: { '.js': '.mjs' },
  entryPoints: [
    'src/init-docs.ts',
    'src/esbuildConfigs/eslint-formatter-testeranto.ts',
    'src/builders/node.ts',
    'src/builders/web.ts',
    'src/builders/golang.ts',
    'src/builders/python.ts',
  ],
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node18",
  outdir: 'dist/prebuild',
  // Don't bundle Node.js built-ins
  external: [
    'fs', 'path', 'url', 'child_process', 'util', 'os', 'events', 'stream',
    'http', 'https', 'zlib', 'crypto', 'buffer', 'net', 'dns', 'tls',
    'assert', 'querystring', 'punycode', 'readline', 'repl', 'vm',
    'perf_hooks', 'async_hooks', 'timers', 'console', 'module', 'process',
    'esbuild' // Add esbuild to external packages
  ],
  supported: {
    "dynamic-import": true,
  },
  logLevel: 'debug',
  // Comment out the banner to avoid import conflicts
  // banner: {
  //   js: `
  // import { createRequire } from 'module';
  // import { fileURLToPath } from 'url';
  // import { dirname } from 'path';
  // const require = createRequire(import.meta.url);
  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = dirname(__filename);
  //   `.trim(),
  // },
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
