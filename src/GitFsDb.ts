import { Express } from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import {
  IKanban,
  IUser,
  // IFeature,
  IMessage,
  IMessageable,
  IProject,
  ITask,
  IMilestone,
  // IGantt,
} from "./TaskManTypes";
import { IGantt } from "../dist/types/src/mongooseSchemas";

async function getfile(f: string): Promise<{ T }> {
  return new Promise((res, rej) => {
    fs.open(f, "r", (err, fd) => {
      if (err) {
        console.error("Error opening file:", err);
        return;
      }

      fs.fstat(fd, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return;
        }

        // console.log("File size:", stats.size, "bytes");
        // console.log("Is file:", stats.isFile());
        // console.log("Is directory:", stats.isDirectory());

        fs.close(fd, (err) => {
          if (err) {
            console.error("Error closing file:", err);
            return;
          }
          const jsonBody = fs.readFileSync(f).toString();
          res({
            ...JSON.parse(jsonBody),
            lastUpdated: stats.mtime,
          });
        });
      });
    });
  });
}

abstract class Model<
  T extends {
    _id: string;
    toString: () => string;
  }
> {
  name: string;

  constructor(name: string, app: Express) {
    this.name = name;

    if (!fs.existsSync(`./${this.name}`)) {
      fs.mkdirSync(`./${this.name}`, {});
    }

    app.get(`/${this.name}.json`, async (req, res) => {
      res.json(await this.list());
    });

    app.get(`/${this.name}/:id.json`, async (req, res) => {
      res.json(await this.find(req.params["_id"]));
    });

    app.post(`/${this.name}/:id.json`, async (req, res) => {
      res.json(await this.update(req.params as any));
    });

    app.post(`/${this.name}.json`, async (req, res) => {
      res.json(await this.create(req.params as any));
    });
  }

  // create an item
  create(item: T): Promise<{ status: boolean; _id: string }> {
    return new Promise(async (res, rej) => {
      const _id = uuidv4();
      await fs.writeFileSync(`./${this.name}/${_id}`, item.toString());
      res({ status: true, _id });
    });
  }

  // update an item
  async update(
    item: {
      toString(): string;
      _id: string;
    } & Partial<T>
  ): Promise<{ status: boolean; _id: string }> {
    const record = JSON.parse(item.toString());

    // don't allow re-writing of id
    record.delete["_id"];

    await fs.writeFileSync(`./${this.name}/${item._id}`, record.toString());
    return { status: true, _id: item._id };
  }

  // return an item by id
  find = async (_id: string): Promise<{ status: boolean; item: T }> => {
    const f = `./${this.name}/${_id}.json`;
    return { status: true, item: (await getfile(f)) as any };
    // return new Promise((res, rej) => {
    //   fs.open(f, "r", (err, fd) => {
    //     if (err) {
    //       console.error("Error opening file:", err);
    //       return;
    //     }

    //     fs.fstat(fd, (err, stats) => {
    //       if (err) {
    //         console.error("Error getting file stats:", err);
    //         return;
    //       }

    //       console.log("File size:", stats.size, "bytes");
    //       console.log("Is file:", stats.isFile());
    //       console.log("Is directory:", stats.isDirectory());

    //       fs.close(fd, (err) => {
    //         if (err) {
    //           console.error("Error closing file:", err);
    //           return;
    //         }
    //         res({
    //           status: true,
    //           item: {
    //             _id: "idk",
    //             ...JSON.parse(fs.readFileSync(f).toString()),
    //             lastUpdated: stats.mtime,
    //           },
    //         });
    //       });
    //     });
    //   });
    // });
  };

  // return all ids
  list = async (): Promise<{ status: boolean; ids: string[] }> => {
    return {
      status: true,
      ids: fs
        .readdirSync(`./${this.name}`)
        .map((filepath) => filepath.split(".json")[0]),
    };
  };

  // gather by ids
  gather = async (ids: string[]): Promise<{ status: boolean; items: T[] }> => {
    return new Promise(async (res, rej) => {
      res({
        status: true,
        items: (await Promise.all(
          ids.map(async (_id) => {
            const gotFile = await getfile(`./${this.name}/${_id}.json`);
            return {
              _id,
              ...gotFile,
            };
          })
        )) as any,
      });
    });

    // return ;
  };

  // all = async(): Promise<Record<string,
}

class KanbanModel extends Model<IKanban> {}

class UserModel extends Model<IUser> {}

class MessageModel extends Model<IMessage> {
  namesIndex: Record<string, Set<string>>;
  constructor(modelName: string, expressApp: Express) {
    super(modelName, expressApp);
    this.namesIndex = {};

    this.list().then(({ status, ids }) => {
      ids.forEach((_id) => {
        this.find(_id).then(({ status, item }) => {
          this.index(item, _id);
        });
      });
    });

    expressApp.get(`/${this.name}/owner.json`, async (req, res) => {
      res.json(await this.byOwner((req.params as any).owner));
    });
  }

  index(item, _id) {
    if (!this.namesIndex[item.owner]) {
      this.namesIndex[item.owner] = new Set([_id]);
    } else {
      this.namesIndex[item.owner].add(_id);
    }
  }

  async create(rawMessage: IMessage) {
    const { _id } = await super.create(rawMessage);
    this.index(rawMessage, _id);
    return {
      status: true,
      _id,
    };
  }

  // only allow changes to the body
  async update({ body, _id }: { body: string; _id: string }) {
    await super.update({
      _id,
      body,
    });
    return {
      status: true,
      _id,
    };
  }

  byOwner(owner: string) {
    return this.namesIndex[owner];
  }
}

abstract class MessagableModel<T extends IMessageable> extends Model<T> {
  messageModel: MessageModel;

  constructor(
    modelName: string,
    expressApp: Express,
    messageModel: MessageModel
  ) {
    super(modelName, expressApp);
    this.messageModel = messageModel;
  }
  // async messages(_id: string) {
  //   const { item } = await this.find(_id);
  //   return await this.messageModel.gather(item.messages);
  // }
  async message(rawMessage: IMessage) {
    const m = this.messageModel.create(rawMessage);
    // const { item } = await this.find(subjectId);
    // item.messages.push((await m)._id);
    // await this.update(item);
  }
}

class ProjectModel extends MessagableModel<IProject> {
  // only allow changes to the body
  async update({
    name,
    owner,
    _id,
  }: {
    owner: string;
    name: string;
    _id: string;
  }) {
    await super.update({
      _id,
      name,
    });
    return {
      status: true,
      _id,
    };
  }
}

class TaskModel extends MessagableModel<ITask> {
  // only allow changes to the body
  async update({
    _id,

    end,
    name,
    owner,
    start,
    state,
  }: {
    _id: string;
    end: Date;
    name: string;
    owner: string;
    start: Date;
    state: string;
  }) {
    await super.update({
      _id,
      end,
      name,
      owner,
      start,
      state,
    });
    return {
      status: true,
      _id,
    };
  }
}

class MilestoneModel extends MessagableModel<IMilestone> {
  // only allow changes to the body
  async update({
    _id,

    date,
    name,
    owner,
  }: {
    _id: string;
    date: Date;
    name: string;
    owner: string;
    start: string;
  }) {
    await super.update({
      _id,
      date,
      name,
      owner,
    });
    return {
      status: true,
      _id,
    };
  }
}

export default async (filepath: string, app: Express) => {
  const mm = new MessageModel("Message", app);

  return {
    users: new UserModel("User", app),
    kanbans: new KanbanModel("Kanban", app),
    milestones: new MilestoneModel("Milestone", app, mm),
    tasks: new TaskModel("Task", app, mm),
    projects: new ProjectModel("Project", app, mm),
  };
};
