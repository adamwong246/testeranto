/* eslint-disable @typescript-eslint/no-empty-object-type */
import Testeranto from "../../Web";
import { BaseSuite } from "../BaseSuite";
import { implementation, specification, testAdapter } from "./test";
export default Testeranto(BaseSuite, specification, implementation, testAdapter);
