import Testeranto from "../../Web";
import { BaseSuite } from "../BaseSuite";
import { implementation, specification, testInterface } from "./test";
export default Testeranto(BaseSuite, specification, implementation, testInterface);
