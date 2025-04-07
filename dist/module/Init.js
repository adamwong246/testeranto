import fs from "fs";
export default async () => {
    [
        `testeranto/`,
        `testeranto/bundles/`,
        `testeranto/bundles/node`,
        `testeranto/bundles/web`,
        `testeranto/reports`,
        `testeranto/reports/`,
        `testeranto/features/`,
    ].forEach((f) => {
        try {
            fs.mkdirSync(`${process.cwd()}/${f}`);
        }
        catch (e) {
            // console.error(e);
        }
    });
    fs.writeFileSync(`${process.cwd()}/testeranto/index.html`, `
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
      `);
    fs.copyFileSync(`node_modules/testeranto/dist/prebuild/ReportClient.js`, `testeranto/ReportClient.js`);
    fs.copyFileSync(`node_modules/testeranto/dist/prebuild/ReportClient.css`, `testeranto/ReportClient.css`);
    fs.copyFileSync(`node_modules/testeranto/dist/prebuild/TestReport.js`, `testeranto/TestReport.js`);
    fs.copyFileSync(`node_modules/testeranto/dist/prebuild/TestReport.css`, `testeranto/TestReport.css`);
    // fs.writeFileSync(
    //   `${config.outdir}/testeranto.json`,
    //   JSON.stringify(
    //     {
    //       ...config,
    //       buildDir: process.cwd() + "/" + config.outdir,
    //     },
    //     null,
    //     2
    //   )
    // );
};
