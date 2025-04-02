import { spawn } from "child_process";
import fs, { watch } from "fs";
import path from "path";
import readline from "readline";
import { glob } from "glob";

import { debounceWatch } from "@bscotch/debounce-watch";

import esbuild from "esbuild";

import esbuildNodeConfiger from "./esbuildConfigs/node.js";
import esbuildWebConfiger from "./esbuildConfigs/web.js";
import webHtmlFrame from "./web.html.js";
import {
  ITestTypes,
  IBaseConfig,
  IRunTime,
  IBuiltConfig,
} from "./lib/types.js";

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

function parseTsErrors(logContent): void {
  fs.writeFileSync("docs/types/log.txt", logContent.join("\n"));

  try {
    const regex = /(^src(.*?))\(\d*,\d*\): error/gm;
    const brokenFilesToLines: Record<string, Set<number>> = {};

    for (let i = 0; i < logContent.length - 1; i++) {
      let m;

      while ((m = regex.exec(logContent[i])) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        if (!brokenFilesToLines[m[1]]) {
          brokenFilesToLines[m[1]] = new Set<number>();
        }
        brokenFilesToLines[m[1]].add(i);
      }
    }

    const final = Object.keys(brokenFilesToLines).reduce((mm, lm, ndx) => {
      mm[lm] = Array.from(brokenFilesToLines[lm]).map((l, ndx3) => {
        const a = Array.from(brokenFilesToLines[lm]);

        return Object.keys(a).reduce((mm2, lm2, ndx2) => {
          const acc: string[] = [];

          let j = a[lm2] + 1;

          let working = true;
          while (j < logContent.length - 1 && working) {
            if (
              !logContent[j].match(regex) &&
              working &&
              !logContent[j].match(/^..\/(.*?)\(\d*,\d*\)/)
            ) {
              acc.push(logContent[j]);
            } else {
              working = false;
            }

            j++;
          }

          mm2[lm] = [logContent[l], ...acc];

          return mm2;
        }, {} as any)[lm];
      });
      return mm;
    }, {});

    Object.keys(final).forEach((k) => {
      fs.mkdirSync(`./docs/types/${k.split("/").slice(0, -1).join("/")}`, {
        recursive: true,
      });
      fs.writeFileSync(
        `./docs/types/${k}.type_errors.txt`,
        final[k].flat().flat().join("\r\n")
      );
    });
  } catch (error) {
    console.error("Error reading or parsing the log file:", error);
    process.exit(1);
  }
}

// function parseLintErrors(logContent): void {
//   fs.writeFileSync("docs/eslint/log.txt", logContent.join("\n"));

//   try {
//     const regex = new RegExp(`^${process.cwd()}/(.*?)`, "gm");
//     const brokenFilesToLines: Record<string, Set<number>> = {};

//     for (let i = 0; i < logContent.length - 1; i++) {
//       let m;

//       while ((m = regex.exec(logContent[i])) !== null) {
//         // This is necessary to avoid infinite loops with zero-width matches
//         if (m.index === regex.lastIndex) {
//           regex.lastIndex++;
//         }
//         if (!brokenFilesToLines[m[1]]) {
//           brokenFilesToLines[m[1]] = new Set<number>();
//         }
//         brokenFilesToLines[m[1]].add(i);
//       }
//     }

//     const final = Object.keys(brokenFilesToLines).reduce((mm, lm, ndx) => {
//       mm[lm] = Array.from(brokenFilesToLines[lm]).map((l, ndx3) => {
//         const a = Array.from(brokenFilesToLines[lm]);

//         return Object.keys(a).reduce((mm2, lm2, ndx2) => {
//           const acc: string[] = [];

//           let j = a[lm2] + 1;

//           let working = true;
//           while (j < logContent.length - 1 && working) {
//             if (
//               !logContent[j].match(regex) &&
//               working
//               // &&
//               // !logContent[j].match(/^..\/(.*?)\(\d*,\d*\)/)
//             ) {
//               acc.push(logContent[j]);
//             } else {
//               working = false;
//             }

//             j++;
//           }

//           mm2[lm] = [logContent[l], ...acc];

//           return mm2;
//         }, {} as any)[lm];
//       });
//       return mm;
//     }, {});

//     Object.keys(final).forEach((k) => {
//       fs.mkdirSync(`./docs/eslint/${k.split("/").slice(0, -1).join("/")}`, {
//         recursive: true,
//       });
//       fs.writeFileSync(
//         `./docs/eslint/${k}.lint_errors.txt`,
//         final[k].flat().flat().join("\r\n")
//       );
//     });
//   } catch (error) {
//     console.error("Error reading or parsing the log file:", error);
//     process.exit(1);
//   }
// }

const typecheck = () => {
  const logContent: string[] = [];
  fs.rmSync("docs/types", { force: true, recursive: true });
  fs.mkdirSync("docs/types");

  const tsc = spawn("tsc", ["-noEmit"]);

  tsc.stdout.on("data", (data) => {
    const lines = data.toString().split("\n");
    logContent.push(...lines);
  });

  tsc.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    process.exit(-1);
  });

  tsc.on("close", (code, x, y) => {
    parseTsErrors(logContent);
  });
};

// const eslint = () => {
//   const logContent: string[] = [];
//   fs.rmSync("docs/eslint", { force: true, recursive: true });
//   fs.mkdirSync("docs/eslint");

//   const tsc = spawn("eslint", ["./src"]);

//   tsc.stdout.on("data", (data) => {
//     const lines = data.toString().split("\n");
//     logContent.push(...lines);
//   });

//   tsc.stderr.on("data", (data) => {
//     console.error(`stderr: ${data}`);
//     process.exit(-1);
//   });

//   tsc.on("close", (code) => {
//     parseLintErrors(logContent);
//   });
// };

type IRunnables = {
  nodeEntryPoints: Record<string, string>;
  webEntryPoints: Record<string, string>;
};

const getRunnables = (
  tests: ITestTypes[],
  payload = {
    nodeEntryPoints: {},
    webEntryPoints: {},
  }
): IRunnables => {
  return tests.reduce((pt, cv, cndx, cry) => {
    if (cv[1] === "node") {
      pt.nodeEntryPoints[cv[0]] = path.resolve(
        `./docs/node/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    } else if (cv[1] === "web") {
      pt.webEntryPoints[cv[0]] = path.resolve(
        `./docs/web/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    }

    if (cv[3].length) {
      getRunnables(cv[3], payload);
    }

    return pt;
  }, payload as IRunnables);
};

import(process.cwd() + "/" + process.argv[2]).then(async (module) => {
  const rawConfig: IBaseConfig = module.default;

  const getSecondaryEndpointsPoints = (runtime?: IRunTime): string[] => {
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
    return Array.from(meta(config.tests, new Set()));
  };

  const config: IBuiltConfig = {
    ...rawConfig,
    buildDir: process.cwd() + "/" + rawConfig.outdir,
  };

  let nodeDone: boolean = false;
  let webDone: boolean = false;
  let mode = config.devMode ? "DEV" : "PROD";
  let status: "build" | "built" = "build";
  // let pm: PM_Main | undefined = new PM_Main(config);
  const fileHashes = {};
  const { nodeEntryPoints, webEntryPoints } = getRunnables(config.tests);

  const onNodeDone = () => {
    nodeDone = true;
    onDone();
  };

  const onWebDone = () => {
    webDone = true;
    onDone();
  };

  // async function fileHash(filePath, algorithm = "md5") {
  //   return new Promise((resolve, reject) => {
  //     const hash = crypto.createHash(algorithm);
  //     const fileStream = fs.createReadStream(filePath);

  //     fileStream.on("data", (data) => {
  //       hash.update(data);
  //     });

  //     fileStream.on("end", () => {
  //       const fileHash = hash.digest("hex");
  //       resolve(fileHash);
  //     });

  //     fileStream.on("error", (error) => {
  //       reject(`Error reading file: ${error.message}`);
  //     });
  //   });
  // }

  const onDone = async () => {
    if (nodeDone && webDone) {
      status = "built";
    }
    if (nodeDone && webDone && status === "built") {
      // Object.entries(nodeEntryPoints).forEach(([k, outputFile]) => {
      //   console.log("watching", outputFile);
      //   try {
      //     watch(outputFile, async (filename) => {
      //       const hash = await fileHash(outputFile);
      //       if (fileHashes[k] !== hash) {
      //         fileHashes[k] = hash;
      //         console.log(`< ${filename} `);
      //         pm.launchNode(k, outputFile);
      //       }
      //     });
      //   } catch (e) {
      //     console.error(e);
      //   }
      // });
      // Object.entries(webEntryPoints).forEach(([k, outputFile]) => {
      //   console.log("watching", outputFile);
      //   watch(outputFile, async (filename) => {
      //     const hash = await fileHash(outputFile);
      //     console.log(`< ${filename} ${hash}`);
      //     if (fileHashes[k] !== hash) {
      //       fileHashes[k] = hash;
      //       pm.launchWeb(k, outputFile);
      //     }
      //   });
      // });
    }

    if (nodeDone && webDone && mode === "PROD") {
      console.log("Testeranto-EsBuild is all done. Goodbye!");
      process.exit();
    } else {
      if (mode === "PROD") {
        console.log("waiting for tests to finish");
        console.log(
          JSON.stringify(
            {
              nodeDone: nodeDone,
              webDone: webDone,
              mode: mode,
            },
            null,
            2
          )
        );
      } else {
        console.log("waiting for tests to change");
      }
      console.log("press 'q' to quit");

      if (config.devMode) {
        console.log("ready and watching for changes...");
      } else {
        // pm.shutDown();
      }
      ////////////////////////////////////////////////////////////////////////////////
    }
  };

  console.log(
    `Press 'q' to shutdown gracefully. Press 'x' to shutdown forcefully.`
  );
  process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
      console.log("Testeranto-EsBuild is shutting down...");
      mode = "PROD";
      onDone();
    }
  });

  // const eslint = new ESLint();
  // const configEslint = await eslint.calculateConfigForFile(
  //   "./src/eslint.config.mjs"
  // );
  // // console.log(`configEslint`, configEslint);
  // fs.watch("src", { recursive: true }, async (eventType, filename) => {
  //   if (eventType === "change") {
  //     console.log(`File ${filename} has been modified.`);
  //     const x = await eslint.lintFiles([`./src/${filename}`]);
  //     console.log(x[0].messages);
  //   } else if (eventType === "rename") {
  //     console.log(`File ${filename} has been created or deleted.`);
  //   }
  // });

  fs.writeFileSync(
    `${config.outdir}/testeranto.json`,
    JSON.stringify(config, null, 2)
  );

  Promise.resolve(
    Promise.all(
      [...getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
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
      })
    )
  );

  glob(`./${config.outdir}/chunk-*.mjs`, {
    ignore: "node_modules/**",
  }).then((chunks) => {
    chunks.forEach((chunk) => {
      fs.unlinkSync(chunk);
    });
  });

  // const processDebouncedEvents: DebouncedEventsProcessor = (events) => {
  //   typecheck();
  // };

  debounceWatch(
    (events) => {
      typecheck();
      // eslint();
    },
    "./src",
    {
      onlyFileExtensions: ["ts", "tsx", "mts"],
      debounceWaitSeconds: 0.2,
      allowOverlappingRuns: false,
    }
  );

  await Promise.all([
    esbuild
      .context(esbuildNodeConfiger(config, Object.keys(nodeEntryPoints)))
      .then(async (nodeContext) => {
        if (config.devMode) {
          await nodeContext.watch().then((v) => {
            onNodeDone();
          });
        } else {
          nodeContext.rebuild().then((v) => {
            onNodeDone();
          });
        }

        return nodeContext;
      }),
    esbuild
      .context(esbuildWebConfiger(config, Object.keys(webEntryPoints)))
      .then(async (webContext) => {
        if (config.devMode) {
          await webContext.watch().then((v) => {
            onWebDone();
          });
        } else {
          webContext.rebuild().then((v) => {
            onWebDone();
          });
        }
        return webContext;
      }),
  ]);
});
