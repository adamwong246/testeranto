import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import readline from "readline";
import { glob } from "glob";

import esbuildNodeConfiger from "./esbuildConfigs/node.js";
import esbuildWebConfiger from "./esbuildConfigs/web.js";
import esbuildFeaturesConfiger from "./esbuildConfigs/features.js";

import webHtmlFrame from "./web.html.js";
import reportHtmlFrame from "./report.html.js";

import { ITestTypes, IBaseConfig, IRunTime } from "./lib/types.js";

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
  if (key.name === "q") {
    process.exit();
  }
});

const getRunnables = (
  tests: ITestTypes[],
  payload = [new Set<string>(), new Set<string>()]
): [Set<string>, Set<string>] => {
  return tests.reduce((pt, cv, cndx, cry) => {
    if (cv[1] === "node") {
      pt[0].add(cv[0]);
    } else if (cv[1] === "web") {
      pt[1].add(cv[0]);
    }

    if (cv[2].length) {
      getRunnables(cv[2], payload);
    }

    return pt;
  }, payload as [Set<string>, Set<string>]);
};

export class ITProject {
  config: IBaseConfig;
  mode: `up` | `down` = `up`;

  constructor(config: IBaseConfig) {
    this.config = config;

    Promise.resolve(
      Promise.all(
        [...this.getSecondaryEndpointsPoints("web")].map(
          async (sourceFilePath) => {
            const sourceFileSplit = sourceFilePath.split("/");
            const sourceDir = sourceFileSplit.slice(0, -1);
            const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
            const sourceFileNameMinusJs = sourceFileName
              .split(".")
              .slice(0, -1)
              .join(".");

            const htmlFilePath = path.normalize(
              `${process.cwd()}/${config.outdir}/web/${sourceDir.join(
                "/"
              )}/${sourceFileNameMinusJs}.html`
            );
            const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;

            return fs.promises
              .mkdir(path.dirname(htmlFilePath), { recursive: true })
              .then((x) =>
                fs.writeFileSync(
                  htmlFilePath,
                  webHtmlFrame(jsfilePath, htmlFilePath)
                )
              );
          }
        )
      )
    );

    const [nodeEntryPoints, webEntryPoints] = getRunnables(this.config.tests);

    glob(`./${config.outdir}/chunk-*.mjs`, { ignore: "node_modules/**" }).then(
      (chunks) => {
        console.log("deleting chunks", chunks);
        chunks.forEach((chunk) => {
          console.log("deleting chunk", chunk);
          fs.unlinkSync(chunk);
        });
      }
    );

    fs.copyFileSync(
      "node_modules/testeranto/dist/prebuild/report.js",
      "./docs/Report.js"
    );
    fs.copyFileSync(
      "node_modules/testeranto/dist/prebuild/report.css",
      "./docs/Report.css"
    );

    fs.writeFileSync(`${config.outdir}/report.html`, reportHtmlFrame());

    Promise.all([
      fs.promises.writeFile(
        `${config.outdir}/testeranto.json`,
        JSON.stringify(
          {
            ...config,
            buildDir: process.cwd() + "/" + config.outdir,
          },
          null,
          2
        )
      ),
      esbuild
        .context(esbuildFeaturesConfiger(config))
        .then(async (featuresContext) => {
          await featuresContext.watch();
          return featuresContext;
        }),
      esbuild
        .context(esbuildNodeConfiger(config, nodeEntryPoints))
        .then(async (nodeContext) => {
          await nodeContext.watch();
          return nodeContext;
        }),
      esbuild
        .context(esbuildWebConfiger(config, webEntryPoints))
        .then(async (esbuildWeb) => {
          await esbuildWeb.watch();
          return esbuildWeb;
        }),
    ]).then(() => {
      console.log("\n Build is running. Press 'q' to quit\n");
    });
  }

  public getSecondaryEndpointsPoints(runtime?: IRunTime): string[] {
    const meta = (ts: ITestTypes[], st: Set<string>): Set<string> => {
      ts.forEach((t) => {
        if (t[1] === runtime) {
          st.add(t[0]);
        }
        if (Array.isArray(t[2])) {
          meta(t[2], st);
        }
      });
      return st;
    };
    return Array.from(meta(this.config.tests, new Set()));
  }
}
