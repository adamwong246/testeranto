import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import readline from "readline";
import { glob } from "glob";

import esbuildNodeConfiger from "./esbuildConfigs/node.js";
import esbuildWebConfiger from "./esbuildConfigs/web.js";
import webHtmlFrame from "./web.html.js";
import { ITestTypes, IBaseConfig, IRunTime } from "./lib/types.js";

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

export class ITProject {
  config: IBaseConfig;
  mode: `DEV` | `PROD`;
  nodeDone: boolean = false;
  webDone: boolean = false;

  constructor(configs: IBaseConfig) {
    this.config = configs;

    this.mode = this.config.devMode ? "DEV" : "PROD";

    process.stdin.on("keypress", (str, key) => {
      if (key.name === "q") {
        console.log("Testeranto-EsBuild is shutting down...");
        this.mode = "PROD";
        this.onDone();
      }
    });

    fs.writeFileSync(
      `${this.config.outdir}/testeranto.json`,
      JSON.stringify(
        {
          ...this.config,
          buildDir: process.cwd() + "/" + this.config.outdir,
        },
        null,
        2
      )
    );

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
              `${process.cwd()}/${this.config.outdir}/web/${sourceDir.join(
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

    glob(`./${this.config.outdir}/chunk-*.mjs`, {
      ignore: "node_modules/**",
    }).then((chunks) => {
      chunks.forEach((chunk) => {
        fs.unlinkSync(chunk);
      });
    });

    Promise.all([
      esbuild
        .context(esbuildNodeConfiger(this.config, nodeEntryPoints))
        .then(async (nodeContext) => {
          if (this.config.devMode) {
            await nodeContext.watch().then((v) => {
              this.onNodeDone();
            });
          } else {
            nodeContext.rebuild().then((v) => {
              this.onNodeDone();
            });
          }

          return nodeContext;
        }),
      esbuild
        .context(esbuildWebConfiger(this.config, webEntryPoints))
        .then(async (webContext) => {
          if (this.config.devMode) {
            await webContext.watch().then((v) => {
              this.onWebDone();
            });
          } else {
            webContext.rebuild().then((v) => {
              this.onWebDone();
            });
          }
          return webContext;
        }),
    ]);
  }

  onNodeDone = () => {
    this.nodeDone = true;
    this.onDone();
  };
  onWebDone = () => {
    this.webDone = true;
    this.onDone();
  };

  onDone = () => {
    // console.log(this.nodeDone && this.webDone && this.mode === "PROD");
    if (this.nodeDone && this.webDone && this.mode === "PROD") {
      console.log("Testeranto-EsBuild is all done. Goodbye!");
      process.exit();
    } else {
      if (this.mode === "PROD") {
        console.log("waiting for tests to finish");
        console.log(
          JSON.stringify(
            {
              nodeDone: this.nodeDone,
              webDone: this.webDone,
              mode: this.mode,
            },
            null,
            2
          )
        );
      } else {
        console.log("waiting for tests to change");
      }
      console.log("press 'q' to quit");
    }
  };

  public getSecondaryEndpointsPoints(runtime?: IRunTime): string[] {
    const meta = (ts: ITestTypes[], st: Set<string>): Set<string> => {
      ts.forEach((t) => {
        if (t[1] === runtime) {
          st.add(t[0]);
        }
        if (Array.isArray(t[3])) {
          meta(t[3], st);
        }
      });
      return st;
    };
    return Array.from(meta(this.config.tests, new Set()));
  }
}

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

    if (cv[3].length) {
      getRunnables(cv[3], payload);
    }

    return pt;
  }, payload as [Set<string>, Set<string>]);
};
