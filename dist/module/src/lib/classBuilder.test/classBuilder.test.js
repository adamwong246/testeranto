import Testeranto from "../../Node";
import { ClassBuilder } from "../classBuilder";
import { specification } from "./classBuilder.test.specification";
import { implementation } from "./classBuilder.test.implementation";
import { testInterface } from "./classBuilder.test.interface";
export default Testeranto(ClassBuilder.prototype, specification, implementation, testInterface);
