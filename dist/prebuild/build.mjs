import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/build.ts
import ansiC from "ansi-colors";
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
    outbase: ".",
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
var inputFilesPlugin_default = (platform, testName2) => {
  const d = `testeranto/bundles/${platform}/${testName2}/`;
  const f = `testeranto/bundles/${platform}/${testName2}/metafile.json`;
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d);
  }
  return {
    register,
    inputFilesPluginFactory: {
      name: "metafileWriter",
      setup(build) {
        build.onEnd((result) => {
          fs.writeFileSync(f, JSON.stringify(result, null, 2));
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
var node_default = (config, entryPoints, testName2) => {
  const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
    "node",
    // entryPoints,
    testName2
  );
  return {
    ...esbuildConfigs_default(config),
    splitting: true,
    outdir: `testeranto/bundles/node/${testName2}/`,
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
    external: ["react", ...config.externals],
    entryPoints: [...entryPoints],
    plugins: [
      featuresPlugin_default,
      inputFilesPluginFactory,
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
      },
      ...config.nodePlugins.map((p) => p(register2, entryPoints)) || []
    ]
  };
};

// src/esbuildConfigs/web.ts
import path2 from "path";
var web_default = (config, entryPoints, testName2) => {
  const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
    "web",
    testName2
  );
  return {
    ...esbuildConfigs_default(config),
    outdir: `testeranto/bundles/web/${testName2}`,
    alias: {
      react: path2.resolve("./node_modules/react")
    },
    metafile: true,
    external: [
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
      },
      ...config.nodePlugins.map((p) => p(register2, entryPoints)) || []
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
var testName = process.argv[2];
var mode = process.argv[3];
if (mode !== "once" && mode !== "dev") {
  console.error(`The 4th argument should be 'dev' or 'once', not '${mode}'.`);
  process.exit(-1);
}
console.log("testeranto is building", testName, mode);
import(process.cwd() + "/testeranto.config.ts").then(async (module) => {
  const bigConfig = module.default;
  const project = bigConfig.projects[testName];
  if (!project) {
    console.error("no project found for", testName, "in testeranto.config.ts");
    process.exit(-1);
  }
  const rawConfig = bigConfig.projects[testName];
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
    buildDir: process.cwd() + "/testeranto/bundles/" + testName
  };
  console.log(
    `Press 'q' to shutdown gracefully. Press 'x' to shutdown forcefully.`
  );
  process.stdin.on("keypress", (str, key) => {
    if (key.name === "q") {
      console.log("Testeranto-Build is shutting down...");
      mode = "once";
      onDone();
    } else if (key.name === "x") {
      console.log("Testeranto-Build is shutting down forcefully...");
      process.exit(-1);
    } else {
      console.log(
        `Press 'q' to shutdown gracefully. Press 'x' to shutdown forcefully.`
      );
    }
  });
  let nodeDone = false;
  let webDone = false;
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
    if (nodeDone && webDone && mode === "once") {
      console.log(ansiC.inverse(`${testName} has been built. Goodbye.`));
      process.exit();
    }
  };
  if (!fs2.existsSync(`testeranto/reports/${testName}`)) {
    fs2.mkdirSync(`testeranto/reports/${testName}`);
  }
  fs2.writeFileSync(
    `${process.cwd()}/testeranto/reports/${testName}/index.html`,
    `
    <!DOCTYPE html>
    <html lang="en">
  
    <head>
      <meta name="description" content="Webpage description goes here" />
      <meta charset="utf-8" />
      <title>kokomoBay - testeranto</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="" />
  
      <link rel="stylesheet" href="/kokomoBay/testeranto/ReportClient.css" />
      <script type="module" src="/kokomoBay/testeranto/ReportClient.js"></script>
  
    </head>
  
    <body>
      <div id="root">
        react is loading
      </div>
    </body>
  
    </html>
        `
  );
  fs2.writeFileSync(
    `testeranto/reports/${testName}/config.json`,
    JSON.stringify(config, null, 2)
  );
  fs2.writeFileSync(
    `${process.cwd()}/testeranto/index.html`,
    `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta name="description" content="Webpage description goes here" />
    <meta charset="utf-8" />
    <title>kokomoBay - testeranto</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="author" content="" />

    <script type="application/json" id="bigConfig">
      ${JSON.stringify(Object.keys(bigConfig.projects))}
    </script>

    <link rel="stylesheet" href="/kokomoBay/testeranto/Project.css" />
    <script type="module" src="/kokomoBay/testeranto/Project.js"></script>

  </head>

  <body>
    <div id="root">
      react is loading
    </div>
  </body>

  </html>
      `
  );
  Promise.resolve(
    Promise.all(
      [...getSecondaryEndpointsPoints("web")].map(async (sourceFilePath) => {
        const sourceFileSplit = sourceFilePath.split("/");
        const sourceDir = sourceFileSplit.slice(0, -1);
        const sourceFileName = sourceFileSplit[sourceFileSplit.length - 1];
        const sourceFileNameMinusJs = sourceFileName.split(".").slice(0, -1).join(".");
        const htmlFilePath = path3.normalize(
          `${process.cwd()}/testeranto/bundles/web/${testName}/${sourceDir.join(
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
  glob(`${process.cwd()}/testeranto/bundles/${testName}/chunk-*.mjs`, {
    ignore: "node_modules/**"
  }).then((chunks) => {
    chunks.forEach((chunk) => {
      fs2.unlinkSync(chunk);
    });
  });
  await Promise.all([
    esbuild.context(
      node_default(config, Object.keys(nodeEntryPoints), testName)
    ).then(async (nodeContext) => {
      if (mode === "dev") {
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
    esbuild.context(
      web_default(config, Object.keys(webEntryPoints), testName)
    ).then(async (webContext) => {
      if (mode === "dev") {
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
