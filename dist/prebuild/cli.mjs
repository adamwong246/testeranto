import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/cli.ts
import fs2 from "fs";
import path4 from "path";
import readline from "readline";
import { glob } from "glob";
import esbuild from "esbuild";

// src/esbuildConfigs/index.ts
var esbuildConfigs_default = (config) => {
  return {
    // packages: "external",
    target: "esnext",
    format: "esm",
    splitting: true,
    outExtension: { ".js": ".mjs" },
    outbase: config.outbase,
    jsx: "transform",
    bundle: true,
    minify: config.minify === true,
    write: true,
    loader: {
      ".js": "jsx",
      ".png": "binary",
      ".jpg": "binary"
    }
  };
};

// src/esbuildConfigs/inputFilesPlugin.ts
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
var otherInputs = {};
var register = (entrypoint, sources) => {
  if (!otherInputs[entrypoint]) {
    otherInputs[entrypoint] = /* @__PURE__ */ new Set();
  }
  sources.forEach((s) => otherInputs[entrypoint].add(s));
};
function tree(meta, key) {
  const outputKey = Object.keys(meta.outputs).find((k) => {
    return meta.outputs[k].entryPoint === key;
  });
  if (!outputKey) {
    console.error("No outputkey found");
    process.exit(-1);
  }
  return Object.keys(meta.outputs[outputKey].inputs).filter(
    (k) => k.startsWith("src")
  );
}
var inputFilesPlugin_default = (platform, entryPoints) => {
  return {
    register,
    inputFilesPluginFactory: {
      name: "metafileWriter",
      setup(build) {
        build.onEnd((result) => {
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
                ).map((y) => {
                  if (otherInputs[y]) {
                    return Array.from(otherInputs[y]);
                  }
                  return y;
                }).flat();
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
${addableFiles.map((x) => {
                    return `/add ${x}`;
                  }).join("\n")}
  
${typeErrorFiles.map((x) => {
                    return `/read ${x}`;
                  }).join("\n")}

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
                    recursive: true
                  });
                }
                console.log("ESLINT", addableFiles);
                fs.writeFileSync(lintPath, "");
                const eslintLogContent = [];
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
                console.log("TSC", addableFiles, "done");
                fs.writeFileSync(tscPath, "");
                const tscLogContent = [];
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
      }
    }
  };
};
function parseTsErrors(logContent, tscPath) {
  try {
    const regex = /(^src(.*?))\(\d*,\d*\): error/gm;
    const brokenFilesToLines = {};
    for (let i = 0; i < logContent.length - 1; i++) {
      let m;
      while ((m = regex.exec(logContent[i])) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        if (!brokenFilesToLines[m[1]]) {
          brokenFilesToLines[m[1]] = /* @__PURE__ */ new Set();
        }
        brokenFilesToLines[m[1]].add(i);
      }
    }
    const final = Object.keys(brokenFilesToLines).reduce((mm, lm, ndx) => {
      mm[lm] = Array.from(brokenFilesToLines[lm]).map((l, ndx3) => {
        const a = Array.from(brokenFilesToLines[lm]);
        return Object.keys(a).reduce((mm2, lm2, ndx2) => {
          const acc = [];
          let j = a[lm2] + 1;
          let working = true;
          while (j < logContent.length - 1 && working) {
            if (!logContent[j].match(regex) && working && !logContent[j].match(/^..\/(.*?)\(\d*,\d*\)/)) {
              acc.push(logContent[j]);
            } else {
              working = false;
            }
            j++;
          }
          mm2[lm] = [logContent[l], ...acc];
          return mm2;
        }, {})[lm];
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

// src/esbuildConfigs/featuresPlugin.ts
import path2 from "path";
var featuresPlugin_default = {
  name: "feature-markdown",
  setup(build) {
    build.onResolve({ filter: /\.md$/ }, (args) => {
      if (args.resolveDir === "")
        return;
      return {
        path: path2.isAbsolute(args.path) ? args.path : path2.join(args.resolveDir, args.path),
        namespace: "feature-markdown"
      };
    });
    build.onLoad(
      { filter: /.*/, namespace: "feature-markdown" },
      async (args) => {
        return {
          contents: `file://${args.path}`,
          loader: "text"
          // contents: JSON.stringify({ path: args.path }),
          // loader: "json",
          // contents: JSON.stringify({
          //   // html: markdownHTML,
          //   raw: markdownContent,
          //   filename: args.path, //path.basename(args.path),
          // }),
          // loader: "json",
        };
      }
    );
  }
};

// src/esbuildConfigs/node.ts
var node_default = (config, entryPoints) => {
  const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
    "node",
    entryPoints
  );
  return {
    ...esbuildConfigs_default(config),
    splitting: true,
    outdir: config.outdir + "/node",
    // inject: [`./node_modules/testeranto/dist/cjs-shim.js`],
    metafile: true,
    supported: {
      "dynamic-import": true
    },
    define: {
      "process.env.FLUENTFFMPEG_COV": "0"
    },
    absWorkingDir: process.cwd(),
    banner: {
      js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
    },
    platform: "node",
    external: [
      // "testeranto.json",
      // "features.test.js",
      "react",
      // "events",
      // "ganache"
      ...config.externals
    ],
    entryPoints: [...entryPoints],
    plugins: [
      featuresPlugin_default,
      ...config.nodePlugins.map((p) => p(register2, entryPoints)) || [],
      inputFilesPluginFactory,
      // inputFilesPlugin("node", entryPoints),
      {
        name: "rebuild-notify",
        setup(build) {
          build.onEnd((result) => {
            console.log(
              `> node build ended with ${result.errors.length} errors`
            );
            if (result.errors.length > 0) {
              console.log(result);
            }
          });
        }
      }
    ]
  };
};

// src/esbuildConfigs/web.ts
import path3 from "path";
var web_default = (config, entryPoints) => {
  const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
    "web",
    entryPoints
  );
  return {
    ...esbuildConfigs_default(config),
    // inject: ["./node_modules/testeranto/dist/cjs-shim.js"],
    // banner: {
    //   js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
    // },
    // splitting: true,
    outdir: config.outdir + "/web",
    alias: {
      react: path3.resolve("./node_modules/react")
    },
    metafile: true,
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
      "dns"
    ],
    platform: "browser",
    entryPoints: [...entryPoints],
    plugins: [
      featuresPlugin_default,
      // markdownPlugin({}),
      ...config.nodePlugins.map((p) => p(register2, entryPoints)) || [],
      inputFilesPluginFactory,
      {
        name: "rebuild-notify",
        setup(build) {
          build.onEnd((result) => {
            console.log(
              `> web build ended with ${result.errors.length} errors`
            );
            if (result.errors.length > 0) {
              console.log(result);
            }
          });
        }
      }
    ]
  };
};

// src/web.html.ts
var web_html_default = (jsfilePath, htmlFilePath) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <script type="module" src="${jsfilePath}"></script>

</head>

<body>
  <h1>${htmlFilePath}</h1>
  <div id="root">

  </div>
</body>

<footer></footer>

</html>
`;

// src/cli.ts
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
var getRunnables = (tests, payload = {
  nodeEntryPoints: {},
  webEntryPoints: {}
}) => {
  return tests.reduce((pt, cv, cndx, cry) => {
    if (cv[1] === "node") {
      pt.nodeEntryPoints[cv[0]] = path4.resolve(
        `./docs/node/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    } else if (cv[1] === "web") {
      pt.webEntryPoints[cv[0]] = path4.resolve(
        `./docs/web/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    }
    if (cv[3].length) {
      getRunnables(cv[3], payload);
    }
    return pt;
  }, payload);
};
import(process.cwd() + "/" + process.argv[2]).then(async (module) => {
  const rawConfig = module.default;
  const getSecondaryEndpointsPoints = (runtime) => {
    const meta = (ts, st) => {
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
    return Array.from(meta(config.tests, /* @__PURE__ */ new Set()));
  };
  const config = {
    ...rawConfig,
    buildDir: process.cwd() + "/" + rawConfig.outdir
  };
  let nodeDone = false;
  let webDone = false;
  let mode = config.devMode ? "DEV" : "PROD";
  let status = "build";
  const { nodeEntryPoints, webEntryPoints } = getRunnables(config.tests);
  const onNodeDone = () => {
    nodeDone = true;
    onDone();
  };
  const onWebDone = () => {
    webDone = true;
    onDone();
  };
  const onDone = async () => {
    if (nodeDone && webDone) {
      status = "built";
    }
    if (nodeDone && webDone && status === "built") {
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
              nodeDone,
              webDone,
              mode
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
      }
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
  fs2.writeFileSync(
    `${config.outdir}/testeranto.json`,
    JSON.stringify(config, null, 2)
  );
  Promise.resolve(
    Promise.all(
      [...getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
        const sourceFileSplit = sourceFilePath.split("/");
        const sourceDir = sourceFileSplit.slice(0, -1);
        const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
        const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
        const htmlFilePath = path4.normalize(
          `${process.cwd()}/${config.outdir}/web/${sourceDir.join(
            "/"
          )}/${sourceFileNameMinusJs}.html`
        );
        const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
        return fs2.promises.mkdir(path4.dirname(htmlFilePath), { recursive: true }).then(
          (x) => fs2.writeFileSync(
            htmlFilePath,
            web_html_default(jsfilePath, htmlFilePath)
          )
        );
      })
    )
  );
  glob(`./${config.outdir}/chunk-*.mjs`, {
    ignore: "node_modules/**"
  }).then((chunks) => {
    chunks.forEach((chunk) => {
      fs2.unlinkSync(chunk);
    });
  });
  await Promise.all([
    esbuild.context(node_default(config, Object.keys(nodeEntryPoints))).then(async (nodeContext) => {
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
    esbuild.context(web_default(config, Object.keys(webEntryPoints))).then(async (webContext) => {
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
    })
  ]);
});
