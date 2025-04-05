import fs from "fs";

export default async (partialConfig) => {
  const config = {
    ...partialConfig,
    buildDir: process.cwd() + "/" + partialConfig.outdir,
  };

  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}`);
  } catch {
    // console.log()
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

  <link rel="stylesheet" href="/kokomoBay/docs/ReportClient.css" />
  <script type="module" src="/kokomoBay/docs/ReportClient.js"></script>

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
        buildDir: process.cwd() + "/" + config.outdir,
      },
      null,
      2
    )
  );

  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/node`);
  } catch {
    // console.log()
  }

  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/web`);
  } catch {
    // console.log()
  }
  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/features`);
  } catch {
    // console.log()
  }
  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/ts`);
  } catch {
    // console.log()
  }
};
