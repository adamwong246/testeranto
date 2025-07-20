import Testeranto from "../../Pure";
import { specification } from "./core.test.specification";
import { implementation } from "./core.test.implementation";
import { testAdapter } from "./core.test.adapter";
import { I, O, M } from "./core.test.types";
import { MockCore } from "./MockCore";

export default Testeranto<I, O, M>(
  MockCore.prototype, // test subject
  specification, // test scenarios
  implementation, // test operations
  testAdapter, // test lifecycle hooks
  { ports: [] }, // resource requirements
  (cb) => cb() // error handler
);
