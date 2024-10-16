import * as esbuild from 'esbuild'

let result = await esbuild.build({
  entryPoints: ['src/electron.ts'],
  bundle: true,
  outfile: 'dist/prebuild/electron.js',
  external: [
    "assert",
    "child_process",
    "constants",
    "crypto",
    "fs",
    "http",
    "https",
    "net",
    "os",
    "path",
    "readline",
    "stream",
    "tls",
    "util",
    "zlib",
    "node:module",
    "node:url",
    "node:path",
  ],
  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
  },
  // inject: [`./src/cjs-shim.js`],
})
// yarn esbuild src / electron.ts--outfile = dist / prebuild / electron.js--bundle--external: path--external: http--external: fs--external: net--external: os--external: util--external: https--external: stream--external: tls--external: readline--external: child_process--external: zlib--external: assert--external: crypto--external: constants