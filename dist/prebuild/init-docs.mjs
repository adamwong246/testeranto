import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/init-docs.ts
import fs2 from "fs";

// src/Init.ts
import fs from "fs";
var Init_default = async (partialConfig) => {
  const config = {
    ...partialConfig,
    buildDir: process.cwd() + "/" + partialConfig.outdir
  };
  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}`);
  } catch {
  }
  fs.writeFileSync(
    `${config.outdir}/index.html`,
    `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <title>kokomoBay - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />

  <link rel="stylesheet" href="/ReportClient.css" />
  <script type="module" src="/ReportClient.js"></script>

</head>

<body>
  <div id="root">
    react is loading
  </div>
</body>

</html>
    `
  );
  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/ReportClient.js`,
    `${config.outdir}/ReportClient.js`
  );
  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/ReportClient.css`,
    `${config.outdir}/ReportClient.css`
  );
  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/TestReport.js`,
    `${config.outdir}/TestReport.js`
  );
  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/TestReport.css`,
    `${config.outdir}/TestReport.css`
  );
  fs.writeFileSync(
    `${config.outdir}/testeranto.json`,
    JSON.stringify(
      {
        ...config,
        buildDir: process.cwd() + "/" + config.outdir
      },
      null,
      2
    )
  );
  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/node`);
  } catch {
  }
  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/web`);
  } catch {
  }
  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/features`);
  } catch {
  }
  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/ts`);
  } catch {
  }
};

// src/init-docs.ts
console.log("Initializing a testeranto project");
if (!process.argv[2]) {
  console.log("You didn't pass a config file, so I will create one for you.");
  fs2.writeFileSync(
    "testeranto.mts",
    fs2.readFileSync("node_modules/testeranto/src/defaultConfig.ts")
  );
  import(process.cwd() + "/testeranto.mts").then((module) => {
    Init_default(module.default);
  });
} else {
  import(process.cwd() + "/" + process.argv[2]).then((module) => {
    Init_default(module.default);
  });
}
