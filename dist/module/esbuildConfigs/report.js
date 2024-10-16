"use strict";
// import { jsonc } from "jsonc";
// import { IBaseConfig, IJsonConfig } from "../Types";
// import baseEsBuildConfig from "./index.js";
// import fs from "fs"
// import { BuildOptions } from "esbuild";
// // import { CssModulesPlugin } from 'esbuild-css-modules-plugin';
// const jsonConfig = jsonc.parse((await fs.readFileSync("./testeranto.json")).toString()) as IJsonConfig;
// export default (config: IBaseConfig): BuildOptions => {
//   return {
//     bundle: true,
//     entryPoints: ["./node_modules/testeranto/dist/module/report.js"],
//     minify: config.minify === true,
//     outbase: config.outbase,
//     write: true,
//     outfile: `${jsonConfig.outdir}/report.js`,
//     external: [
//       "tests.json",
//       "features.test.js"
//     ],
//     // plugins: [
//     //   CssModulesPlugin({
//     //     // @see https://github.com/indooorsman/esbuild-css-modules-plugin/blob/main/index.d.ts for more details
//     //     force: true,
//     //     emitDeclarationFile: true,
//     //     localsConvention: 'camelCaseOnly',
//     //     namedExports: true,
//     //     inject: false
//     //   })
//     // ]
//   }
//   // return {
//   //   bundle: true,
//   //   entryPoints: [
//   //     "./node_modules/testeranto/dist/module/Report.js",
//   //     jsonConfig.features
//   //   ],
//   //   minify: config.minify === true,
//   //   outbase: ".",
//   //   outdir: 'docs',
//   //   write: true,
//   //   // outfile: `${jsonConfig.outdir}/Report.js`,
//   //   external: [
//   //     "features.test.js",
//   //     "testeranto.json"
//   //   ]
//   // }
// }
