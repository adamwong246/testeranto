import Tiposkripto from "../Tiposkripto.js";

import { testAdapter } from "./Tiposkripto.adapter.js";
import { I, O, M } from "./Tiposkripto.types.js";
import { MockTiposkripto } from "./MockTiposkripto.js";
import { specification } from "./Tiposkripto.specification.js";
import { implementation } from "./Tiposkripto.implementation.js";

export default Tiposkripto<I, O, M>(
  MockTiposkripto.prototype,
  specification,
  implementation,
  testAdapter,
  { ports: 1 }
);
