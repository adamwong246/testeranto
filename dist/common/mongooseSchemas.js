"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomSchema = exports.HuddleSchema = exports.chatCatMessageSchema = exports.channelsFeature = exports.featuresSchema = exports.ganttSchema = exports.kanbanSchema = exports.userSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.userSchema = new mongoose_1.default.Schema({
    email: String,
    channels: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Channel" }],
    dmgroups: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Dmgroup" }],
});
exports.userSchema.virtual("features", {
    ref: "Feature",
    localField: "_id",
    foreignField: "owner",
});
exports.kanbanSchema = new mongoose_1.default.Schema({
    title: String,
});
exports.ganttSchema = new mongoose_1.default.Schema({
    name: String,
    type: String,
    start: Date,
    end: Date,
});
exports.featuresSchema = new mongoose_1.default.Schema({
    title: String,
    state: String,
});
exports.channelsFeature = new mongoose_1.default.Schema({});
exports.chatCatMessageSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    room: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "ChatCatRoom",
        required: true,
        maxlength: 100,
    },
    timestamp: {
        type: Date,
        default: Date.now(),
    },
    text: {
        type: String,
        maxlength: 1000,
    },
});
exports.HuddleSchema = new mongoose_1.default.Schema({});
exports.RoomSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
});
