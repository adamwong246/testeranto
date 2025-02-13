import {
  ClassicalComponent
} from "../../chunk-ZAFYTSTM.mjs";
import {
  require_client
} from "../../chunk-5I33OV73.mjs";
import "../../chunk-D54U7RBP.mjs";
import {
  require_react
} from "../../chunk-T4W5FV25.mjs";
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
