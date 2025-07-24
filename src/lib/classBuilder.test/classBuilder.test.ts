import Testeranto from "../../Node";
import { ClassBuilder } from "../classBuilder";
import { specification } from "./classBuilder.test.specification"; 
import { implementation } from "./classBuilder.test.implementation";
import { testAdapter } from "./classBuilder.test.adapter";
import { I, O, M } from "./classBuilder.test.types";

export default Testeranto<I, O, M>(
  ClassBuilder.prototype,
  specification,
  implementation,
  testAdapter,
  { ports: 1 } // Add resource requirements
);
