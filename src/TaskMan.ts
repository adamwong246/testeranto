import express from "express";
import path from "path";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import session from "express-session";

import GitFsDb from "./GitFsDb.js";

// const configFile = process.argv[2];
// console.log("configFile", configFile);

const port = process.env.PORT || "8080";

const app = express();

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

const staticPath = path.join(process.cwd());
console.log("staticPath", staticPath);
app.use("/", express.static(staticPath));

app.get("/", function (req, res) {
  res.sendFile(
    `${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskMan.html`
  );
});

app.get("/TaskMan.json", (req, res) => {
  res.sendFile(`${process.cwd()}/TaskMan.json`);
});

app.get("/TaskManFrontend.js", (req, res) => {
  res.sendFile(
    `${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskManFrontEnd.js`
  );
});

app.get("/TaskManFrontEnd.css", (req, res) => {
  res.sendFile(
    `${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskManFrontEnd.css`
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const { tasks, projects, milestones, users } = await GitFsDb("./", app);

app.get("/features.json", async (req, res) => {
  const allTasks = (await tasks.gather((await tasks.list()).ids)).items.map(
    (t) => {
      return {
        ...t,
        filename: `Task/${t._id}.json`,
      };
    }
  );

  const allProjects = (
    await projects.gather((await projects.list()).ids)
  ).items.map((t) => {
    return {
      ...t,
      filename: `Project/${t._id}.json`,
    };
  });

  const allMilestones = (
    await milestones.gather((await milestones.list()).ids)
  ).items.map((t) => {
    return {
      ...t,
      filename: `Milestone/${t._id}.json`,
    };
  });

  res.json(
    [...allTasks, ...allMilestones, ...allProjects].sort(
      (a: any, b: any) => a.lastUpdated - b.lastUpdated
    )
  );
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
    res.sendFile(
      `${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskMan.html`
    );
  });
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

const accessTokens = {};

passport.use(
  new GitHubStrategy(
    {
      clientID: "Ov23liY2OpcexmP1KRl8", //process.env.GITHUB_CLIENT_ID,
      clientSecret: "a5a7daa33c7df57b44ee2dda010787d9d1cc053d", //process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("GitHubStrategy", accessToken, refreshToken, profile, done);

      new Promise(async (res, rej) => {
        const { item, status } = await users.findOrCreate(profile.id);
        console.log("Done", status, item);
        done(null, item._id);
        accessTokens[item._id] = accessToken;
        res({});
      });
      //

      // users.findOrCreate(profile.id, function (err, user) {
      //   console.log("USER", err, user);

      //   return done(err, user);
      // });
    }
  )
);

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    // session: false,
    failureRedirect: "/login",
  }),
  function (req, res) {
    console.log("Successful authentication, redirect home.");
    res.redirect("/");
  }
);

app.use((req, res, next) => {
  console.log("Session:", req.session);
  next();
});

app.get("/session", (req, res) => {
  if (req.session) {
    res.send(
      JSON.stringify({
        ...req.session,
        accessToken:
          (req.session as any).passport &&
          accessTokens[(req.session as any).passport.user],
      })
    );
  } else {
    res.send("No session data found");
  }
});

app.get("/logout", (req, res) => {
  if ((req.session as any).passport?.user) {
    delete accessTokens[(req.session as any).passport.user];
  }

  req.session.destroy((err) => {
    res.redirect("/");
  });
});
