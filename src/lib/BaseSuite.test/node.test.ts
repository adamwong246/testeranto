/* eslint-disable @typescript-eslint/no-empty-object-type */
import Testeranto from "../../Node";

import { BaseSuite } from "../BaseSuite";

import { I, implementation, O, specification, testAdapter } from "./test";

export default Testeranto<I, O, {}>(
  BaseSuite,
  specification,
  implementation,
  testAdapter
);
