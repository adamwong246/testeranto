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
      console.error(e);
    }
  });
  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/App.js`,
    `testeranto/App.js`
  );
  fs.copyFileSync(
    `node_modules/testeranto/dist/prebuild/App.css`,
    `testeranto/App.css`
  );
};

// src/init-docs.ts
console.log("Initializing a testeranto project");
Init_default();
console.log("testeranto project initialized");
