import mongoose from "mongoose";
export const userSchema = new mongoose.Schema({
    email: String,
});
userSchema.virtual("features", {
    ref: "Feature",
    localField: "_id",
    foreignField: "owner",
});
export const kanbanSchema = new mongoose.Schema({
    title: String,
});
export const ganttSchema = new mongoose.Schema({
    name: String,
    type: String,
    start: Date,
    end: Date,
});
export const featuresSchema = new mongoose.Schema({
    title: String,
    state: String,
});
export const chatCatMessageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
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
export const HuddleSchema = new mongoose.Schema({});
export const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
});
