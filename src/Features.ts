import { createHash } from 'node:crypto'
import esbuild from "esbuild";
import fs from "fs";
import path from "path";

export class TesterantoFeatures{
  features: any;
  entryPath: string

  constructor(features, entryPath) {
    this.features = features;
    this.entryPath = entryPath;
  }

  builder() {
    const importPathPlugin = {
      name: 'import-path',
      setup(build) {
        build.onResolve({ filter: /^\.{1,2}\// }, args => {
          let x = args.resolveDir + "/" + args.path;
          if (x.split(".ts").length > 1) {
            x = x + ".ts"
          }
          return { path: x, external: true }
        })
      },
    }
    esbuild.build({
      entryPoints: [this.entryPath],
      bundle: true,
      minify: false,
      format: "esm",
      target: ["esnext"],
      write: false,
      packages: 'external',
      plugins: [importPathPlugin],
      external: ['./src/*', './tests/testerantoFeatures.test.ts'],
    }).then((res) => {
      const text = res.outputFiles[0].text;
      const p = "./dist" + (this.entryPath.split(process.cwd()).pop())?.split(".ts")[0] + '.js'
      fs.promises.mkdir(path.dirname(p), { recursive: true }).then(x => {
        fs.promises.writeFile(p, text);
        fs.promises.writeFile("./dist" + (this.entryPath.split(process.cwd()).pop())?.split(".ts")[0] + `.md5`, createHash('md5').update(text).digest('hex'))
      })
    })
  }
}
