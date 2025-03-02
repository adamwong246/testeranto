import { z } from "zod";

export type IUser = {
  email: string;
  profile: string;
} & { _id: string };

// export type IKanban = {
//   title: string;
//   rank: number;
// } & { _id: string };

export type IMessage = {
  body: string;
  owner: string;
  subjectCollection: string;
  subjectId: string;
} & { _id: string };

export type IMessageable = {
  // messages: string[];
} & { _id: string };

// export type IFeature = {
//   title: string;
//   body: string;
//   owner: string;
//   state: string;
// } & { _id: string } & IMessageable;

// export type IGantt = {
//   start: string;
//   end: string;
//   owner: string;
//   name: string;
//   type: "task" | "milestone" | "project";
// } & { _id: string } & IMessageable;

export type IProject = {
  owner: string;
  name: string;
  body: string;
} & { _id: string } & IMessageable;

export type ITask = {
  progress: number;
  start: Date;
  end: Date;
  owner: string;
  name: string;
  state: string;
  body: string;
} & { _id: string } & IMessageable;

export type IMilestone = {
  date: Date;
  owner: string;
  name: string;
  body: string;
} & { _id: string } & IMessageable;

export const kanbanZodSchema = z.object({
  _id: z.string(),
  title: z.string().min(1),
  rank: z.number(),
});

export type IKanban = z.infer<typeof kanbanZodSchema>;
