import * as esbuild from 'esbuild'


// Build the main bundles
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
  target: "node20",
  outdir: 'dist/prebuild',
  // Don't bundle Node.js built-ins
  external: [
    'fs', 'path', 'url', 'child_process', 'util', 'os', 'events', 'stream',
    'http', 'https', 'zlib', 'crypto', 'buffer', 'net', 'dns', 'tls',
    'assert', 'querystring', 'punycode', 'readline', 'repl', 'vm',
    'perf_hooks', 'async_hooks', 'timers', 'console', 'module', 'process',
  ],
  plugins: [],
  supported: {
    "dynamic-import": true,
  },
  logLevel: 'debug',
})

// Clean up the output directory first
// import { rm } from 'fs/promises';
// try {
//   await rm('dist/prebuild/cli', { recursive: true, force: true });
// } catch (error) {
//   // Ignore if directory doesn't exist
// }

// Build CLI entry points as ES modules with .js extension
await esbuild.build({
  outExtension: { '.js': '.mjs' },
  entryPoints: [
    'src/cli/cli.ts',
    'src/cli/tui.ts',
  ],
  bundle: true,
  splitting: false,
  format: "esm",
  platform: "node",
  target: "node20",
  outdir: 'dist/prebuild/cli',
  entryNames: '[dir]/[name]',
  packages: "external",
  // Mark Node.js built-ins and esbuild as external
  // external: [
  //   // Node.js built-ins
  //   'fs', 'path', 'url', 'child_process', 'util', 'os', 'events', 'stream',
  //   'http', 'https', 'zlib', 'crypto', 'buffer', 'net', 'dns', 'tls',
  //   'assert', 'querystring', 'punycode', 'readline', 'repl', 'vm',
  //   'perf_hooks', 'async_hooks', 'timers', 'console', 'module', 'process',
  //   // External tools
  //   'esbuild',
  //   // Dependencies that may cause issues
  //   'yoga-layout',
  //   'ink',
  //   // Blessed library
  //   'blessed',
  // ],
  // plugins: allPlugins,
  supported: {
    "dynamic-import": true,
  },
  // logLevel: 'debug',
})

// await esbuild.build({
//   entryPoints: [
//     'src/app/frontend/App.scss',
//     'src/app/frontend/App.tsx',
//   ],
//   bundle: true,
//   format: "iife",
//   platform: "browser",
//   outdir: 'dist/prebuild',
//   logLevel: 'error',
//   loader: {
//     ".scss": "text",
//     ".ttf": "binary",
//     ".png": "binary",
//     ".jpg": "binary",
//   },
//   plugins: [sassPlugin()]
// })
