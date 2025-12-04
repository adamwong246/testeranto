import Tiposkripto from "../../Tiposkripto";
import { BaseSuite } from "../BaseSuite";
import { implementation, specification, testAdapter } from "./utils";
export default Tiposkripto(BaseSuite, specification, implementation, testAdapter);
