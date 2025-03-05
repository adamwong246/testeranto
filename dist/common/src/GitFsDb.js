"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
async function getfile(f) {
    return new Promise((res, rej) => {
        fs_1.default.open(f, "r", (err, fd) => {
            if (err) {
                console.error("Error opening file:", err);
                return;
            }
            fs_1.default.fstat(fd, (err, stats) => {
                if (err) {
                    console.error("Error getting file stats:", err);
                    return;
                }
                fs_1.default.close(fd, (err) => {
                    if (err) {
                        console.error("Error closing file:", err);
                        return;
                    }
                    const jsonBody = fs_1.default.readFileSync(f).toString();
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
            if (fs_1.default.existsSync(f)) {
                return { status: true, item: (await getfile(f)) };
            }
            else {
                return { status: false, item: null };
            }
        };
        // return all ids
        this.list = async () => {
            return {
                status: true,
                ids: fs_1.default
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
        if (!fs_1.default.existsSync(`./${this.name}`)) {
            fs_1.default.mkdirSync(`./${this.name}`, {});
        }
        app.get(`/${this.name}.json`, async (req, res) => {
            res.json(await this.list());
        });
        // app.get(`/${this.name}/:id.json`, async (req, res) => {
        //   console.log("mark1", req.params);
        //   res.json(await this.find(req.params["id"]));
        // });
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
            const _id = (0, uuid_1.v4)();
            await fs_1.default.writeFileSync(`./${this.name}/${_id}`, item.toString());
            res({ status: true, _id });
        });
    }
    // update an item
    async update(item) {
        const record = JSON.parse(item.toString());
        // don't allow re-writing of id
        record.delete["_id"];
        await fs_1.default.writeFileSync(`./${this.name}/${item._id}`, record.toString());
        return { status: true, _id: item._id };
    }
}
class KanbanModel extends Model {
}
class UserModel extends Model {
    findOrCreate(profileId, cb) {
        const f = this.find(profileId);
        if (f) {
            return { status: true, item: f };
        }
        else {
            return this.create({ _id: profileId });
            // return { status: false, item: null };
        }
    }
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
exports.default = async (filepath, app) => {
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
