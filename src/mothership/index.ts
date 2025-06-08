import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default (port: number) => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

  return app;
};
