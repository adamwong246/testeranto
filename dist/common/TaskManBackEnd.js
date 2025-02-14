"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatChannel = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mongooseSchemas_1 = require("./mongooseSchemas");
exports.chatChannel = new mongoose_1.default.Schema({
    // name: { type: String, required: true },
    users: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
});
const app = (0, express_1.default)();
const port = 3000;
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
new mongodb_1.MongoClient(`mongodb://localhost:27017`).connect().then(async (conn) => {
    const db = conn.db("taskman");
    await mongoose_1.default.connect("mongodb://127.0.0.1:27017/taskman");
    const usersModel = mongoose_1.default.model("User", mongooseSchemas_1.userSchema);
    const kanbanModel = mongoose_1.default.model("Kanban", mongooseSchemas_1.kanbanSchema);
    const ganttModel = mongoose_1.default.model("Gantt", mongooseSchemas_1.ganttSchema);
    const featuresModel = mongoose_1.default.model("Features", mongooseSchemas_1.featuresSchema);
    // const roomsModel = mongoose.model<any>("Rooms", RoomSchema);
    // const huddleModdle = mongoose.model<any>("Huddles", HuddleSchema);
    const ChatChannel = mongoose_1.default.model("ChatChannel", exports.chatChannel);
    const huddleModdle = ChatChannel.discriminator("Huddle", mongooseSchemas_1.HuddleSchema);
    const roomsModel = ChatChannel.discriminator("Room", mongooseSchemas_1.RoomSchema);
    app.get("/TaskManFrontend.js", (req, res) => {
        res.sendFile(`${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskManFrontEnd.js`);
    });
    app.get("/TaskManFrontEnd.css", (req, res) => {
        res.sendFile(`${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskManFrontEnd.css`);
    });
    app.get("/testeranto.json", (req, res) => {
        res.sendFile(`${process.cwd()}/docs/testeranto.json`);
    });
    app.get("/", (req, res) => {
        res.send(`<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />

  <title>TaskMan</title>

  <link rel="stylesheet" href="/TaskManFrontEnd.css" />
  <script type="module" src="/TaskManFrontEnd.js"></script>
</head>

<body><div id="root">react is loading</div></body>

</html>`);
    });
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
    ///////////////////////////////////////////////
    const keyedModels = {
        users: usersModel,
        kanbans: kanbanModel,
        features: featuresModel,
        gantts: ganttModel,
        rooms: roomsModel,
        huddles: huddleModdle,
    };
    Object.keys(keyedModels).forEach((key) => {
        app.get(`/${key}.json`, async (req, res) => {
            console.log("GET", key, keyedModels[key]);
            res.json(await keyedModels[key].find({}));
        });
        app.get(`/${key}/:id.json`, async (req, res) => {
            res.json(await keyedModels[key].find({ id: { $eq: req.params["id"] } }).toArray());
        });
        app.post(`/${key}/:id.json`, async (req, res) => {
            res.json(await keyedModels[key].find({ id: { $eq: req.params["id"] } }).toArray());
        });
        app.post(`/${key}.json`, async (req, res) => {
            res.json(await keyedModels[key].find({ id: { $eq: req.params["id"] } }).toArray());
        });
    });
    app.use("/docs", express_1.default.static(path_1.default.join(process.cwd(), "docs")));
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
});
