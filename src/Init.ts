import fs from "fs";

export default async (partialConfig) => {
  const config = {
    ...partialConfig,
    buildDir: process.cwd() + "/" + partialConfig.outdir,
  };

  fs.writeFileSync(
    `${config.outdir}/testeranto.json`,
    JSON.stringify(
      {
        ...config,
        buildDir: process.cwd() + "/" + config.outdir,
      },
      null,
      2
    )
  );

  fs.copyFileSync(
    "./node_modules/testeranto/dist/prebuild/TaskManFrontEnd.js",
    "./docs/TaskManFrontEnd.js"
  );
  fs.copyFileSync(
    "./node_modules/testeranto/dist/prebuild/TaskManFrontEnd.css",
    "./docs/TaskManFrontEnd.css"
  );

  fs.writeFileSync(
    `${config.outdir}/index.html`,
    `<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />

  <title>TaskMan</title>

  <link rel="stylesheet" href="/docs/TaskManFrontEnd.css" />
  <script type="module" src="/docs/TaskManFrontEnd.js"></script>
</head>

<body><div id="root">react is loading</div></body>

</html>`
  );
};
