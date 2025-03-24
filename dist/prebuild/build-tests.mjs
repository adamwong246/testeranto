import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/build-tests.ts
import process2 from "process";

// src/Project.ts
import { spawn } from "child_process";
import esbuild from "esbuild";
import fs2 from "fs";
import path4 from "path";
import readline from "readline";
import { glob } from "glob";

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
                fs.writeFileSync(
                  promptPath,
                  `
${addableFiles.map((x) => {
                    return `/add ${x}`;
                  }).join("\n")}
  
${typeErrorFiles.map((x) => {
                    return `/read ${x}`;
                  }).join("\n")}
  
/read ${testPaths}
/read ${stdoutPath}
/read ${stderrPath}

/load ${featuresPath}

/code Fix the failing tests described in ${testPaths}. Correct any type signature errors described in the files [${typeErrorFiles.join(
                    ", "
                  )}]. Implement any method which throws "Function not implemented."
`
                );
              }
            });
          }
        });
      }
    }
  };
};

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
      // markdownPlugin({}),
      ...config.nodePlugins.map((p) => p(register2, entryPoints)) || [],
      inputFilesPluginFactory,
      // inputFilesPlugin("node", entryPoints),
      {
        name: "rebuild-notify",
        setup(build) {
          build.onEnd((result) => {
            console.log(`node build ended with ${result.errors.length} errors`);
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
            console.log(`web build ended with ${result.errors.length} errors`);
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

// src/Project.ts
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
var logContent = [];
function parseTsErrors() {
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
      fs2.mkdirSync(`./docs/types/${k.split("/").slice(0, -1).join("/")}`, {
        recursive: true
      });
      fs2.writeFileSync(
        `./docs/types/${k}.type_errors.txt`,
        final[k].flat().flat().join("\r\n")
      );
    });
  } catch (error) {
    console.error("Error reading or parsing the log file:", error);
    process.exit(1);
  }
}
var compile = () => {
  return new Promise((resolve, reject) => {
    const tsc = spawn("tsc", ["-noEmit"]);
    tsc.stdout.on("data", (data) => {
      const lines = data.toString().split("\n");
      logContent.push(...lines);
    });
    tsc.stderr.on("data", (data) => {
    });
    tsc.on("close", (code) => {
      parseTsErrors();
      resolve(`tsc process exited with code ${code}`);
    });
  });
};
var ITProject = class {
  constructor(configs) {
    this.nodeDone = false;
    this.webDone = false;
    this.onNodeDone = () => {
      this.nodeDone = true;
      this.onDone();
    };
    this.onWebDone = () => {
      this.webDone = true;
      this.onDone();
    };
    this.onDone = () => {
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
                mode: this.mode
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
    this.config = configs;
    this.mode = this.config.devMode ? "DEV" : "PROD";
    process.stdin.on("keypress", (str, key) => {
      if (key.name === "q") {
        console.log("Testeranto-EsBuild is shutting down...");
        this.mode = "PROD";
        this.onDone();
      }
    });
    fs2.writeFileSync(
      `${this.config.outdir}/testeranto.json`,
      JSON.stringify(
        {
          ...this.config,
          buildDir: process.cwd() + "/" + this.config.outdir
        },
        null,
        2
      )
    );
    compile();
    Promise.resolve(
      Promise.all(
        [...this.getSecondaryEndpointsPoints("web")].map(
          async (sourceFilePath) => {
            const sourceFileSplit = sourceFilePath.split("/");
            const sourceDir = sourceFileSplit.slice(0, -1);
            const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
            const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
            const htmlFilePath = path4.normalize(
              `${process.cwd()}/${this.config.outdir}/web/${sourceDir.join(
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
          }
        )
      )
    );
    const [nodeEntryPoints, webEntryPoints] = getRunnables(this.config.tests);
    glob(`./${this.config.outdir}/chunk-*.mjs`, {
      ignore: "node_modules/**"
    }).then((chunks) => {
      chunks.forEach((chunk) => {
        fs2.unlinkSync(chunk);
      });
    });
    Promise.all([
      esbuild.context(node_default(this.config, nodeEntryPoints)).then(async (nodeContext) => {
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
      esbuild.context(web_default(this.config, webEntryPoints)).then(async (webContext) => {
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
      })
    ]);
  }
  getSecondaryEndpointsPoints(runtime) {
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
    return Array.from(meta(this.config.tests, /* @__PURE__ */ new Set()));
  }
};
var getRunnables = (tests, payload = [/* @__PURE__ */ new Set(), /* @__PURE__ */ new Set()]) => {
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
  }, payload);
};

// src/build-tests.ts
if (!process2.argv[2]) {
  console.log("You didn't pass a config file");
  process2.exit(-1);
} else {
  import(process2.cwd() + "/" + process2.argv[2]).then((module) => {
    new ITProject(module.default);
  });
}
