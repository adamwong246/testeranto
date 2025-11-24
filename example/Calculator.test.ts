import Tiposkripto from "../src/Tiposkripto";
import { Calculator } from "./Calculator";
import { adapter } from "./Calculator.test.adapter";
import { implementation } from "./Calculator.test.implementation";
import { specification } from "./Calculator.test.specification";
import { I, M, O } from "./Calculator.test.types";

console.log("mark101");

export default Tiposkripto<I, O, M>(
  Calculator,
  specification,
  implementation,
  adapter
);
