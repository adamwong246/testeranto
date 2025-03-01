import mongoose from "mongoose";
export interface IUser {
    email: string;
    channels: string[];
    dmgroups: string[];
}
export declare const userSchema: mongoose.Schema<IUser, mongoose.Model<IUser, any, any, any, mongoose.Document<unknown, any, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IUser, mongoose.Document<unknown, {}, mongoose.FlatRecord<IUser>> & mongoose.FlatRecord<IUser> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export interface IKanban {
    title: string;
}
export declare const kanbanSchema: mongoose.Schema<IKanban, mongoose.Model<IKanban, any, any, any, mongoose.Document<unknown, any, IKanban> & IKanban & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IKanban, mongoose.Document<unknown, {}, mongoose.FlatRecord<IKanban>> & mongoose.FlatRecord<IKanban> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export interface IGantt {
    name: string;
    type: "task" | "milestone" | "project";
    start: Date;
    end: Date;
}
export declare const ganttSchema: mongoose.Schema<IGantt, mongoose.Model<IGantt, any, any, any, mongoose.Document<unknown, any, IGantt> & IGantt & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IGantt, mongoose.Document<unknown, {}, mongoose.FlatRecord<IGantt>> & mongoose.FlatRecord<IGantt> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export interface IFeature {
    title: string;
    state: string;
    owner: {
        type: mongoose.Schema.Types.ObjectId;
        required: true;
        ref: "User";
    };
}
export declare const featuresSchema: mongoose.Schema<IFeature, mongoose.Model<IFeature, any, any, any, mongoose.Document<unknown, any, IFeature> & IFeature & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IFeature, mongoose.Document<unknown, {}, mongoose.FlatRecord<IFeature>> & mongoose.FlatRecord<IFeature> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const channelsFeature: mongoose.Schema<IChatChannel, mongoose.Model<IChatChannel, any, any, any, mongoose.Document<unknown, any, IChatChannel> & IChatChannel & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IChatChannel, mongoose.Document<unknown, {}, mongoose.FlatRecord<IChatChannel>> & mongoose.FlatRecord<IChatChannel> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const chatCatMessageSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    user: mongoose.Types.ObjectId;
    room: mongoose.Types.ObjectId;
    timestamp: NativeDate;
    text?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    user: mongoose.Types.ObjectId;
    room: mongoose.Types.ObjectId;
    timestamp: NativeDate;
    text?: string | null | undefined;
}>> & mongoose.FlatRecord<{
    user: mongoose.Types.ObjectId;
    room: mongoose.Types.ObjectId;
    timestamp: NativeDate;
    text?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export interface IChatChannel {
    users: string[];
    messages: [{
        type: mongoose.Schema.Types.ObjectId;
        ref: "Message";
    }];
}
export interface IChatCatHuddle {
    users: {
        type: String;
        unique: true;
        required: true;
    }[];
}
export declare const HuddleSchema: mongoose.Schema<IChatCatHuddle, mongoose.Model<IChatCatHuddle, any, any, any, mongoose.Document<unknown, any, IChatCatHuddle> & IChatCatHuddle & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IChatCatHuddle, mongoose.Document<unknown, {}, mongoose.FlatRecord<IChatCatHuddle>> & mongoose.FlatRecord<IChatCatHuddle> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export interface IChatCatRoom {
    name: string;
}
export declare const RoomSchema: mongoose.Schema<IChatCatRoom, mongoose.Model<IChatCatRoom, any, any, any, mongoose.Document<unknown, any, IChatCatRoom> & IChatCatRoom & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IChatCatRoom, mongoose.Document<unknown, {}, mongoose.FlatRecord<IChatCatRoom>> & mongoose.FlatRecord<IChatCatRoom> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
