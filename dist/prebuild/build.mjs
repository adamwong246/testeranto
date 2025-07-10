import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/build.ts
import ansiC from "ansi-colors";
import fs2 from "fs";
import path4 from "path";
import readline from "readline";
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
        setup: (build) => {
          build.onStart(() => {
            console.log(`> node build starting...`);
          });
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
        setup: (build) => {
          build.onStart(() => {
            console.log(`> web build starting...`);
          });
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
      ...(config.webPlugins || []).map((p) => p(register2, entryPoints)) || []
    ]
  };
};

// src/esbuildConfigs/pure.ts
import { isBuiltin } from "node:module";
var pure_default = (config, entryPoints, testName2) => {
  const { inputFilesPluginFactory, register: register2 } = inputFilesPlugin_default(
    "pure",
    testName2
  );
  return {
    ...esbuildConfigs_default(config),
    drop: [],
    splitting: true,
    outdir: `testeranto/bundles/pure/${testName2}/`,
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
        name: "native-node-import-filter",
        setup(build) {
          build.onResolve({ filter: /fs/ }, (args) => {
            if (isBuiltin(args.path)) {
              throw new Error(
                `cannot use native node package "${args.path}" in a "pure" test. If you really want to use this package, convert this test from "pure" to "node"`
              );
            }
            return { path: args.path };
          });
        }
      },
      {
        name: "rebuild-notify",
        setup: (build) => {
          build.onStart(() => {
            console.log(`> pure build starting...`);
          });
          build.onEnd((result) => {
            console.log(
              `> pure build ended with ${result.errors.length} errors`
            );
            if (result.errors.length > 0) {
              console.log(result);
            }
          });
        }
      },
      ...(config.nodePlugins || []).map((p) => p(register2, entryPoints)) || []
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

// src/utils.ts
import path3 from "path";
var getRunnables = (tests, projectName, payload = {
  nodeEntryPoints: {},
  nodeEntryPointSidecars: {},
  webEntryPoints: {},
  webEntryPointSidecars: {},
  pureEntryPoints: {},
  pureEntryPointSidecars: {}
}) => {
  return tests.reduce((pt, cv, cndx, cry) => {
    if (cv[1] === "node") {
      pt.nodeEntryPoints[cv[0]] = path3.resolve(
        `./testeranto/bundles/node/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    } else if (cv[1] === "web") {
      pt.webEntryPoints[cv[0]] = path3.resolve(
        `./testeranto/bundles/web/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    } else if (cv[1] === "pure") {
      pt.pureEntryPoints[cv[0]] = path3.resolve(
        `./testeranto/bundles/pure/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    }
    cv[3].filter((t) => t[1] === "node").forEach((t) => {
      pt.nodeEntryPointSidecars[`${t[0]}`] = path3.resolve(
        `./testeranto/bundles/node/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    });
    cv[3].filter((t) => t[1] === "web").forEach((t) => {
      pt.webEntryPointSidecars[`${t[0]}`] = path3.resolve(
        `./testeranto/bundles/web/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    });
    cv[3].filter((t) => t[1] === "pure").forEach((t) => {
      pt.pureEntryPointSidecars[`${t[0]}`] = path3.resolve(
        `./testeranto/bundles/pure/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    });
    return pt;
  }, payload);
};

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
  const pckge = (await import(`${process.cwd()}/package.json`)).default;
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
  const getSideCars = (runtime) => {
    return Array.from(
      new Set(
        config.tests.reduce((mm, t) => {
          mm = mm.concat(t[3]);
          return mm;
        }, []).filter((t) => {
          return t[1] === runtime;
        }).map((t) => {
          return t[0];
        })
      )
    );
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
  let importDone = false;
  let status = "build";
  const {
    nodeEntryPoints,
    nodeEntryPointSidecars,
    webEntryPoints,
    webEntryPointSidecars,
    pureEntryPoints,
    pureEntryPointSidecars
  } = getRunnables(config.tests, testName);
  const onNodeDone = () => {
    nodeDone = true;
    onDone();
  };
  const onWebDone = () => {
    webDone = true;
    onDone();
  };
  const onImportDone = () => {
    importDone = true;
    onDone();
  };
  const onDone = async () => {
    if (nodeDone && webDone && importDone) {
      status = "built";
    }
    if (nodeDone && webDone && importDone && mode === "once") {
      console.log(ansiC.inverse(`${testName} has been built. Goodbye.`));
      process.exit();
    }
  };
  console.log(`testeranto/reports/${testName}`);
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
      <title>${pckge.name} - testeranto</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="" />
  
      <link rel="stylesheet" href="../ReportClient.css" />
      <script type="module" src="../ReportClient.js"></script>
  
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
    <title>${pckge.name} - testeranto</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="author" content="" />

    <script type="application/json" id="bigConfig">
      ${JSON.stringify(Object.keys(bigConfig.projects))}
    </script>

    <link rel="stylesheet" href="Project.css" />
    <script type="module" src="Project.js"></script>

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
        const htmlFilePath = path4.normalize(
          `${process.cwd()}/testeranto/bundles/web/${testName}/${sourceDir.join(
            "/"
          )}/${sourceFileNameMinusJs}.html`
        );
        const jsfilePath = `./${sourceFileNameMinusJs}.mjs`;
        return fs2.promises.mkdir(path4.dirname(htmlFilePath), { recursive: true }).then(
          (x2) => fs2.writeFileSync(
            htmlFilePath,
            web_html_default(jsfilePath, htmlFilePath)
          )
        );
      })
    )
  );
  const x = [
    ["pure", Object.keys(pureEntryPoints)],
    ["node", Object.keys(nodeEntryPoints)],
    ["web", Object.keys(webEntryPoints)]
    // [
    //   "pure",
    //   [...Object.keys(pureEntryPoints), ...Object.keys(pureEntryPointSidecars)],
    // ],
    // [
    //   "node",
    //   [...Object.keys(nodeEntryPoints), ...Object.keys(nodeEntryPointSidecars)],
    // ],
    // [
    //   "web",
    //   [...Object.keys(webEntryPoints), ...Object.keys(webEntryPointSidecars)],
    // ],
  ];
  x.forEach(async ([runtime, keys]) => {
    console.log(runtime, keys);
    keys.forEach(async (k) => {
      const folder = `testeranto/reports/${testName}/${k.split(".").slice(0, -1).join(".")}/${runtime}`;
      await fs2.mkdirSync(folder, { recursive: true });
      fs2.writeFileSync(
        `${folder}/index.html`,
        `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <title>${testName} - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />

  <link rel="stylesheet" href="../../../../../../TestReport.css" />
  <script src="../../../../../../TestReport.js"></script>

</head>

<body>
  <div id="root"/>
</body>
            `
      );
    });
  });
  [
    [pureEntryPoints, pureEntryPointSidecars, "pure"],
    [webEntryPoints, webEntryPointSidecars, "web"],
    [nodeEntryPoints, nodeEntryPointSidecars, "node"]
  ].forEach(
    ([eps, eps2, runtime]) => {
      [...Object.keys(eps), ...Object.keys(eps2)].forEach((ep) => {
        const fp = path4.resolve(
          `testeranto`,
          `reports`,
          testName,
          ep.split(".").slice(0, -1).join("."),
          runtime
        );
        fs2.mkdirSync(fp, { recursive: true });
      });
    }
  );
  await Promise.all([
    ...[
      [
        pure_default,
        pureEntryPoints,
        pureEntryPointSidecars,
        onImportDone
      ],
      [
        node_default,
        nodeEntryPoints,
        nodeEntryPointSidecars,
        onNodeDone
      ],
      [web_default, webEntryPoints, webEntryPointSidecars, onWebDone]
    ].map(([configer, entryPoints, sidecars, done]) => {
      esbuild.context(
        configer(
          config,
          [...Object.keys(entryPoints), ...Object.keys(sidecars)],
          testName
        )
      ).then(async (ctx) => {
        if (mode === "dev") {
          await ctx.watch().then((v) => {
            done();
          });
        } else {
          ctx.rebuild().then((v) => {
            done();
          });
        }
        return ctx;
      });
    })
  ]);
});
