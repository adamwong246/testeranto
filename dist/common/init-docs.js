"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Init_1 = __importDefault(require("./Init"));
console.log("Initializing a testeranto project");
(0, Init_1.default)();
console.log("goodbye");
// if (!process.argv[2]) {
//   console.log("You didn't pass a config file, so I will create one for you.");
//   fs.writeFileSync(
//     "testeranto.mts",
//     fs.readFileSync("node_modules/testeranto/src/defaultConfig.ts")
//   );
//   import(process.cwd() + "/" + "testeranto.mts").then((module) => {
//     Init(module.default);
//   });
// } else {
//   import(process.cwd() + "/" + process.argv[2]).then((module) => {
//     Init(module.default);
//   });
// }
