import * as esbuild from 'esbuild'

await esbuild.build({
  outExtension: { '.js': '.mjs' },
  entryPoints: ['src/build.ts', 'src/run.ts', 'src/init-docs.ts', 'src/ReportServer.ts', 'src/esbuildConfigs/eslint-formatter-testeranto.ts'],
  bundle: true,
  format: "esm",
  platform: "node",
  // outfile: 'dist/prebuild/cli.mjs'
  outdir: 'dist/prebuild',
  packages: "external",
  supported: {
    "dynamic-import": true,
  },

  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
})

// await esbuild.build({
//   entryPoints: ['src/init-docs.ts'],
//   bundle: true,
//   format: "esm",
//   platform: "node",
//   // format: "node",
//   outfile: 'dist/prebuild/init-docs.mjs',
//   // external: ['crypto', 'os'],
//   supported: {
//     "dynamic-import": true,
//   },

//   banner: {
//     js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
//   },
// })



// await esbuild.build({
//   entryPoints: ['src/cli2.ts'],
//   bundle: true,
//   format: "esm",
//   platform: "node",
//   outfile: 'dist/prebuild/cli2.mjs',
//   packages: "external",
//   supported: {
//     "dynamic-import": true,
//   },

//   banner: {
//     js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
//   },
// })




// await esbuild.build({
//   entryPoints: ['src/ReportServer.ts'],
//   bundle: true,
//   format: "esm",
//   platform: "node",
//   outfile: 'dist/prebuild/ReportServer.mjs',
//   packages: "external",
//   // supported: {
//   //   "dynamic-import": true,
//   // },

//   // banner: {
//   //   js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
//   // },
// })

// await esbuild.build({
//   entryPoints: ['src/esbuildConfigs/eslint-formatter-testeranto.ts'],
//   bundle: true,
//   format: "esm",
//   platform: "node",
//   outfile: 'dist/prebuild/eslint-formatter-testeranto.mjs',
//   packages: "external",
//   // supported: {
//   //   "dynamic-import": true,
//   // },

//   // banner: {
//   //   js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
//   // },
// })


/////////////////////////

await esbuild.build({
  entryPoints: ['src/ReportClient.tsx', 'src/TestReport.tsx', 'src/Project.tsx'],
  bundle: true,
  format: "iife",
  platform: "browser",
  outdir: 'dist/prebuild'
})