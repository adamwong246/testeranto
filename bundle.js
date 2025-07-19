import * as esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

await esbuild.build({
  outExtension: { '.js': '.mjs' },
  entryPoints: [
    'src/build.ts',
    'src/run.ts',
    'src/init-docs.ts',
    'src/ReportServer.ts',
    'src/esbuildConfigs/eslint-formatter-testeranto.ts',
    'src/mothership/index.ts'
  ],
  bundle: true,
  format: "esm",
  platform: "node",
  outdir: 'dist/prebuild',
  packages: "external",
  supported: {
    "dynamic-import": true,
  },

  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
})

await esbuild.build({
  entryPoints: [
    'src/TestReport.tsx',
    'src/Project.tsx'
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