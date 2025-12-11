import {
  __esm
} from "./chunk-3X2YHN6Q.mjs";

// src/server/nodeVersion.ts
var version, baseNodeImage;
var init_nodeVersion = __esm({
  "src/server/nodeVersion.ts"() {
    "use strict";
    version = "20.19.4";
    baseNodeImage = `node:${version}-alpine`;
  }
});

export {
  baseNodeImage,
  init_nodeVersion
};
