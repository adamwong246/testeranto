import ReactDom from "react-dom/client";

import React from "react";
import { ClassicalComponent } from "./ClassicalComponent";

console.log("hello esbuild");

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("body-children");
  if (elem) {
    return ReactDom.createRoot(elem).render(
      React.createElement(ClassicalComponent)
    );
  }
});
