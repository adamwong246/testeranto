"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
exports.default = async (partialConfig) => {
    const config = Object.assign(Object.assign({}, partialConfig), { buildDir: process.cwd() + "/" + partialConfig.outdir });
    try {
        fs_1.default.mkdirSync(`${process.cwd()}/${config.outdir}`);
    }
    catch (_a) {
        // console.log()
    }
    fs_1.default.writeFileSync(`${config.outdir}/index.html`, `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <title>kokomoBay - testeranto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />

  <link rel="stylesheet" href="/index.css" />
  <script type="module" src="/bigBoard.js"></script>

</head>

<body>
  <div id="root">
    react is loading
  </div>
</body>

</html>
    `);
    fs_1.default.copyFileSync(`node_modules/testeranto/dist/prebuild/ReportClient.js`, `${config.outdir}/bigBoard.js`);
    fs_1.default.copyFileSync(`node_modules/testeranto/dist/prebuild/littleBoard.js`, `${config.outdir}/littleBoard.js`);
    fs_1.default.writeFileSync(`${config.outdir}/testeranto.json`, JSON.stringify(Object.assign(Object.assign({}, config), { buildDir: process.cwd() + "/" + config.outdir }), null, 2));
    try {
        fs_1.default.mkdirSync(`${process.cwd()}/${config.outdir}/node`);
    }
    catch (_b) {
        // console.log()
    }
    try {
        fs_1.default.mkdirSync(`${process.cwd()}/${config.outdir}/web`);
    }
    catch (_c) {
        // console.log()
    }
    try {
        fs_1.default.mkdirSync(`${process.cwd()}/${config.outdir}/features`);
    }
    catch (_d) {
        // console.log()
    }
    try {
        fs_1.default.mkdirSync(`${process.cwd()}/${config.outdir}/ts`);
    }
    catch (_e) {
        // console.log()
    }
};
