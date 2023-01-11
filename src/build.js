// /* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");
const createHash = require("node:crypto").createHash;

console.log("hello build.sh", process.cwd(), process.argv);

const testerantoConfig = require(process.argv[2]);

fs.promises.writeFile("./dist/testeranto.config.json", JSON.stringify(testerantoConfig));

esbuild.build({
  entryPoints: [testerantoConfig.features],
  bundle: true,
  minify: false,
  format: "esm",
  target: ["esnext"],
  write: false,
  packages: 'external',
}).then((res) => {
  const text = res.outputFiles[0].text;
  const hash = createHash('md5').update(text).digest('hex');
  const jsFile = process.cwd() + "/dist/tests/testerantoFeatures.test.js";
  const md5File = process.cwd() + "/dist/tests/testerantoFeatures.test.md5";

  fs.promises.mkdir(path.dirname(process.cwd() + "./dist/tests/"), { recursive: true }).then(x => {
    console.log("build.js feature", hash, jsFile);

    fs.promises.writeFile(jsFile, text);
    fs.promises.writeFile(md5File, hash)
  })
});

/////////////////////////////////////////////////////////////////////////////////

testerantoConfig.tests.forEach(([key, sourcefile, className]) => {
  esbuild.build({
    entryPoints: [sourcefile],
    bundle: true,
    minify: false,
    format: "esm",
    target: ["esnext"],
    write: false,
    packages: 'external',
    plugins: [{
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
            // return {
            //   path: path.resolve(importedPath), external: false
            // }
          }
        })
      },
    }],
    external: [
      testerantoConfig.features
    ],
  }).then((res) => {

    const text = res.outputFiles[0].text;

    const pp = "./dist/" + (sourcefile.split(process.cwd()).pop()).split(".ts")[0] + '.js';
    const xx = "./dist/" + (sourcefile.split(process.cwd()).pop()).split(".ts")[0] + `.md5`;

    fs.promises.mkdir(path.dirname(pp), { recursive: true }).then(x => {
      const hash = createHash('md5').update(text).digest('hex');
      console.log("build.js test", key, hash);
      fs.promises.writeFile(pp, text);
      fs.promises.writeFile(xx, hash);
    })
  })
});