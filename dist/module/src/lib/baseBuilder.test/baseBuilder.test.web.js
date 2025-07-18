import Testeranto from "../../Web";
import { specification } from "./baseBuilder.test.specification";
import { implementation } from "./baseBuilder.test.implementation";
import { testInterface } from "./baseBuilder.test.interface";
import { BaseBuilder } from "../basebuilder";
export default Testeranto(BaseBuilder.prototype, specification, implementation, testInterface);
