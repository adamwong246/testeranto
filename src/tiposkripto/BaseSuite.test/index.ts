import Tiposkripto from "../Tiposkripto";

import { BaseSuite } from "../BaseSuite";

import { I, implementation, O, specification, testAdapter } from "./utils";

export default Tiposkripto<I, O, unknown>(
  BaseSuite,
  specification,
  implementation,
  testAdapter
);
