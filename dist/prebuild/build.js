import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/build.ts
import fs2 from "fs";
import path3 from "path";
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
var otherInputs = {};
var register = (entrypoint, sources) => {
  if (!otherInputs[entrypoint]) {
    otherInputs[entrypoint] = /* @__PURE__ */ new Set();
  }
  sources.forEach((s) => otherInputs[entrypoint].add(s));
};
var inputFilesPlugin_default = (platform, entryPoints) => {
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
        });
      }
    }
  };
};

// src/esbuildConfigs/featuresPlugin.ts
import path from "path";
var featuresPlugin_default = {
  name: "feature-markdown",
  setup(build) {
    build.onResolve({ filter: /\.md$/ }, (args) => {
      if (args.resolveDir === "")
        return;
      return {
        path: path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path),
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
import path2 from "path";
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
      react: path2.resolve("./node_modules/react")
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

// src/build.ts
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
var getRunnables = (tests, payload = {
  nodeEntryPoints: {},
  webEntryPoints: {}
}) => {
  return tests.reduce((pt, cv, cndx, cry) => {
    if (cv[1] === "node") {
      pt.nodeEntryPoints[cv[0]] = path3.resolve(
        `./docs/node/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    } else if (cv[1] === "web") {
      pt.webEntryPoints[cv[0]] = path3.resolve(
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
        const htmlFilePath = path3.normalize(
          `${process.cwd()}/${config.outdir}/web/${sourceDir.join(
            "/"
          )}/${sourceFileNameMinusJs}.html`
        );
        const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
        return fs2.promises.mkdir(path3.dirname(htmlFilePath), { recursive: true }).then(
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
