import Tiposkripto from "../../Tiposkripto.js";
import { testAdapter } from "./Tiposkripto.adapter";
import { MockTiposkripto } from "./MockTiposkripto";
import { specification } from "./Tiposkripto.specification";
import { implementation } from "./Tiposkripto.implementation";
export default Tiposkripto(MockTiposkripto.prototype, specification, implementation, testAdapter, { ports: 1 });
