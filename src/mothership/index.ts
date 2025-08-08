import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/claim", (req, res) => {
  const { resource } = req.query;
  console.log(`Resource claimed: ${resource}`);
  res.status(200).json({ status: 'claimed', resource });
});

export default (port: number) => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

  return app;
};
