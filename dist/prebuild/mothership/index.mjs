import { createRequire } from 'module';const require = createRequire(import.meta.url);

// src/mothership/index.ts
import express from "express";
var app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
var mothership_default = (port) => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  return app;
};
export {
  mothership_default as default
};
