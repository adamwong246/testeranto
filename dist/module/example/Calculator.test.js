import Testeranto from "testeranto/src/Node";
import { specification } from "./Calculator.test.specification";
import { implementation } from "./Calculator.test.implementation";
import { adapter } from "./Calculator.test.adapter";
import { Calculator } from "./Calculator";
export default Testeranto(Calculator, specification, implementation, adapter);
