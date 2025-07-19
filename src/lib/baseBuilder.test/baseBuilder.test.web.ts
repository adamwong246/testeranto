import Testeranto from "../../Web";

import { specification } from "./baseBuilder.test.specification";
import { implementation } from "./baseBuilder.test.implementation";
import { testInterface } from "./baseBuilder.test.interface";
import { I, O } from "./baseBuilder.test.types";

import { MockBaseBuilder } from "./baseBuilder.test.mock";

export default Testeranto<I, O, {}>(
  MockBaseBuilder.prototype,
  specification,
  implementation,
  testInterface
);
