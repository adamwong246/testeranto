import { Express } from "express";
import { z } from "zod";
export declare const kanbanZodSchema: z.ZodObject<{
    _id: z.ZodString;
    title: z.ZodString;
    rank: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    title: string;
    _id: string;
    rank: number;
}, {
    title: string;
    _id: string;
    rank: number;
}>;
export declare type IKanban = z.infer<typeof kanbanZodSchema>;
declare type IMessageable = {} & {
    _id: string;
};
export declare type IFeature = {
    body: string;
    owner: string;
    state: string;
} & {
    _id: string;
} & IMessageable;
export declare type IUser = {
    uid: string;
    name: string;
} & {
    _id: string;
};
declare const _default: (filepath: string, app: Express) => Promise<void>;
export default _default;
