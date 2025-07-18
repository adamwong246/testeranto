import Testeranto from "../../Web";

import { BaseSuite } from "../BaseSuite";

import { I, implementation, O, specification, testInterface } from "./test";

export default Testeranto<I, O, {}>(
  BaseSuite,
  specification,
  implementation,
  testInterface
);
