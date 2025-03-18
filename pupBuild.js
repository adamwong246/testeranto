import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/Puppeteer.ts'],
  bundle: true,
  format: "esm",
  platform: "node",
  // format: "node",
  outfile: 'dist/prebuild/Puppeteer.mjs',
  // external: ['crypto', 'os'],
  supported: {
    "dynamic-import": true,
  },

  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
})