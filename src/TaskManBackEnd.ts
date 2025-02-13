import express from "express";
import { MongoClient } from "mongodb";
import path from "path";

const conn = await new MongoClient(`mongodb://localhost:27017`).connect();
const db = conn.db("taskman");

const featuresCollection = db.collection("features");
await featuresCollection.insertOne({
  title: "chores",
  element: "task",
});

await featuresCollection.insertOne({
  title: "Walk dog",
});

await featuresCollection.insertOne({
  title: "Take out trash",
});

// const collection = db.collection("nodes");

// await collection.insertOne({
//   title: "chores",
//   element: "task",
// });

// await collection.insertOne({
//   title: "Walk dog",
//   element: "task",
// });

// await collection.insertOne({
//   title: "Take out trash",
//   element: "task",
// });

// await collection.insertOne({
//   title: "todo",
//   element: "progress_state",
// });

// await collection.insertOne({
//   title: "in progress",
//   element: "progress_state",
// });

// await collection.insertOne({
//   title: "done",
//   element: "progress_state",
// });

// await collection.insertOne({
//   title: "some major release",
//   element: "milestone",
// });

// await collection.insertOne({
//   title: "some minor release",
//   element: "milestone",
// });

// /////////////////////////////////////////////////////////////////
// const collectionOfEdges = db.collection("Edges");

// await collectionOfEdges.insertOne({
//   title: "is part of",
//   elementA: "task",
//   elementB: "task",
// });

// await collectionOfEdges.insertOne({
//   title: "duplicates",
//   elementA: "task",
//   elementB: "task",
// });

// await collectionOfEdges.insertOne({
//   title: "in conflict with",
//   elementA: "task",
//   elementB: "task",
// });

// await collectionOfEdges.insertOne({
//   title: "moves to",
//   elementA: "progress_state",
//   elementB: "progress_state",
// });

// await collectionOfEdges.insertOne({
//   title: "comes before",
//   elementA: "milestone",
//   elementB: "milestone",
// });

// await collectionOfEdges.insertOne({
//   title: "is in the progress state of",
//   elementA: "task",
//   elementB: "progress_state",
// });

// await collectionOfEdges.insertOne({
//   title: "is in the milestone",
//   elementA: "task",
//   elementB: "milestone",
// });

// await collection.insertOne({
//   title: "Walk dog",
//   element: "task",
// });

const app = express();
const port = 3000;

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

app.get("/testeranto.json", (req, res) => {
  res.sendFile(`${process.cwd()}/docs/testeranto.json`);
});

// app.get("TaskManFrontEnd.js", (req));
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">

<head>
  <meta name="description" content="Webpage description goes here" />
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="author" content="" />

  <title>TaskMan</title>

  <link rel="stylesheet" href="/TaskManFrontEnd.css" />
  <script type="module" src="/TaskManFrontEnd.js"></script>
</head>

<body><div id="root">react is loading</div></body>

</html>`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

///////////////////////////////////////////////

app.get("/features", async (req, res) => {
  // featuresCollection.find({}).toArray(function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  //   db.close();
  // });
  res.json(await featuresCollection.find({}).toArray());
  // res.sendFile(
  //   `${process.cwd()}/node_modules/testeranto/dist/prebuild/TaskManFrontEnd.js`
  // );
});

// const path = require("path");
app.use("/docs", express.static(path.join(process.cwd(), "docs")));
