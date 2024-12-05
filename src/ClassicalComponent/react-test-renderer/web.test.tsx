import test from "testeranto/src/SubPackages/react-test-renderer/component/web";

import { ClassicalComponent } from "../index.js";
import { ClassicalComponentSpec } from "../test.specification.js";
import { testImplementation } from "./test.implementation.js";

// import { testImplementation } from "./test.js";
// import { ClassicalComponentSpec } from "../testeranto.js";

export default test(
  testImplementation,
  ClassicalComponentSpec,
  ClassicalComponent,
);
