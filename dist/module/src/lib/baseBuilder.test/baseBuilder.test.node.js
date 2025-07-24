/* eslint-disable @typescript-eslint/no-empty-object-type */
import Testeranto from "../../Node";
import { specification } from "./baseBuilder.test.specification";
import { implementation } from "./baseBuilder.test.implementation";
import { testAdapter } from "./baseBuilder.test.adapter";
import { MockBaseBuilder } from "./baseBuilder.test.mock";
export default Testeranto(MockBaseBuilder.prototype, specification, implementation, testAdapter);
