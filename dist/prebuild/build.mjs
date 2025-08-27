import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/build.ts
import path2 from "path";

// src/utils.ts
import path from "path";
var getRunnables = (tests, projectName, payload = {
  pythonEntryPoints: {},
  nodeEntryPoints: {},
  nodeEntryPointSidecars: {},
  webEntryPoints: {},
  webEntryPointSidecars: {},
  pureEntryPoints: {},
  pureEntryPointSidecars: {},
  golangEntryPoints: {},
  golangEntryPointSidecars: {}
}) => {
  const initializedPayload = {
    pythonEntryPoints: payload.pythonEntryPoints || {},
    nodeEntryPoints: payload.nodeEntryPoints || {},
    nodeEntryPointSidecars: payload.nodeEntryPointSidecars || {},
    webEntryPoints: payload.webEntryPoints || {},
    webEntryPointSidecars: payload.webEntryPointSidecars || {},
    pureEntryPoints: payload.pureEntryPoints || {},
    pureEntryPointSidecars: payload.pureEntryPointSidecars || {},
    golangEntryPoints: payload.golangEntryPoints || {},
    golangEntryPointSidecars: payload.golangEntryPointSidecars || {}
  };
  return tests.reduce((pt, cv, cndx, cry) => {
    if (cv[1] === "node") {
      pt.nodeEntryPoints[cv[0]] = path.resolve(
        `./testeranto/bundles/node/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    } else if (cv[1] === "web") {
      pt.webEntryPoints[cv[0]] = path.resolve(
        `./testeranto/bundles/web/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    } else if (cv[1] === "pure") {
      pt.pureEntryPoints[cv[0]] = path.resolve(
        `./testeranto/bundles/pure/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    } else if (cv[1] === "golang") {
      pt.golangEntryPoints[cv[0]] = path.resolve(cv[0]);
    }
    cv[3].filter((t) => t[1] === "node").forEach((t) => {
      pt.nodeEntryPointSidecars[`${t[0]}`] = path.resolve(
        `./testeranto/bundles/node/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    });
    cv[3].filter((t) => t[1] === "web").forEach((t) => {
      pt.webEntryPointSidecars[`${t[0]}`] = path.resolve(
        `./testeranto/bundles/web/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    });
    cv[3].filter((t) => t[1] === "pure").forEach((t) => {
      pt.pureEntryPointSidecars[`${t[0]}`] = path.resolve(
        `./testeranto/bundles/pure/${projectName}/${cv[0].split(".").slice(0, -1).concat("mjs").join(".")}`
      );
    });
    cv[3].filter((t) => t[1] === "golang").forEach((t) => {
      pt.golangEntryPointSidecars[`${t[0]}`] = path.resolve(t[0]);
    });
    return pt;
  }, initializedPayload);
};

// src/build.ts
var config = {
  ...rawConfig,
  buildDir: process.cwd() + "/testeranto/bundles/" + testName
};
var {
  pythonEntryPoints,
  nodeEntryPoints,
  nodeEntryPointSidecars,
  webEntryPoints,
  webEntryPointSidecars,
  pureEntryPoints,
  pureEntryPointSidecars,
  golangEntryPoints,
  golangEntryPointSidecars
} = getRunnables(config.tests, testName);
var golangFiles = [
  ...Object.keys(golangEntryPoints),
  ...Object.keys(golangEntryPointSidecars)
];
var golangDone = false;
var onDone = async () => {
  if (nodeDone && webDone && importDone && golangDone) {
    status = "built";
  }
  if (nodeDone && webDone && importDone && golangDone && mode === "once") {
    console.log(
      ansiC.inverse(
        `${testName} was built and the builder exited successfully.`
      )
    );
    process.exit();
  }
};
var onGolangDone = () => {
  golangDone = true;
  onDone();
};
if (golangFiles.length > 0) {
  console.log(`Processing ${golangFiles.length} Go files for runtime "golang"`);
  const inputEntries = await Promise.all(
    golangFiles.map(async (file) => {
      try {
        const filePath = golangEntryPoints[file] || golangEntryPointSidecars[file];
        const stats = await fs.promises.stat(filePath);
        return [
          file,
          {
            bytes: stats.size,
            imports: []
          }
        ];
      } catch (error) {
        console.error(`Error getting file size for ${file}:`, error);
        return [
          file,
          {
            bytes: 0,
            imports: []
          }
        ];
      }
    })
  );
  const goMetafile = {
    inputs: Object.fromEntries(inputEntries),
    outputs: {
      [`${config.buildDir}/golang/bin/${testName}`]: {
        imports: [],
        exports: [],
        entryPoint: golangFiles[0],
        // Use the first .go file as entry point
        inputs: Object.fromEntries(
          golangFiles.map((file) => [
            file,
            {
              bytesInOutput: 0
              // This would be the actual size in the binary
            }
          ])
        ),
        bytes: 0
      }
    }
  };
  const metafilePath = `${config.buildDir}/golang.meta.json`;
  await fs.promises.mkdir(path2.dirname(metafilePath), { recursive: true });
  await fs.promises.writeFile(
    metafilePath,
    JSON.stringify(goMetafile, null, 2)
  );
  onGolangDone();
} else {
  console.log('No Go files found for runtime "golang"');
  onGolangDone();
}
var golangProcessingEntryPoints = {};
var golangProcessingSidecars = {};
golangFiles.forEach((file) => {
  if (nodeEntryPoints[file] || webEntryPoints[file] || pureEntryPoints[file]) {
    golangProcessingEntryPoints[file] = allEntryPoints[file];
  }
  if (nodeEntryPointSidecars[file] || webEntryPointSidecars[file] || pureEntryPointSidecars[file]) {
    golangProcessingSidecars[file] = allEntryPoints[file];
  }
});
var x = [
  ["pure", Object.keys(pureEntryPoints)],
  ["node", Object.keys(nodeEntryPoints)],
  ["web", Object.keys(webEntryPoints)],
  ["golang", Object.keys(golangProcessingEntryPoints)]
];
[
  [pureEntryPoints, pureEntryPointSidecars, "pure"],
  [webEntryPoints, webEntryPointSidecars, "web"],
  [nodeEntryPoints, nodeEntryPointSidecars, "node"],
  [golangProcessingEntryPoints, golangProcessingSidecars, "golang"]
].forEach(
  ([eps, eps2, runtime]) => {
    [...Object.keys(eps), ...Object.keys(eps2)].forEach((ep) => {
      const fp = path2.resolve(
        `testeranto`,
        `reports`,
        testName,
        ep.split(".").slice(0, -1).join("."),
        runtime
      );
      fs.mkdirSync(fp, { recursive: true });
    });
  }
);
