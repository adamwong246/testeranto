import fs from "fs";
import { v4 as uuidv4 } from "uuid";
async function getfile(f) {
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
                fs.close(fd, (err) => {
                    if (err) {
                        console.error("Error closing file:", err);
                        return;
                    }
                    const jsonBody = fs.readFileSync(f).toString();
                    res(Object.assign(Object.assign({}, JSON.parse(jsonBody)), { lastUpdated: stats.mtime }));
                });
            });
        });
    });
}
class Model {
    constructor(name, app) {
        // return an item by id
        this.find = async (_id) => {
            const f = `./${this.name}/${_id}.json`;
            return { status: true, item: (await getfile(f)) };
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
        this.list = async () => {
            return {
                status: true,
                ids: fs
                    .readdirSync(`./${this.name}`)
                    .map((filepath) => filepath.split(".json")[0]),
            };
        };
        // gather by ids
        this.gather = async (ids) => {
            return new Promise(async (res, rej) => {
                res({
                    status: true,
                    items: (await Promise.all(ids.map(async (_id) => {
                        const gotFile = await getfile(`./${this.name}/${_id}.json`);
                        return Object.assign({ _id }, gotFile);
                    }))),
                });
            });
            // return ;
        };
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
            res.json(await this.update(req.params));
        });
        app.post(`/${this.name}.json`, async (req, res) => {
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
        // don't allow re-writing of id
        record.delete["_id"];
        await fs.writeFileSync(`./${this.name}/${item._id}`, record.toString());
        return { status: true, _id: item._id };
    }
}
class KanbanModel extends Model {
}
class UserModel extends Model {
}
class MessageModel extends Model {
    constructor(modelName, expressApp) {
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
            res.json(await this.byOwner(req.params.owner));
        });
    }
    index(item, _id) {
        if (!this.namesIndex[item.owner]) {
            this.namesIndex[item.owner] = new Set([_id]);
        }
        else {
            this.namesIndex[item.owner].add(_id);
        }
    }
    async create(rawMessage) {
        const { _id } = await super.create(rawMessage);
        this.index(rawMessage, _id);
        return {
            status: true,
            _id,
        };
    }
    // only allow changes to the body
    async update({ body, _id }) {
        await super.update({
            _id,
            body,
        });
        return {
            status: true,
            _id,
        };
    }
    byOwner(owner) {
        return this.namesIndex[owner];
    }
}
class MessagableModel extends Model {
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
        // const { item } = await this.find(subjectId);
        // item.messages.push((await m)._id);
        // await this.update(item);
    }
}
class ProjectModel extends MessagableModel {
    // only allow changes to the body
    async update({ name, owner, _id, }) {
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
class TaskModel extends MessagableModel {
    // only allow changes to the body
    async update({ _id, end, name, owner, start, state, }) {
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
class MilestoneModel extends MessagableModel {
    // only allow changes to the body
    async update({ _id, date, name, owner, }) {
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
class SprintModel extends Model {
}
export default async (filepath, app) => {
    const mm = new MessageModel("Message", app);
    return {
        users: new UserModel("User", app),
        kanbans: new KanbanModel("Kanban", app),
        sprints: new SprintModel("Sprint", app),
        milestones: new MilestoneModel("Milestone", app, mm),
        tasks: new TaskModel("Task", app, mm),
        projects: new ProjectModel("Project", app, mm),
    };
};
