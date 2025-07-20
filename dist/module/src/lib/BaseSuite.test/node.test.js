import Testeranto from "../../Node";
import { BaseSuite } from "../BaseSuite";
import { implementation, specification, testAdapter } from "./test";
export default Testeranto(BaseSuite, specification, implementation, testAdapter);
