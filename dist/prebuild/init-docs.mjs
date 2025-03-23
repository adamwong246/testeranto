import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/init-docs.ts
import fs2 from "fs";

// dist/module/src/Init.js
import fs from "fs";
var Init_default = async (partialConfig) => {
  const config = Object.assign(Object.assign({}, partialConfig), { buildDir: process.cwd() + "/" + partialConfig.outdir });
  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}`);
  } catch (_a) {
  }
  fs.writeFileSync(`${config.outdir}/testeranto.json`, JSON.stringify(Object.assign(Object.assign({}, config), { buildDir: process.cwd() + "/" + config.outdir }), null, 2));
  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/node`);
  } catch (_b) {
  }
  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/web`);
  } catch (_c) {
  }
  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/features`);
  } catch (_d) {
  }
  try {
    fs.mkdirSync(`${process.cwd()}/${config.outdir}/ts`);
  } catch (_e) {
  }
};

// src/init-docs.ts
console.log("Initializing a testeranto project");
if (!process.argv[2]) {
  console.log("You didn't pass a config file, so I will create one for you.");
  fs2.writeFileSync(
    "testeranto.mts",
    fs2.readFileSync("node_modules/testeranto/src/defaultConfig.ts")
  );
  import(process.cwd() + "/testeranto.mts").then((module) => {
    Init_default(module.default);
  });
} else {
  import(process.cwd() + "/" + process.argv[2]).then((module) => {
    Init_default(module.default);
  });
}
