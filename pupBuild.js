import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/Puppeteer.ts'],
  platform: "node",
  // banner: {
  //   js: '//comment',
  //   css: '/*comment*/',
  // },
  bundle: true,
  format: "esm",
  platform: "node",
  // format: "node",
  outfile: 'dist/prebuild/Puppeteer.mjs',
  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
})