import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/Init.ts
import fs from "fs";
var Init_default = async () => {
  [
    `testeranto/`,
    `testeranto/bundles/`,
    `testeranto/bundles/node`,
    `testeranto/bundles/web`,
    `testeranto/reports`,
    `testeranto/reports/`,
    `testeranto/features/`
  ].forEach((f) => {
    try {
      fs.mkdirSync(`${process.cwd()}/${f}`);
    } catch (e) {
    }
  });
};

// src/init-docs.ts
console.log("Initializing a testeranto project");
Init_default();
console.log("goodbye");
