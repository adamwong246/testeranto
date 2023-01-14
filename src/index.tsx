import ReactDom from "react-dom/client";

import React from "react";
import storefront from "./storefront";

document.addEventListener("DOMContentLoaded", function () {
  const elem = document.getElementById("root");
  if (elem) {
    ReactDom.createRoot(elem).render(React.createElement(storefront));
  }
});
