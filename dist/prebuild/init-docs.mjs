// src/Init.ts
import fs from "fs";
var Init_default = async () => {
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
    `testeranto/metafiles/python`
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
