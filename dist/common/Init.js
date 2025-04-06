"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
exports.default = async () => {
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
            fs_1.default.mkdirSync(`${process.cwd()}/${f}`);
        }
        catch (e) {
            // console.error(e);
        }
    });
    //   fs.writeFileSync(
    //     `${process.cwd()}/testeranto/reports/index.html`,
    //     `
    // <!DOCTYPE html>
    // <html lang="en">
    // <head>
    //   <meta name="description" content="Webpage description goes here" />
    //   <meta charset="utf-8" />
    //   <title>kokomoBay - testeranto</title>
    //   <meta name="viewport" content="width=device-width, initial-scale=1" />
    //   <meta name="author" content="" />
    //   <link rel="stylesheet" href="/kokomoBay/docs/ReportClient.css" />
    //   <script type="module" src="/kokomoBay/docs/ReportClient.js"></script>
    // </head>
    // <body>
    //   <div id="root">
    //     react is loading
    //   </div>
    // </body>
    // </html>
    //     `
    //   );
    //   fs.copyFileSync(
    //     `node_modules/testeranto/dist/prebuild/ReportClient.js`,
    //     `testeranto/reports/ReportClient.js`
    //   );
    //   fs.copyFileSync(
    //     `node_modules/testeranto/dist/prebuild/ReportClient.css`,
    //     `testeranto/reports/ReportClient.css`
    //   );
    //   fs.copyFileSync(
    //     `node_modules/testeranto/dist/prebuild/TestReport.js`,
    //     `testeranto/reports/TestReport.js`
    //   );
    //   fs.copyFileSync(
    //     `node_modules/testeranto/dist/prebuild/TestReport.css`,
    //     `testeranto/reports/TestReport.css`
    //   );
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
