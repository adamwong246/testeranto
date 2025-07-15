import Testeranto from "../../Node";
import { implementation } from "./implementation";
import { specification } from "./specification";
import { testInterface } from "./interface";
import { I, O } from "./types";

import { butThenProxy, IProxy } from "../pmProxy";

export type ITestProxies = { butThenProxy: IProxy };

export default Testeranto<I, O, {}>(
  // because of the nature of testeranto, we must add all the testable items here
  {
    butThenProxy,
  },
  specification,
  implementation,
  testInterface
);
