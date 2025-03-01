// src/TaskManBackEnd.ts
import express from "express";
import path from "path";
import fs2 from "fs";

// src/GitFsDb.ts
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
var Model = class {
  constructor(name, app) {
    // return an item by id
    this.find = async (id) => {
      return {
        status: true,
        item: JSON.parse(
          fs.readFileSync(`./docs/${this.name}/${id}.json`).toString()
        )
      };
    };
    // return all ids
    this.list = async () => {
      return {
        status: true,
        ids: fs.readdirSync(`./docs/${this.name}`).map((filepath) => filepath.split(".json")[0])
      };
    };
    // gather by ids
    this.gather = async (ids) => {
      return {
        status: true,
        items: ids.map((_id) => {
          return {
            _id,
            ...JSON.parse(
              fs.readFileSync(`./docs/${this.name}/${_id}`).toString()
            )
          };
        })
      };
    };
    this.name = name;
    if (!fs.existsSync(`./docs/${this.name}`)) {
      fs.mkdirSync(`./docs/${this.name}`, {});
    }
    app.get(`/docs/${this.name}.json`, async (req, res) => {
      res.json(await this.list());
    });
    app.get(`/docs/${this.name}/:id.json`, async (req, res) => {
      res.json(await this.find(req.params["_id"]));
    });
    app.post(`/docs/${this.name}/:id.json`, async (req, res) => {
      res.json(await this.update(req.params));
    });
    app.post(`/docs/${this.name}.json`, async (req, res) => {
      res.json(await this.create(req.params));
    });
  }
  // create an item
  create(item) {
    return new Promise(async (res, rej) => {
      const _id = uuidv4();
      await fs.writeFileSync(`./docs/${this.name}/${_id}`, item.toString());
      res({ status: true, _id });
    });
  }
  // update an item
  async update(item) {
    const record = JSON.parse(item.toString());
    record.delete["_id"];
    await fs.writeFileSync(
      `./docs/${this.name}/${item._id}`,
      record.toString()
    );
    return { status: true, _id: item._id };
  }
};
var KanbanModel = class extends Model {
};
var MessageModel = class extends Model {
  constructor(modelName, expressApp) {
    super(modelName, expressApp);
    this.namesIndex = {};
    this.list().then(({ status, ids }) => {
      ids.forEach((_id) => {
        this.find(_id).then(({ status: status2, item }) => {
          this.index(item, _id);
        });
      });
    });
    expressApp.get(`/${this.name}/owner.json`, async (req, res) => {
      res.json(await this.byOwner(req.params.owner));
    });
  }
  index(item, _id) {
    if (!this.namesIndex[item.owner]) {
      this.namesIndex[item.owner] = /* @__PURE__ */ new Set([_id]);
    } else {
      this.namesIndex[item.owner].add(_id);
    }
  }
  async create(rawMessage) {
    const { _id } = await super.create(rawMessage);
    this.index(rawMessage, _id);
    return {
      status: true,
      _id
    };
  }
  // only allow changes to the body
  async update({ body, _id }) {
    await super.update({
      _id,
      body
    });
    return {
      status: true,
      _id
    };
  }
  byOwner(owner) {
    return this.namesIndex[owner];
  }
};
var MessagableModel = class extends Model {
  constructor(modelName, expressApp, messageModel) {
    super(modelName, expressApp);
    this.messageModel = messageModel;
  }
  // async messages(_id: string) {
  //   const { item } = await this.find(_id);
  //   return await this.messageModel.gather(item.messages);
  // }
  async message(subjectId, rawMessage) {
    const m = this.messageModel.create(rawMessage);
    const { item } = await this.find(subjectId);
    item.messages.push((await m)._id);
    await this.update(item);
  }
};
var FeatureModel = class extends MessagableModel {
  // only allow changes to the body
  async update({ body, _id }) {
    await super.update({
      _id,
      body
    });
    return {
      status: true,
      _id
    };
  }
};
var GanttModel = class extends MessagableModel {
  // only allow changes to the body
  async update({ body, _id }) {
    await super.update({
      _id,
      body
    });
    return {
      status: true,
      _id
    };
  }
};
var GitFsDb_default = async (filepath, app) => {
  new KanbanModel("Kanban", app);
  const mm = new MessageModel("Message", app);
  new FeatureModel("Feature", app, mm);
  new GanttModel("Gantt", app, mm);
};

// src/TaskManBackEnd.ts
console.log("hello TaskMan Backend", process.env);
var port = process.env.PORT || "8080";
function findTextFiles(dir, fileList = []) {
  const files = fs2.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = fs2.statSync(filePath);
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
  fs2.writeFileSync(
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
  app.get("/docGal/fs.json", (req, res) => {
    const directoryPath = "./";
    res.json(listToTree(findTextFiles(directoryPath)));
  });
  GitFsDb_default("docs", app);
};
export {
  TaskManBackEnd_default as default
};
