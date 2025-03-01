"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const GitFsDb_js_1 = __importDefault(require("./GitFsDb.js"));
// console.log("hello TaskMan Backend", process.env);
const port = process.env.PORT || "8080";
// const mongoConnect =
//   process.env.MONGO_CONNECTION || "mongodb://127.0.0.1:27017";
function findTextFiles(dir, fileList = []) {
    const files = fs_1.default.readdirSync(dir);
    for (const file of files) {
        const filePath = path_1.default.join(dir, file);
        const fileStat = fs_1.default.statSync(filePath);
        if (fileStat.isDirectory() && file !== "node_modules") {
            findTextFiles(filePath, fileList); // Recursive call for subdirectories
        }
        else if (path_1.default.extname(file) === ".txt") {
            fileList.push(filePath);
        }
        else if (path_1.default.extname(file) === ".md") {
            fileList.push(filePath);
        }
    }
    return fileList;
}
function listToTree(fileList) {
    const root = {
        name: "root",
        children: [],
    };
    for (const path of fileList) {
        const parts = path.split("/");
        let current = root;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (!part)
                continue; // Skip empty parts (e.g., from leading '/')
            let child = current.children.find((c) => c.name === part);
            if (!child) {
                child = { name: part, children: [] };
                current.children.push(child);
            }
            current = child;
        }
    }
    return root.children;
}
exports.default = (partialConfig) => {
    const config = Object.assign(Object.assign({}, partialConfig), { buildDir: process.cwd() + "/" + partialConfig.outdir });
    fs_1.default.writeFileSync(`${config.outdir}/testeranto.json`, JSON.stringify(config, null, 2));
    const app = (0, express_1.default)();
    app.get("/TaskManFrontend.js", (req, res) => {
        res.sendFile(`${process.cwd()}/dist/prebuild/TaskManFrontEnd.js`);
    });
    app.get("/TaskManFrontEnd.css", (req, res) => {
        res.sendFile(`${process.cwd()}/dist/prebuild/TaskManFrontEnd.css`);
    });
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
    app.use("/", express_1.default.static(path_1.default.join(process.cwd())));
    app.get("/docGal/fs.json", (req, res) => {
        const directoryPath = "./"; // Replace with the desired directory path
        // const textFiles = findTextFiles(directoryPath);
        res.json(listToTree(findTextFiles(directoryPath)));
        //     res.send(`<!DOCTYPE html>
        // <html lang="en">
        // <head>
        //   <meta name="description" content="Webpage description goes here" />
        //   <meta charset="utf-8" />
        //   <meta name="viewport" content="width=device-width, initial-scale=1" />
        //   <meta name="author" content="" />
        //   <title>TaskMan</title>
        //   <link rel="stylesheet" href="/TaskManFrontEnd.css" />
        //   <script type="module" src="/TaskManFrontEnd.js"></script>
        // </head>
        // <body><div id="root">react is loading</div></body>
        // </html>`);
    });
    (0, GitFsDb_js_1.default)("docs", app);
};
