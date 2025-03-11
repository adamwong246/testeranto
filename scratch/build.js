import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['./scratch/client.ts'],
  bundle: true,
  outdir: 'dist/scratch',
  target: "esnext",
  format: "esm",
  write: true,
  external: [
    // "testeranto.json",
    // "features.test.ts",
    // "url",
    // "react",

    "path",
    "fs",
    "stream",
    "http",
    "constants",
    "net",
    "assert",
    "tls",
    "os",
    "child_process",
    "readline",
    "zlib",
    "crypto",
    "https",

    "util",
    "process",
    "dns",
  ],

  platform: "browser",
})


await esbuild.build({
  entryPoints: ['./scratch/server.ts'],
  bundle: true,
  outdir: 'dist/scratch',
  target: "esnext",
  format: "esm",
  write: true,
  external: [
    // "testeranto.json",
    // "features.test.ts",
    // "url",
    // "react",

    "path",
    "fs",
    "stream",
    "http",
    "constants",
    "net",
    "assert",
    "tls",
    "os",
    "child_process",
    "readline",
    "zlib",
    "crypto",
    "https",

    "util",
    "process",
    "dns",
  ],

  platform: "node",
  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
})

