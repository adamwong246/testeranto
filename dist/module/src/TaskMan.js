import express from "express";
import path from "path";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import GitFsDb from "./GitFsDb.js";
const port = process.env.PORT || "8080";
const app = express();
const staticPath = path.join(process.cwd());
console.log("staticPath", staticPath);
app.use("/", express.static(staticPath));
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
const { tasks, projects, milestones, users } = await GitFsDb("./", app);
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
passport.use(new GitHubStrategy({
    clientID: "Ov23liY2OpcexmP1KRl8",
    clientSecret: "a5a7daa33c7df57b44ee2dda010787d9d1cc053d",
    callbackURL: "http://127.0.0.1:8080/auth/github/callback",
}, function (accessToken, refreshToken, profile, done) {
    users.findOrCreate(profile.id, function (err, user) {
        return done(err, user);
    });
}));
app.get("/auth/github", passport.authenticate("github"));
app.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});
