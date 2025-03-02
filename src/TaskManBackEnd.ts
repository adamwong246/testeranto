// import express from "express";
// import path from "path";
// import fs from "fs";

// import { IBaseConfig } from "./lib/types";
// import GitFsDb from "./GitFsDb.js";

// const port = process.env.PORT || "8080";

// export default (partialConfig: IBaseConfig) => {
//   const config = {
//     ...partialConfig,
//     buildDir: process.cwd() + "/" + partialConfig.outdir,
//   };

//   fs.writeFileSync(
//     `${config.outdir}/testeranto.json`,
//     JSON.stringify(config, null, 2)
//   );

//   const app = express();

//   app.get("/commits/:owner/:repo.json", (req, res) => {
//     res.sendFile(`${process.cwd()}/dist/prebuild/TaskManFrontEnd.js`);
//   });

//   app.get("/TaskManFrontend.js", (req, res) => {
//     res.sendFile(`${process.cwd()}/dist/prebuild/TaskManFrontEnd.js`);
//   });

//   app.get("/TaskManFrontEnd.css", (req, res) => {
//     res.sendFile(`${process.cwd()}/dist/prebuild/TaskManFrontEnd.css`);
//   });

//   app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`);
//   });

//   app.use("/", express.static(path.join(process.cwd())));
//   GitFsDb("docs", app);
//   // app.get("/docGal/fs.json", (req, res) => {
//   //   const directoryPath = "./"; // Replace with the desired directory path
//   //   // const textFiles = findTextFiles(directoryPath);
//   //   res.json(listToTree(findTextFiles(directoryPath)));
//   //   //     res.send(`<!DOCTYPE html>
//   //   // <html lang="en">

//   //   // <head>
//   //   //   <meta name="description" content="Webpage description goes here" />
//   //   //   <meta charset="utf-8" />
//   //   //   <meta name="viewport" content="width=device-width, initial-scale=1" />
//   //   //   <meta name="author" content="" />

//   //   //   <title>TaskMan</title>

//   //   //   <link rel="stylesheet" href="/TaskManFrontEnd.css" />
//   //   //   <script type="module" src="/TaskManFrontEnd.js"></script>
//   //   // </head>

//   //   // <body><div id="root">react is loading</div></body>

//   //   // </html>`);
//   // });
// };
