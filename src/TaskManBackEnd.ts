import express from "express";
import path from "path";
import fs from "fs";

import { IBaseConfig } from "./lib/types";
import GitFsDb from "./GitFsDb.js";

// console.log("hello TaskMan Backend", process.env);
// const mongoConnect =
//   process.env.MONGO_CONNECTION || "mongodb://127.0.0.1:27017";
// function findTextFiles(dir: string, fileList: string[] = []) {
//   const files = fs.readdirSync(dir);

//   for (const file of files) {
//     const filePath = path.join(dir, file);
//     const fileStat = fs.statSync(filePath);

//     if (fileStat.isDirectory() && file !== "node_modules") {
//       findTextFiles(filePath, fileList); // Recursive call for subdirectories
//     } else if (path.extname(file) === ".txt") {
//       fileList.push(filePath);
//     } else if (path.extname(file) === ".md") {
//       fileList.push(filePath);
//     }
//   }
//   return fileList;
// }
// function listToTree(fileList) {
//   const root: { name: string; children: any[] } = {
//     name: "root",
//     children: [],
//   };
//   for (const path of fileList) {
//     const parts = path.split("/");
//     let current = root;
//     for (let i = 0; i < parts.length; i++) {
//       const part = parts[i];
//       if (!part) continue; // Skip empty parts (e.g., from leading '/')
//       let child = current.children.find((c) => c.name === part);
//       if (!child) {
//         child = { name: part, children: [] };
//         current.children.push(child);
//       }
//       current = child;
//     }
//   }
//   return root.children;
// }

const port = process.env.PORT || "8080";

export default (partialConfig: IBaseConfig) => {
  const config = {
    ...partialConfig,
    buildDir: process.cwd() + "/" + partialConfig.outdir,
  };

  fs.writeFileSync(
    `${config.outdir}/testeranto.json`,
    JSON.stringify(config, null, 2)
  );

  const app = express();

  app.get("/TaskManFrontend.js", (req, res) => {
    res.sendFile(`${process.cwd()}/dist/prebuild/TaskManFrontEnd.js`);
  });

  app.get("/TaskManFrontEnd.css", (req, res) => {
    res.sendFile(`${process.cwd()}/dist/prebuild/TaskManFrontEnd.css`);
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

  app.use("/", express.static(path.join(process.cwd())));

  // app.get("/docGal/fs.json", (req, res) => {
  //   const directoryPath = "./"; // Replace with the desired directory path
  //   // const textFiles = findTextFiles(directoryPath);
  //   res.json(listToTree(findTextFiles(directoryPath)));
  //   //     res.send(`<!DOCTYPE html>
  //   // <html lang="en">

  //   // <head>
  //   //   <meta name="description" content="Webpage description goes here" />
  //   //   <meta charset="utf-8" />
  //   //   <meta name="viewport" content="width=device-width, initial-scale=1" />
  //   //   <meta name="author" content="" />

  //   //   <title>TaskMan</title>

  //   //   <link rel="stylesheet" href="/TaskManFrontEnd.css" />
  //   //   <script type="module" src="/TaskManFrontEnd.js"></script>
  //   // </head>

  //   // <body><div id="root">react is loading</div></body>

  //   // </html>`);
  // });

  GitFsDb("docs", app);
};
