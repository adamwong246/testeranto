"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kanbanZodSchema = void 0;
const zod_1 = require("zod");
exports.kanbanZodSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    title: zod_1.z.string().min(1),
    rank: zod_1.z.number(),
});
