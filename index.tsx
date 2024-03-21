import { Report } from "testeranto/src/Report";
import ReactDom from "react-dom/client";
import React from "react";

import baseConfig from "./testeranto-config-dev.mjs"

document.addEventListener("DOMContentLoaded", function () {
  console.log("hello from report! mark2");
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(Report, { config: baseConfig }));
  }
});

