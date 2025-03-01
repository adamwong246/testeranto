"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
exports.default = async (partialConfig) => {
    const config = Object.assign(Object.assign({}, partialConfig), { buildDir: process.cwd() + "/" + partialConfig.outdir });
    fs_1.default.writeFileSync(`${config.outdir}/testeranto.json`, JSON.stringify(Object.assign(Object.assign({}, config), { buildDir: process.cwd() + "/" + config.outdir }), null, 2));
    fs_1.default.copyFileSync("./node_modules/testeranto/dist/prebuild/TaskManFrontEnd.js", "./docs/TaskManFrontEnd.js");
    fs_1.default.copyFileSync("./node_modules/testeranto/dist/prebuild/TaskManFrontEnd.css", "./docs/TaskManFrontEnd.css");
    fs_1.default.writeFileSync(`${config.outdir}/index.html`, `<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />

  <title>TaskMan</title>

  <link rel="stylesheet" href="/docs/TaskManFrontEnd.css" />
  <script type="module" src="/docs/TaskManFrontEnd.js"></script>
</head>

<body><div id="root">react is loading</div></body>

</html>`);
};
