"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const GitFsDb_js_1 = __importDefault(require("./GitFsDb.js"));
const port = process.env.PORT || "8080";
const app = (0, express_1.default)();
app.use("/", express_1.default.static(path_1.default.join(process.cwd())));
app.get("/", function (req, res) {
    res.sendFile(`${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskMan.html`);
});
app.get("/TaskManFrontend.js", (req, res) => {
    res.sendFile(`${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskManFrontEnd.js`);
});
app.get("/TaskManFrontEnd.css", (req, res) => {
    res.sendFile(`${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskManFrontEnd.css`);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
const { tasks, projects, milestones } = await (0, GitFsDb_js_1.default)("./", app);
app.get("/features.json", async (req, res) => {
    const allTasks = (await tasks.gather((await tasks.list()).ids)).items.map((t) => {
        return Object.assign(Object.assign({}, t), { filename: `Task/${t._id}.json` });
    });
    const allProjects = (await projects.gather((await projects.list()).ids)).items.map((t) => {
        return Object.assign(Object.assign({}, t), { filename: `Project/${t._id}.json` });
    });
    const allMilestones = (await milestones.gather((await milestones.list()).ids)).items.map((t) => {
        return Object.assign(Object.assign({}, t), { filename: `Milestone/${t._id}.json` });
    });
    res.json([...allTasks, ...allMilestones, ...allProjects].sort((a, b) => a.lastUpdated - b.lastUpdated));
});
["/tests", "/features", "/kanban", "/gantt", "/org"].forEach((r) => {
    app.get(r, (req, res) => {
        res.sendFile(`${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskMan.html`);
    });
});
// app.get("/features", (req, res) => {
//   res.sendFile(
//     `${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskMan.html`
//   );
// });
// app.get("/Project/:id.html", async (req, res) => {
//   // const allTasks = (await tasks.gather((await tasks.list()).ids)).items.map(
//   //   (t) => {
//   //     return {
//   //       ...t,
//   //       filename: `Task/${t._id}.json`,
//   //     };
//   //   }
//   // );
//   // const allProjects = (
//   //   await projects.gather((await projects.list()).ids)
//   // ).items.map((t) => {
//   //   return {
//   //     ...t,
//   //     filename: `Project/${t._id}.json`,
//   //   };
//   // });
//   // const allMilestones = (
//   //   await milestones.gather((await milestones.list()).ids)
//   // ).items.map((t) => {
//   //   return {
//   //     ...t,
//   //     filename: `Milestone/${t._id}.json`,
//   //   };
//   // });
//   res.send({
//     hello: "world",
//   });
// });
