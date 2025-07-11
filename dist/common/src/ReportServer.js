"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_static_1 = __importDefault(require("node-static"));
const http_1 = __importDefault(require("http"));
// import esbuild from "esbuild";
const main = async () => {
    // esbuild
    //         .context(configer(config, Object.keys(entryPoints), testName))
    //         .then(async (ctx) => {
    //           if (mode === "dev") {
    //             await ctx.watch().then((v) => {
    //               done();
    //             });
    //           } else {
    //             ctx.rebuild().then((v) => {
    //               done();
    //             });
    //           }
    //           return ctx;
    //         });
    //     }),
    // await esbuild
    //   .context({
    //     entryPoints: [
    //       "node_modules/testeranto/src/ReportClient.tsx",
    //       "node_modules/testeranto/src/TestReport.tsx",
    //       "node_modules/testeranto/src/Project.tsx",
    //     ],
    //     bundle: true,
    //     format: "iife",
    //     platform: "browser",
    //     outdir: "./testeranto",
    //     define: {
    //       REPORT_ROOT: "localhost:8765",
    //     },
    //   })
    //   .then(async (ctx) => {
    //     await ctx.watch();
    //     let { host, port } = await ctx.serve({
    //       servedir: ".",
    //     });
    //   });
    // process.chdir("../"); // Navigate one level up
    const fileServer = new node_static_1.default.Server("./testeranto", {});
    http_1.default
        .createServer(function (request, response) {
        request
            .addListener("end", function () {
            fileServer.serve(request, response);
        })
            .resume();
    })
        .listen(8080);
    console.log("Server running on port 8080");
};
main();
