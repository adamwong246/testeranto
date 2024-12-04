import ReactDom from "react-dom/client";
import React from "react";

import { ClassicalComponent } from "../../src/ClassicalComponent";

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(<h1>Hello, world < /h1>);
  }
});
