import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/Init.ts
import fs from "fs";
var Init_default = async () => {
  [
    `testeranto/`,
    `testeranto/bundles/`,
    `testeranto/bundles/node`,
    `testeranto/bundles/web`,
    `testeranto/bundles/pure`,
    `testeranto/reports`,
    `testeranto/reports/`,
    `testeranto/features/`,
    `testeranto/externalTests/`
  ].forEach((f) => {
    try {
      fs.mkdirSync(`${process.cwd()}/${f}`);
    } catch (e) {
    }
  });
  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/Project.js`,
    `testeranto/Project.js`
  );
  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/Project.css`,
    `testeranto/Project.css`
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

// src/init-docs.ts
console.log("Initializing a testeranto project");
Init_default();
console.log("testeranto project initialized");
