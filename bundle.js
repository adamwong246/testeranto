import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/init-docs.ts'],
  bundle: true,
  format: "esm",
  platform: "node",
  // format: "node",
  outfile: 'dist/prebuild/init-docs.mjs',
  // external: ['crypto', 'os'],
  supported: {
    "dynamic-import": true,
  },

  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
})

await esbuild.build({
  entryPoints: ['src/build-tests.ts'],
  bundle: true,
  format: "esm",
  platform: "node",
  // format: "node",
  outfile: 'dist/prebuild/build-tests.mjs',
  // external: ['crypto', 'os'],
  packages: "external",
  supported: {
    "dynamic-import": true,
  },

  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
})

await esbuild.build({
  entryPoints: ['src/run-tests.ts'],
  bundle: true,
  format: "esm",
  platform: "node",
  // format: "node",
  outfile: 'dist/prebuild/run-tests.mjs',
  packages: "external",
  supported: {
    "dynamic-import": true,
  },

  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
})