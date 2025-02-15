import express from "express";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { ganttSchema, kanbanSchema, userSchema, featuresSchema, RoomSchema, HuddleSchema, channelsFeature, chatCatMessageSchema, } from "./mongooseSchemas";
console.log("hello TaskMan Backend", process.env);
const port = process.env.HTTPS_PORT || "3000";
function findTextFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const fileStat = fs.statSync(filePath);
        if (fileStat.isDirectory() && file !== "node_modules") {
            findTextFiles(filePath, fileList); // Recursive call for subdirectories
        }
        else if (path.extname(file) === ".txt") {
            fileList.push(filePath);
        }
        else if (path.extname(file) === ".md") {
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
export default (partialConfig) => {
    const config = Object.assign(Object.assign({}, partialConfig), { buildDir: process.cwd() + "/" + partialConfig.outdir });
    fs.writeFileSync(`${config.outdir}/testeranto.json`, JSON.stringify(config, null, 2));
    const app = express();
    new MongoClient(`mongodb://${process.env.MONGO_HOST || "127.0.0.1"}:27017`)
        .connect()
        .then(async (conn) => {
        const db = conn.db("taskman");
        await mongoose.connect(`mongodb://${process.env.MONGO_HOST || "127.0.0.1"}:27017/taskman`);
        const usersModel = mongoose.model("User", userSchema);
        const kanbanModel = mongoose.model("Kanban", kanbanSchema);
        const ganttModel = mongoose.model("Gantt", ganttSchema);
        const featuresModel = mongoose.model("Features", featuresSchema);
        // const roomsModel = mongoose.model<any>("Rooms", RoomSchema);
        // const huddleModdle = mongoose.model<any>("Huddles", HuddleSchema);
        const MessagesModel = mongoose.model("Messages", chatCatMessageSchema);
        const ChatChannel = mongoose.model("ChatChannel", channelsFeature);
        const huddleModdle = ChatChannel.discriminator("Huddle", HuddleSchema);
        const roomsModel = ChatChannel.discriminator("Room", RoomSchema);
        app.get("/TaskManFrontend.js", (req, res) => {
            res.sendFile(`${process.cwd()}/docs/TaskManFrontEnd.js`);
        });
        app.get("/TaskManFrontEnd.css", (req, res) => {
            res.sendFile(`${process.cwd()}/docs/TaskManFrontEnd.css`);
        });
        // app.get(`/preMergeCheck`, async (req, res) => {
        //   const commit = req.params["commit"];
        //   // res.json(await keyedModels[key].find({}));
        // });
        // app.get("/TaskManFrontend.js", (req, res) => {
        //   res.sendFile(
        //     `${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskManFrontEnd.js`
        //   );
        // });
        // app.get("/TaskManFrontEnd.css", (req, res) => {
        //   res.sendFile(
        //     `${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskManFrontEnd.css`
        //   );
        // });
        // app.get("/testeranto.json", (req, res) => {
        //   // res.sendFile(`${process.cwd()}/docs/testeranto.json`);
        //   res.json(config);
        // });
        //       app.get("/", (req, res) => {
        //         res.send(`<!DOCTYPE html>
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
        //       });
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
            messages: MessagesModel,
        };
        Object.keys(keyedModels).forEach((key) => {
            app.get(`/${key}.json`, async (req, res) => {
                console.log("GET", key, keyedModels[key]);
                res.json(await keyedModels[key].find({}));
            });
            app.get(`/${key}/:id.json`, async (req, res) => {
                res.json(await keyedModels[key]
                    .find({ id: { $eq: req.params["id"] } })
                    .toArray());
            });
            app.post(`/${key}/:id.json`, async (req, res) => {
                res.json(await keyedModels[key]
                    .find({ id: { $eq: req.params["id"] } })
                    .toArray());
            });
            app.post(`/${key}.json`, async (req, res) => {
                res.json(await keyedModels[key]
                    .find({ id: { $eq: req.params["id"] } })
                    .toArray());
            });
        });
        app.use("/", express.static(path.join(process.cwd())));
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
};
