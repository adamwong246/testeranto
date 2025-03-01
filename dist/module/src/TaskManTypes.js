import { z } from "zod";
export const kanbanZodSchema = z.object({
    _id: z.string(),
    title: z.string().min(1),
    rank: z.number(),
});
