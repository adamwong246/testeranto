import * as esbuild from 'esbuild';

import fs from "fs";
import path from "path";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const createHash = require("node:crypto").createHash;

console.log("build.sh", process.cwd(), process.argv);

import(process.argv[2]).then(async (testerantoConfigImport) => {

  const testerantoConfig = testerantoConfigImport.default;

  console.log("testerantoConfig", testerantoConfig)

  const entryPoints = [
    testerantoConfig.features,
    ...testerantoConfig.tests.map(([key, sourcefile, className]) => {
      return sourcefile
    })
  ];

  console.log("entryPoints", entryPoints)

  let ctx = await esbuild.context({
    entryPoints,
    bundle: true,
    minify: false,
    format: "esm",
    target: ["esnext"],
    write: true,
    outdir: 'dist/tests',
    packages: 'external',
    plugins: [
      ...testerantoConfig.loaders || [],
      {
        name: 'import-path',
        setup(build) {
          build.onResolve({ filter: /^\.{1,2}\// }, args => {
            const importedPath = args.resolveDir + "/" + args.path;
            const absolutePath = path.resolve(importedPath);
            const absolutePath2 = path.resolve(testerantoConfig.features).split(".ts").slice(0, -1).join('.ts');
            if (absolutePath === absolutePath2) {
              return {
                path: process.cwd() + "/dist/tests/testerantoFeatures.test.js",
                external: true
              }
            } else {
              // if (absolutePath === process.cwd() + "/contracts") {
              //   return {
              //     path: path.resolve(importedPath), external: false
              //   }
              // }
            }
          })
        },
      },

    ],
    external: [
      testerantoConfig.features
    ]
  })

  await ctx.watch()

  let { host, port } = await ctx.serve({
    servedir: 'dist',
  })

  fs.promises.writeFile("./dist/testeranto.config.js", JSON.stringify(testerantoConfig));

})
