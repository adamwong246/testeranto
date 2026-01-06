import { Analyzer } from "../src/lib/tiposkripto/Analyzer";
import Tiposkripto from "../src/lib/tiposkripto/Tiposkripto";
import { Calculator } from "./Calculator";
import { adapter } from "./Calculator.test.adapter";
import { implementation } from "./Calculator.test.implementation";
import { specification } from "./Calculator.test.specification";
import { I, M, O } from "./Calculator.test.types";
// import { TsAnalyzer } from "./TsAnalyzer";

export default Tiposkripto<I, O, M>(
  Calculator,
  specification,
  implementation,
  adapter,
  { ports: 1000 }
  // new TsAnalyzer()
);
