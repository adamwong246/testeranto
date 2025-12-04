import Tiposkripto from "../Tiposkripto";
import { Calculator } from "./Calculator";
import { adapter } from "./Calculator.test.adapter";
import { implementation } from "./Calculator.test.implementation";
import { specification } from "./Calculator.test.specification";
console.log("mark101");
export default Tiposkripto(Calculator, specification, implementation, adapter);
