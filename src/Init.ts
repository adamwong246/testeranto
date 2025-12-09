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
    `testeranto/metafiles/`,
    `testeranto/metafiles/node`,
    `testeranto/metafiles/web`,
    `testeranto/metafiles/pure`,
    `testeranto/metafiles/golang`,
    `testeranto/metafiles/python`,
  ].forEach((f) => {
    try {
      fs.mkdirSync(`${process.cwd()}/${f}`);
    } catch (e) {
      console.error(e);
    }
  });

  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/Report.js`,
    `testeranto/Report.js`
  );

  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/Report.css`,
    `testeranto/Report.css`
  );

  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/ProcessManager.js`,
    `testeranto/ProcessManager.js`
  );

  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/ProcessManager.css`,
    `testeranto/ProcessManager.css`
  );
};
