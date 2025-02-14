import mongoose from "mongoose";
import { IChatChannel } from "./mongooseSchemas";
export declare const chatChannel: mongoose.Schema<IChatChannel, mongoose.Model<IChatChannel, any, any, any, mongoose.Document<unknown, any, IChatChannel> & IChatChannel & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IChatChannel, mongoose.Document<unknown, {}, mongoose.FlatRecord<IChatChannel>> & mongoose.FlatRecord<IChatChannel> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
