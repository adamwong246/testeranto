import {
  require_react_dom
} from "../../chunk-D54U7RBP.mjs";
import {
  ClassicalComponent
} from "../../chunk-XSZNNJY6.mjs";
import {
  require_react
} from "../../chunk-T4W5FV25.mjs";
import {
  __commonJS,
  __toESM
} from "../../chunk-3KGMXYRN.mjs";

// node_modules/react-dom/client.js
var require_client = __commonJS({
  "node_modules/react-dom/client.js"(exports) {
    "use strict";
    var m = require_react_dom();
    if (false) {
      exports.createRoot = m.createRoot;
      exports.hydrateRoot = m.hydrateRoot;
    } else {
      i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      exports.createRoot = function(c, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.createRoot(c, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
      exports.hydrateRoot = function(c, h, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.hydrateRoot(c, h, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
    }
    var i;
  }
});

// src/ClassicalComponent/test.ts
var import_client = __toESM(require_client(), 1);
var import_react = __toESM(require_react(), 1);
document.addEventListener("DOMContentLoaded", function() {
  const elem = document.getElementById("root");
  if (elem) {
    import_client.default.createRoot(elem).render(import_react.default.createElement(ClassicalComponent, {}));
  }
});
