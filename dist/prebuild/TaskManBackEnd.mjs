// src/TaskManBackEnd.ts
import express from "express";
import { MongoClient } from "mongodb";
import mongoose2 from "mongoose";
import path from "path";
import fs from "fs";

// src/mongooseSchemas.ts
import mongoose from "mongoose";
var userSchema = new mongoose.Schema({
  email: String,
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
  dmgroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dmgroup" }]
});
userSchema.virtual("features", {
  ref: "Feature",
  localField: "_id",
  foreignField: "owner"
});
var kanbanSchema = new mongoose.Schema({
  title: String
});
var ganttSchema = new mongoose.Schema({
  name: String,
  type: String,
  start: Date,
  end: Date
});
var featuresSchema = new mongoose.Schema({
  title: String,
  state: String
});
var channelsFeature = new mongoose.Schema({});
var chatCatMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatCatRoom",
    required: true,
    maxlength: 100
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
  text: {
    type: String,
    maxlength: 1e3
  }
});
var HuddleSchema = new mongoose.Schema({});
var RoomSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

// src/TaskManBackEnd.ts
console.log("hello TaskMan Backend", process.env);
var port = process.env.PORT || "8080";
function findTextFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);
    if (fileStat.isDirectory() && file !== "node_modules") {
      findTextFiles(filePath, fileList);
    } else if (path.extname(file) === ".txt") {
      fileList.push(filePath);
    } else if (path.extname(file) === ".md") {
      fileList.push(filePath);
    }
  }
  return fileList;
}
function listToTree(fileList) {
  const root = {
    name: "root",
    children: []
  };
  for (const path2 of fileList) {
    const parts = path2.split("/");
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part)
        continue;
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
var TaskManBackEnd_default = (partialConfig) => {
  const config = {
    ...partialConfig,
    buildDir: process.cwd() + "/" + partialConfig.outdir
  };
  fs.writeFileSync(
    `${config.outdir}/testeranto.json`,
    JSON.stringify(config, null, 2)
  );
  const app = express();
  new MongoClient(`mongodb://${process.env.MONGO_HOST || "127.0.0.1"}:27017`).connect().then(async (conn) => {
    const db = conn.db("taskman");
    await mongoose2.connect(
      `mongodb://${process.env.MONGO_HOST || "127.0.0.1"}:27017/taskman`
    );
    const usersModel = mongoose2.model("User", userSchema);
    const kanbanModel = mongoose2.model("Kanban", kanbanSchema);
    const ganttModel = mongoose2.model("Gantt", ganttSchema);
    const featuresModel = mongoose2.model("Features", featuresSchema);
    const MessagesModel = mongoose2.model(
      "Messages",
      chatCatMessageSchema
    );
    const ChatChannel = mongoose2.model("ChatChannel", channelsFeature);
    const huddleModdle = ChatChannel.discriminator("Huddle", HuddleSchema);
    const roomsModel = ChatChannel.discriminator("Room", RoomSchema);
    app.get("/TaskManFrontend.js", (req, res) => {
      res.sendFile(`${process.cwd()}/docs/TaskManFrontEnd.js`);
    });
    app.get("/TaskManFrontEnd.css", (req, res) => {
      res.sendFile(`${process.cwd()}/docs/TaskManFrontEnd.css`);
    });
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
    const keyedModels = {
      users: usersModel,
      kanbans: kanbanModel,
      features: featuresModel,
      gantts: ganttModel,
      rooms: roomsModel,
      huddles: huddleModdle,
      messages: MessagesModel
    };
    Object.keys(keyedModels).forEach((key) => {
      app.get(`/${key}.json`, async (req, res) => {
        console.log("GET", key, keyedModels[key]);
        res.json(await keyedModels[key].find({}));
      });
      app.get(`/${key}/:id.json`, async (req, res) => {
        res.json(
          await keyedModels[key].find({ id: { $eq: req.params["id"] } }).toArray()
        );
      });
      app.post(`/${key}/:id.json`, async (req, res) => {
        res.json(
          await keyedModels[key].find({ id: { $eq: req.params["id"] } }).toArray()
        );
      });
      app.post(`/${key}.json`, async (req, res) => {
        res.json(
          await keyedModels[key].find({ id: { $eq: req.params["id"] } }).toArray()
        );
      });
    });
    app.use("/", express.static(path.join(process.cwd())));
    app.get("/docGal/fs.json", (req, res) => {
      const directoryPath = "./";
      res.json(listToTree(findTextFiles(directoryPath)));
    });
  });
};
export {
  TaskManBackEnd_default as default
};
