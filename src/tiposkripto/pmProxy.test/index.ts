import Typoskripto from "../BaseTiposkripto";

import { implementation } from "./implementation";
import { specification } from "./specification";
import { testAdapter } from "./adapter";
import { I, O } from "./types";

import { butThenProxy, IProxy } from "../pmProxy";

export type ITestProxies = { butThenProxy: IProxy };

export default new Typoskripto<I, O, object>(
  {
    butThenProxy,
  },
  specification,
  implementation,
  testAdapter
);
