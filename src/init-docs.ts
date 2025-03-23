import fs from "fs";
import Init from "../dist/module/src/Init";
console.log("Initializing a testeranto project");

if (!process.argv[2]) {
  console.log("You didn't pass a config file, so I will create one for you.");

  fs.writeFileSync(
    "testeranto.mts",
    fs.readFileSync("node_modules/testeranto/src/defaultConfig.ts")
  );
  import(process.cwd() + "/" + "testeranto.mts").then((module) => {
    Init(module.default);
  });
} else {
  import(process.cwd() + "/" + process.argv[2]).then((module) => {
    Init(module.default);
  });
}
