import staticServer from "node-static";
import http from "http";
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
    const fileServer = new staticServer.Server("./testeranto", {});
    http
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
