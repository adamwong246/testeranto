// src/TaskMan.ts
import express from "express";
import path from "path";

// src/GitFsDb.ts
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
async function getfile(f) {
  return new Promise((res, rej) => {
    fs.open(f, "r", (err, fd) => {
      if (err) {
        console.error("Error opening file:", err);
        return;
      }
      fs.fstat(fd, (err2, stats) => {
        if (err2) {
          console.error("Error getting file stats:", err2);
          return;
        }
        fs.close(fd, (err3) => {
          if (err3) {
            console.error("Error closing file:", err3);
            return;
          }
          const jsonBody = fs.readFileSync(f).toString();
          res({
            ...JSON.parse(jsonBody),
            lastUpdated: stats.mtime
          });
        });
      });
    });
  });
}
var Model = class {
  constructor(name, app2) {
    // return an item by id
    this.find = async (_id) => {
      const f = `./${this.name}/${_id}.json`;
      return { status: true, item: await getfile(f) };
    };
    // return all ids
    this.list = async () => {
      return {
        status: true,
        ids: fs.readdirSync(`./${this.name}`).map((filepath) => filepath.split(".json")[0])
      };
    };
    // gather by ids
    this.gather = async (ids) => {
      return new Promise(async (res, rej) => {
        res({
          status: true,
          items: await Promise.all(
            ids.map(async (_id) => {
              const gotFile = await getfile(`./${this.name}/${_id}.json`);
              return {
                _id,
                ...gotFile
              };
            })
          )
        });
      });
    };
    this.name = name;
    if (!fs.existsSync(`./${this.name}`)) {
      fs.mkdirSync(`./${this.name}`, {});
    }
    app2.get(`/${this.name}.json`, async (req, res) => {
      res.json(await this.list());
    });
    app2.get(`/${this.name}/:id.json`, async (req, res) => {
      res.json(await this.find(req.params["_id"]));
    });
    app2.post(`/${this.name}/:id.json`, async (req, res) => {
      res.json(await this.update(req.params));
    });
    app2.post(`/${this.name}.json`, async (req, res) => {
      res.json(await this.create(req.params));
    });
  }
  // create an item
  create(item) {
    return new Promise(async (res, rej) => {
      const _id = uuidv4();
      await fs.writeFileSync(`./${this.name}/${_id}`, item.toString());
      res({ status: true, _id });
    });
  }
  // update an item
  async update(item) {
    const record = JSON.parse(item.toString());
    record.delete["_id"];
    await fs.writeFileSync(`./${this.name}/${item._id}`, record.toString());
    return { status: true, _id: item._id };
  }
  // all = async(): Promise<Record<string,
};
var KanbanModel = class extends Model {
};
var UserModel = class extends Model {
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
  async message(rawMessage) {
    const m = this.messageModel.create(rawMessage);
  }
};
var ProjectModel = class extends MessagableModel {
  // only allow changes to the body
  async update({
    name,
    owner,
    _id
  }) {
    await super.update({
      _id,
      name
    });
    return {
      status: true,
      _id
    };
  }
};
var TaskModel = class extends MessagableModel {
  // only allow changes to the body
  async update({
    _id,
    end,
    name,
    owner,
    start,
    state
  }) {
    await super.update({
      _id,
      end,
      name,
      owner,
      start,
      state
    });
    return {
      status: true,
      _id
    };
  }
};
var MilestoneModel = class extends MessagableModel {
  // only allow changes to the body
  async update({
    _id,
    date,
    name,
    owner
  }) {
    await super.update({
      _id,
      date,
      name,
      owner
    });
    return {
      status: true,
      _id
    };
  }
};
var SprintModel = class extends Model {
};
var GitFsDb_default = async (filepath, app2) => {
  const mm = new MessageModel("Message", app2);
  return {
    users: new UserModel("User", app2),
    kanbans: new KanbanModel("Kanban", app2),
    sprints: new SprintModel("Sprint", app2),
    milestones: new MilestoneModel("Milestone", app2, mm),
    tasks: new TaskModel("Task", app2, mm),
    projects: new ProjectModel("Project", app2, mm)
  };
};

// src/TaskMan.ts
var port = process.env.PORT || "8080";
var app = express();
app.use("/", express.static(path.join(process.cwd())));
app.get("/", function(req, res) {
  res.sendFile(
    `${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskMan.html`
  );
});
app.get("/TaskManFrontend.js", (req, res) => {
  res.sendFile(
    `${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskManFrontEnd.js`
  );
});
app.get("/TaskManFrontEnd.css", (req, res) => {
  res.sendFile(
    `${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskManFrontEnd.css`
  );
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
var { tasks, projects, milestones } = await GitFsDb_default("./", app);
app.get("/features.json", async (req, res) => {
  const allTasks = (await tasks.gather((await tasks.list()).ids)).items.map(
    (t) => {
      return {
        ...t,
        filename: `Task/${t._id}.json`
      };
    }
  );
  const allProjects = (await projects.gather((await projects.list()).ids)).items.map((t) => {
    return {
      ...t,
      filename: `Project/${t._id}.json`
    };
  });
  const allMilestones = (await milestones.gather((await milestones.list()).ids)).items.map((t) => {
    return {
      ...t,
      filename: `Milestone/${t._id}.json`
    };
  });
  res.json(
    [...allTasks, ...allMilestones, ...allProjects].sort(
      (a, b) => a.lastUpdated - b.lastUpdated
    )
  );
});
[
  "/tests/**",
  "/features/**",
  "/kanban/**",
  "/gantt/**",
  "/org/**",
  "/owners/**",
  "/sprint/**",
  "/git/**"
].forEach((r) => {
  app.get(r, (req, res) => {
    res.sendFile(
      `${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskMan.html`
    );
  });
});
