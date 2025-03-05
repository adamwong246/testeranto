"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = __importDefault(require("passport-github2"));
const GitFsDb_js_1 = __importDefault(require("./GitFsDb.js"));
const port = process.env.PORT || "8080";
const app = (0, express_1.default)();
const staticPath = path_1.default.join(process.cwd());
console.log("staticPath", staticPath);
app.use("/", express_1.default.static(staticPath));
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
const { tasks, projects, milestones, users } = await (0, GitFsDb_js_1.default)("./", app);
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
[
    "/tests/**",
    "/features/**",
    "/kanban/**",
    "/gantt/**",
    "/org/**",
    "/owners/**",
    "/sprint/**",
    "/git/**",
].forEach((r) => {
    app.get(r, (req, res) => {
        res.sendFile(`${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskMan.html`);
    });
});
passport_1.default.use(new passport_github2_1.default({
    clientID: "Ov23liY2OpcexmP1KRl8",
    clientSecret: "a5a7daa33c7df57b44ee2dda010787d9d1cc053d",
    callbackURL: "http://127.0.0.1:8080/auth/github/callback",
}, function (accessToken, refreshToken, profile, done) {
    users.findOrCreate(profile.id, function (err, user) {
        return done(err, user);
    });
}));
app.get("/auth/github", passport_1.default.authenticate("github"));
app.get("/auth/github/callback", passport_1.default.authenticate("github", { failureRedirect: "/login" }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});
