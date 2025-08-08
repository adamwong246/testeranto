/* eslint-disable @typescript-eslint/no-empty-object-type */
import Testeranto from "../../Pure";

import { specification } from "./baseBuilder.test.specification";
import { implementation } from "./baseBuilder.test.implementation";
import { testAdapter } from "./baseBuilder.test.adapter";
import { I, O } from "./baseBuilder.test.types";

import { MockBaseBuilder } from "./baseBuilder.test.mock";

export default Testeranto<I, O, {}>(
  MockBaseBuilder.prototype,
  specification,
  implementation,
  testAdapter
);
