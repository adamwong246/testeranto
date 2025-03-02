import express from "express";
import path from "path";

import GitFsDb from "./GitFsDb.js";

const port = process.env.PORT || "8080";

const app = express();

app.use("/", express.static(path.join(process.cwd())));

app.get("/", function (req, res) {
  res.sendFile(
    `${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskMan.html`
  );
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

const { tasks, projects, milestones } = await GitFsDb("./", app);

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
].forEach((r) => {
  app.get(r, (req, res) => {
    res.sendFile(
      `${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskMan.html`
    );
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
