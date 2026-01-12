import * as esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

// Build main application
await esbuild.build({
  outExtension: { '.js': '.mjs' },
  entryPoints: [
    'src/init-docs.ts',
    'src/esbuildConfigs/eslint-formatter-testeranto.ts',
    'src/server/runtimes/node/node.ts',
    'src/server/runtimes/web/web.ts',
    'src/testeranto.ts',
  ],
  bundle: true,
  format: "esm",
  splitting: true,
  platform: "node",
  target: "node20",
  outdir: "dist/prebuild",
  packages: "external",
  supported: {
    "dynamic-import": true,
  },
  external: [
    "fs", "path", "child_process", "util", "os", "events", "stream",
    "http", "https", "zlib", "crypto", "buffer", "net", "dns", "tls",
    "assert", "querystring", "punycode", "readline", "repl", "vm",
    "perf_hooks", "async_hooks", "timers", "console", "module", "process",
    "vscode"
  ],
})

// Build VS Code extension
try {
  const result = await esbuild.build({
    entryPoints: ['src/vscode/extension.ts'],
    bundle: true,
    format: "esm",  // Use ES modules
    platform: "node",
    target: "node20",
    outdir: "dist/vscode",
    external: ["vscode"],
    outExtension: { '.js': '.mjs' },
    logLevel: 'info',
  });
  console.log("VS Code extension built successfully to dist/vscode/extension.mjs");
  
  // Check if the file was created
  const fs = await import('fs');
  const path = await import('path');
  const outputPath = path.join('dist', 'vscode', 'extension.mjs');
  if (fs.existsSync(outputPath)) {
    console.log(`Output file exists at ${outputPath}`);
    const stats = fs.statSync(outputPath);
    console.log(`File size: ${stats.size} bytes`);
    
    // Read first few lines to verify content
    const content = fs.readFileSync(outputPath, 'utf8');
    const lines = content.split('\n').slice(0, 5).join('\n');
    console.log("First 5 lines of built file:");
    console.log(lines);
    
    // Check if it contains ES module exports
    if (!content.includes('export function activate') && !content.includes('export { activate }')) {
      console.warn("Built file may not have proper ES module exports");
    }
  } else {
    console.error(`Output file does NOT exist at ${outputPath}`);
  }
} catch (error) {
  console.error("Failed to build VS Code extension:", error);
  process.exit(1);
}

// Copy media files for webview
import * as fs from 'fs';
import * as path from 'path';

const mediaDir = 'media';
const distMediaDir = 'dist/vscode/media';

if (!fs.existsSync(distMediaDir)) {
  fs.mkdirSync(distMediaDir, { recursive: true });
}

// Copy icon files
const mediaFiles = ['icon.svg'];
for (const file of mediaFiles) {
  const src = path.join(mediaDir, file);
  const dest = path.join(distMediaDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  } else {
    console.warn(`Media file not found: ${src}`);
  }
}

// Build React app for webviews
await esbuild.build({
  entryPoints: [
    'src/server/serverClasees/ProcessManagerReactApp.tsx',
  ],
  bundle: true,
  format: "iife",
  platform: "browser",
  outdir: 'dist/prebuild',
  logLevel: 'error',
  loader: {
    ".ttf": "binary",
    ".png": "binary",
    ".jpg": "binary",
  },
  plugins: [sassPlugin()]
})
