/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
export default async () => {
    [
        `testeranto/`,
        `testeranto/bundles/`,
        `testeranto/bundles/node`,
        `testeranto/bundles/web`,
        `testeranto/bundles/pure`,
        `testeranto/bundles/golang`,
        `testeranto/bundles/python`,
        `testeranto/reports/`,
        `testeranto/features/`,
        // `testeranto/externalTests/`,
        `testeranto/metafiles/`,
        `testeranto/metafiles/node`,
        `testeranto/metafiles/web`,
        `testeranto/metafiles/pure`,
        `testeranto/metafiles/golang`,
        `testeranto/metafiles/python`,
    ].forEach((f) => {
        try {
            fs.mkdirSync(`${process.cwd()}/${f}`);
        }
        catch (e) {
            console.error(e);
        }
    });
    fs.copyFileSync(`node_modules/testeranto/dist/prebuild/App.js`, `testeranto/App.js`);
    fs.copyFileSync(`node_modules/testeranto/dist/prebuild/App.css`, `testeranto/App.css`);
    // fs.copyFileSync(
    //   `node_modules/testeranto/dist/prebuild/ReportClient.js`,
    //   `testeranto/ReportClient.js`
    // );
    // fs.copyFileSync(
    //   `node_modules/testeranto/dist/prebuild/Project.css`,
    //   `testeranto/Project.css`
    // );
    // fs.copyFileSync(
    //   `node_modules/testeranto/dist/prebuild/ReportClient.css`,
    //   `testeranto/ReportClient.css`
    // );
    // fs.copyFileSync(
    //   `node_modules/testeranto/dist/prebuild/TestReport.js`,
    //   `testeranto/TestReport.js`
    // );
    // fs.copyFileSync(
    //   `node_modules/testeranto/dist/prebuild/TestReport.css`,
    //   `testeranto/TestReport.css`
    // );
};
