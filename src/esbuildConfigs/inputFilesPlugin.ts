import fs from "fs";
import path from "path";
import type { ImportKind, Metafile, Plugin } from "esbuild";
import { spawn } from "child_process";

const otherInputs: Record<string, Set<string>> = {};

const register = (entrypoint: string, sources: string[]): void => {
  if (!otherInputs[entrypoint]) {
    otherInputs[entrypoint] = new Set();
  }
  sources.forEach((s) => otherInputs[entrypoint].add(s));
};

function tree(meta: Metafile, key: string) {
  const outputKey = Object.keys(meta.outputs).find((k) => {
    return meta.outputs[k].entryPoint === key;
  });

  if (!outputKey) {
    console.error("No outputkey found");
    process.exit(-1);
  }

  return Object.keys(meta.outputs[outputKey].inputs).filter((k) =>
    k.startsWith("src")
  );
}

export default (
  platform: "web" | "node",
  entryPoints: Set<string> | string[]
): {
  register: (entrypoint: string, sources: string[]) => void;
  inputFilesPluginFactory: Plugin;
} => {
  return {
    register,

    inputFilesPluginFactory: {
      name: "metafileWriter",
      setup(build) {
        build.onEnd((result) => {
          console.log("build.onEnd", entryPoints);
          fs.writeFileSync(
            `docs/${platform}/metafile.json`,
            JSON.stringify(result, null, 2)
          );

          if (result.errors.length === 0) {
            entryPoints.forEach((entryPoint) => {
              const filePath = path.join(
                "./docs/",
                platform,
                entryPoint.split(".").slice(0, -1).join("."),
                `inputFiles.json`
              );
              const dirName = path.dirname(filePath);

              if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName, { recursive: true });
              }

              const promptPath = path.join(
                "./docs/",
                platform,
                entryPoint.split(".").slice(0, -1).join("."),
                `prompt.txt`
              );
              const testPaths = path.join(
                "./docs/",
                platform,
                entryPoint.split(".").slice(0, -1).join("."),
                `tests.json`
              );
              const featuresPath = path.join(
                "./docs/",
                platform,
                entryPoint.split(".").slice(0, -1).join("."),
                `featurePrompt.txt`
              );

              const stderrPath = path.join(
                "./docs/",
                platform,
                entryPoint.split(".").slice(0, -1).join("."),
                `stderr.log`
              );
              const stdoutPath = path.join(
                "./docs/",
                platform,
                entryPoint.split(".").slice(0, -1).join("."),
                `stdout.log`
              );

              if (result.metafile) {
                const addableFiles = tree(
                  result.metafile,
                  entryPoint.split("/").slice(1).join("/")
                )
                  .map((y) => {
                    if (otherInputs[y]) {
                      return Array.from(otherInputs[y]);
                    }
                    return y;
                  })
                  .flat();

                const typeErrorFiles = addableFiles.map(
                  (t) => `docs/types/${t}.type_errors.txt`
                );

                const lintPath = path.join(
                  "./docs/",
                  platform,
                  entryPoint.split(".").slice(0, -1).join("."),
                  `lint_errors.txt`
                );

                const tscPath = path.join(
                  "./docs/",
                  platform,
                  entryPoint.split(".").slice(0, -1).join("."),
                  `type_errors.txt`
                );

                fs.writeFileSync(
                  promptPath,
                  `
${addableFiles
  .map((x) => {
    return `/add ${x}`;
  })
  .join("\n")}
  
${typeErrorFiles
  .map((x) => {
    return `/read ${x}`;
  })
  .join("\n")}

/read ${lintPath}
/read ${testPaths}
/read ${stdoutPath}
/read ${stderrPath}

/load ${featuresPath}

/code Fix the failing tests described in ${testPaths}. Correct any type signature errors described in the files [${typeErrorFiles.join(
                    ", "
                  )}]. Implement any method which throws "Function not implemented. Resolve the lint errors described in ${lintPath}"
`
                );

                if (!fs.existsSync(`./docs/${platform}/${entryPoint}/`)) {
                  fs.mkdirSync(`./docs/${platform}/${entryPoint}/`, {
                    recursive: true,
                  });
                }

                console.log("ESLINT", addableFiles);
                fs.writeFileSync(lintPath, "");

                const eslintLogContent: string[] = [];
                const eslintProcess = spawn("eslint", addableFiles);

                eslintProcess.stdout.on("data", (data) => {
                  const lines = data.toString().split("\n");
                  eslintLogContent.push(...lines);
                });

                eslintProcess.stderr.on("data", (data) => {
                  console.error(`stderr: ${data}`);
                  process.exit(-1);
                });

                eslintProcess.on("close", (code) => {
                  console.log("ESLINT", addableFiles, "done");
                  fs.writeFileSync(
                    lintPath,
                    eslintLogContent.filter((l) => l !== "").join("\n")
                  );
                });

                ////////////////////////////////////////////

                console.log("TSC", addableFiles, "done");

                fs.writeFileSync(tscPath, "");
                const tscLogContent: string[] = [];
                const tsc = spawn("tsc", ["-noEmit", ...addableFiles]);

                tsc.stdout.on("data", (data) => {
                  const lines = data.toString().split("\n");
                  tscLogContent.push(...lines);
                });

                tsc.stderr.on("data", (data) => {
                  console.error(`stderr: ${data}`);
                  process.exit(-1);
                });

                tsc.on("close", (code, x, y) => {
                  console.log("TSC", addableFiles, "done");
                  parseTsErrors(tscLogContent, tscPath);
                });
              }
            });
          }
        });
      },
    },
  };
};

function parseTsErrors(logContent, tscPath: string): void {
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
      fs.writeFileSync(tscPath, final[k].flat().flat().join("\r\n"));
    });
  } catch (error) {
    console.error("Error reading or parsing the log file:", error);
    process.exit(1);
  }
}
