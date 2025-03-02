import { Express } from "express";
import { IKanban, IUser, IMessage, IMessageable, IProject, ITask, IMilestone } from "./TaskManTypes";
declare abstract class Model<T extends {
    _id: string;
    toString: () => string;
}> {
    name: string;
    constructor(name: string, app: Express);
    create(item: T): Promise<{
        status: boolean;
        _id: string;
    }>;
    update(item: {
        toString(): string;
        _id: string;
    } & Partial<T>): Promise<{
        status: boolean;
        _id: string;
    }>;
    find: (_id: string) => Promise<{
        status: boolean;
        item: T;
    }>;
    list: () => Promise<{
        status: boolean;
        ids: string[];
    }>;
    gather: (ids: string[]) => Promise<{
        status: boolean;
        items: T[];
    }>;
}
declare class KanbanModel extends Model<IKanban> {
}
declare class UserModel extends Model<IUser> {
}
declare class MessageModel extends Model<IMessage> {
    namesIndex: Record<string, Set<string>>;
    constructor(modelName: string, expressApp: Express);
    index(item: any, _id: any): void;
    create(rawMessage: IMessage): Promise<{
        status: boolean;
        _id: string;
    }>;
    update({ body, _id }: {
        body: string;
        _id: string;
    }): Promise<{
        status: boolean;
        _id: string;
    }>;
    byOwner(owner: string): Set<string>;
}
declare abstract class MessagableModel<T extends IMessageable> extends Model<T> {
    messageModel: MessageModel;
    constructor(modelName: string, expressApp: Express, messageModel: MessageModel);
    message(rawMessage: IMessage): Promise<void>;
}
declare class ProjectModel extends MessagableModel<IProject> {
    update({ name, owner, _id, }: {
        owner: string;
        name: string;
        _id: string;
    }): Promise<{
        status: boolean;
        _id: string;
    }>;
}
declare class TaskModel extends MessagableModel<ITask> {
    update({ _id, end, name, owner, start, state, }: {
        _id: string;
        end: Date;
        name: string;
        owner: string;
        start: Date;
        state: string;
    }): Promise<{
        status: boolean;
        _id: string;
    }>;
}
declare class MilestoneModel extends MessagableModel<IMilestone> {
    update({ _id, date, name, owner, }: {
        _id: string;
        date: Date;
        name: string;
        owner: string;
        start: string;
    }): Promise<{
        status: boolean;
        _id: string;
    }>;
}
declare const _default: (filepath: string, app: Express) => Promise<{
    users: UserModel;
    kanbans: KanbanModel;
    milestones: MilestoneModel;
    tasks: TaskModel;
    projects: ProjectModel;
}>;
export default _default;
