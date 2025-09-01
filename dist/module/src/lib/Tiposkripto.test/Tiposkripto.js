import Testeranto from "../../Node";
import { testAdapter } from "./Tiposkripto.adapter";
import { MockTiposkripto } from "./MockTiposkripto";
import { specification } from "./Tiposkripto.specification";
import { implementation } from "./Tiposkripto.implementation";
export default Testeranto(MockTiposkripto.prototype, specification, implementation, testAdapter, { ports: 1 });
