import Testeranto from "../../Node";
import { specification } from "./specification";
import { implementation } from "./implementation";
import { testInterface } from "./interface";
import { I, O } from "./types";
import { MockGiven } from "./MockGiven";
import { MockThen } from "./MockThen";
import { MockWhen } from "./MockWhen";

export default Testeranto<I, O, {}>(
  {
    MockGiven,
    MockWhen,
    MockThen,
  },
  specification,
  implementation,
  testInterface
);
