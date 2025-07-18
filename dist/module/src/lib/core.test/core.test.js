import Testeranto from "../../Pure";
import { specification } from "./core.test.specification";
import { implementation } from "./core.test.implementation";
import { testInterface } from "./core.test.interface";
import { MockCore } from "./MockCore";
export default Testeranto(MockCore.prototype, // test subject
specification, // test scenarios
implementation, // test operations
testInterface, // test lifecycle hooks
{ ports: [] }, // resource requirements
(cb) => cb() // error handler
);
