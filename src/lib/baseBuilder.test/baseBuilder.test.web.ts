import Testeranto from "../../Web";

import { specification } from "./baseBuilder.test.specification";
import { implementation } from "./baseBuilder.test.implementation";
import { testInterface } from "./baseBuilder.test.interface";
import { I, O } from "./baseBuilder.test.types";
import { BaseBuilder } from "../basebuilder";

export default Testeranto<I, O, {}>(
  BaseBuilder.prototype,
  specification,
  implementation,
  testInterface
);
