import Testeranto from "../../Node";
import { ClassBuilder } from "../classBuilder";
import { specification } from "./classBuilder.test.specification";
import { implementation } from "./classBuilder.test.implementation";
import { testAdapter } from "./classBuilder.test.adapter";
export default Testeranto(ClassBuilder.prototype, specification, implementation, testAdapter);
