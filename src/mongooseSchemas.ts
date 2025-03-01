// import mongoose from "mongoose";

// export interface IUser {
//   email: string;
//   channels: string[];
//   dmgroups: string[];
// }

// export const userSchema = new mongoose.Schema<IUser>({
//   email: String,
//   channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
//   dmgroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dmgroup" }],
// });

// userSchema.virtual("features", {
//   ref: "Feature",
//   localField: "_id",
//   foreignField: "owner",
// });

// export interface IKanban {
//   title: string;
// }

// export const kanbanSchema = new mongoose.Schema<IKanban>({
//   title: String,
// });

// export interface IGantt {
//   name: string;
//   type: "task" | "milestone" | "project";
//   start: Date;
//   end: Date;
// }

// export const ganttSchema = new mongoose.Schema<IGantt>({
//   name: String,
//   type: String,
//   start: Date,
//   end: Date,
// });

// export interface IFeature {
//   title: string;
//   state: string;
//   owner: {
//     type: mongoose.Schema.Types.ObjectId;
//     required: true;
//     ref: "User";
//   };
// }

// export const featuresSchema = new mongoose.Schema<IFeature>({
//   title: String,
//   state: String,
// });

// export const channelsFeature = new mongoose.Schema<IChatChannel>({});

// export const chatCatMessageSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   room: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "ChatCatRoom",
//     required: true,
//     maxlength: 100,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now(),
//   },
//   text: {
//     type: String,
//     maxlength: 1000,
//   },
// });

// // A channel is a base type, extended by both a huddle and room
// export interface IChatChannel {
//   users: string[];
//   messages: [{ type: mongoose.Schema.Types.ObjectId; ref: "Message" }];
// }

// export interface IChatCatHuddle {
//   users: {
//     type: String;
//     unique: true;
//     required: true;
//   }[];
// }

// export const HuddleSchema = new mongoose.Schema<IChatCatHuddle>({});

// // a room is just a channel with a name
// export interface IChatCatRoom {
//   name: string;
// }

// export const RoomSchema = new mongoose.Schema<IChatCatRoom>({
//   name: { type: String, required: true },
// });
