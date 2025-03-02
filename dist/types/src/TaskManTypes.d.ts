import { z } from "zod";
export declare type IUser = {
    email: string;
    profile: string;
} & {
    _id: string;
};
export declare type IMessage = {
    body: string;
    owner: string;
    subjectCollection: string;
    subjectId: string;
} & {
    _id: string;
};
export declare type IMessageable = {} & {
    _id: string;
};
export declare type IGitGraph = object;
export declare type ISprint = {
    start: string;
    end: string;
    notes: string;
} & {
    _id: string;
};
export declare type IProject = {
    owner: string;
    name: string;
    body: string;
} & {
    _id: string;
} & IMessageable;
export declare type ITask = {
    progress: number;
    start: Date;
    end: Date;
    owner: string;
    name: string;
    state: string;
    body: string;
} & {
    _id: string;
} & IMessageable;
export declare type IMilestone = {
    date: Date;
    owner: string;
    name: string;
    body: string;
} & {
    _id: string;
} & IMessageable;
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
