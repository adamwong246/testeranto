// import * as esbuild from "esbuild";
// import { BuildOptions } from "esbuild";
// import { IBaseConfig, ITProject } from './Project.js';

// type IBazelConfig = { tests: Record<string, () => any> } & IBaseConfig;
// export class ITProjectBazel extends ITProject {
//   config: IBazelConfig;
//   constructor(config: IBazelConfig) {
//     super(config);
//     this.config = config;

//     const esBuildOptions: BuildOptions = {
//       allowOverwrite: true,
//       outbase: this.outbase,
//       outdir: this.outdir,
//       jsx: `transform`,
//       entryPoints: [
//         ...this.getEntryPoints().map((sourcefile) => {
//           return sourcefile;
//         })
//       ],
//       bundle: true,
//       minify: this.minify === true,
//       format: "esm",
//       write: true,
//       outExtension: { '.js': '.mjs' },
//       packages: 'external',
//       plugins: [
//         ...this.loaders || [],
//       ],
//       external: [
//       ],
//     };

//     if (this.watchMode) {
//       esbuild.context(esBuildOptions).then(async (ectx) => {
//         ectx.watch()
//       });
//     } else {
//       esbuild.build(esBuildOptions).then(async (eBuildResult) => {
//         console.log("ebuildResult", eBuildResult);
//         process.exit(eBuildResult.errors.length)
//       });
//     }


//   }
//   getEntryPoints(): string[] {
//     return Object.keys(this.config.tests);
//   }

// };