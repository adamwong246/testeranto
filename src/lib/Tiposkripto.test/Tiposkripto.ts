import Tiposkripto from "../../Tiposkripto.js";

import { testAdapter } from "./Tiposkripto.adapter";
import { I, O, M } from "./Tiposkripto.types";
import { MockTiposkripto } from "./MockTiposkripto";
import { specification } from "./Tiposkripto.specification";
import { implementation } from "./Tiposkripto.implementation";

export default Tiposkripto<I, O, M>(
  MockTiposkripto.prototype,
  specification,
  implementation,
  testAdapter,
  { ports: 1 }
);
