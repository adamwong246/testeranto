/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";

export default async () => {
  [
    `testeranto/`,
    `testeranto/bundles/`,
    `testeranto/bundles/node`,
    `testeranto/bundles/web`,
    `testeranto/bundles/pure`,
    `testeranto/reports`,
    `testeranto/reports/`,
    `testeranto/features/`,
    `testeranto/externalTests/`,
  ].forEach((f) => {
    try {
      fs.mkdirSync(`${process.cwd()}/${f}`);
    } catch (e) {
      // console.error(e);
    }
  });

  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/Project.js`,
    `testeranto/Project.js`
  );

  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/ReportClient.js`,
    `testeranto/ReportClient.js`
  );

  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/Project.css`,
    `testeranto/Project.css`
  );

  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/ReportClient.css`,
    `testeranto/ReportClient.css`
  );

  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/TestReport.js`,
    `testeranto/TestReport.js`
  );

  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/TestReport.css`,
    `testeranto/TestReport.css`
  );
};
