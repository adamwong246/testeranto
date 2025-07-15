import Testeranto from "../../Pure";
import { ClassBuilder } from "../classBuilder";
import { specification } from "./classBuilder.test.specification";
import { implementation } from "./classBuilder.test.implementation";
import { testInterface } from "./classBuilder.test.interface";
import { I, O, M } from "./classBuilder.test.types";

export default Testeranto<I, O, M>(
  ClassBuilder.prototype,
  specification,
  implementation,
  testInterface
);
