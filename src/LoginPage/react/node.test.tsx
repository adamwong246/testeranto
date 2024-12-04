import test from "testeranto/src/SubPackages/react/jsx/node";

import LoginPage from "../index.js";
import { LoginPageSpecs } from "../test.js";
import implementations from "./test.js";

export default test(
  implementations,
  LoginPageSpecs,
  LoginPage,
  {
    // beforeEach: async (proto, init, artificer, tr, x, pm) => {
    //   // pm.writeFileSync("beforeEachLog", "bar");
    //   return proto;
    // },
    // afterAll: (store, artificer, utils) => {
    //   // utils.writeFileSync("afterAllLog", "bar");
    //   return store;
    // }
  }
);
