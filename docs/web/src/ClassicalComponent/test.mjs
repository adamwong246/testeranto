import {
  ClassicalComponent,
  require_client
} from "../../chunk-2FNPKSAA.mjs";
import {
  require_react
} from "../../chunk-JE6WFJZI.mjs";
import {
  __toESM
} from "../../chunk-3KGMXYRN.mjs";

// src/ClassicalComponent/test.ts
var import_client = __toESM(require_client(), 1);
var import_react = __toESM(require_react(), 1);
document.addEventListener("DOMContentLoaded", function() {
  const elem = document.getElementById("root");
  if (elem) {
    import_client.default.createRoot(elem).render(import_react.default.createElement(ClassicalComponent, {}));
  }
});
