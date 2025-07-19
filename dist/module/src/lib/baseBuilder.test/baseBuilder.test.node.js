import Testeranto from "../../Pure";
import { specification } from "./baseBuilder.test.specification";
import { implementation } from "./baseBuilder.test.implementation";
import { testInterface } from "./baseBuilder.test.interface";
import { MockBaseBuilder } from "./baseBuilder.test.mock";
export default Testeranto(MockBaseBuilder.prototype, specification, implementation, testInterface);
