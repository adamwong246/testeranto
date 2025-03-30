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
  entryPoints: ['src/cli.ts'],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: 'dist/prebuild/cli.mjs',
  packages: "external",
  supported: {
    "dynamic-import": true,
  },

  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
})

await esbuild.build({
  entryPoints: ['src/cli2.ts'],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: 'dist/prebuild/cli2.mjs',
  packages: "external",
  supported: {
    "dynamic-import": true,
  },

  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
})