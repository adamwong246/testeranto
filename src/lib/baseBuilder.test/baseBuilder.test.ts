import Testeranto from "../../Pure";

import { TestBaseBuilder } from "./TestBaseBuilder";

import { specification } from "./baseBuilder.test.specification";
import { implementation } from "./baseBuilder.test.implementation";
import { testInterface } from "./baseBuilder.test.interface";
import { I, O } from "./baseBuilder.test.types";

export default Testeranto<I, O, {}>(
  BaseBuilder.prototype,
  specification,
  implementation,
  testInterface
);
