import {
  BaseTiposkripto
} from "./chunk-57HFMKB2.mjs";
import {
  defaultTestResourceRequirement
} from "./chunk-OO6YKXBX.mjs";

// src/Node.ts
import fs from "fs";
console.log(`[NodeTiposkripto] ${process.argv}`);
var config = { ports: [1111], fs: "testeranto/reports/allTests/example/Calculator.test/node" };
var NodeTiposkripto = class extends BaseTiposkripto {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
    super(
      "node",
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      config
    );
  }
  writeFileSync(filename, payload) {
    console.log("writeFileSync", filename);
    const dir = "testeranto/reports/allTests/example";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filename, payload);
  }
};
var tiposkripto = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
  try {
    const t = new NodeTiposkripto(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter
    );
    return t;
  } catch (e) {
    console.error(`[Node] Error creating Tiposkripto:`, e);
    console.error(e.stack);
    process.exit(-1);
  }
};
var Node_default = tiposkripto;
export {
  NodeTiposkripto,
  Node_default as default
};
