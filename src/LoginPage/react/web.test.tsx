import test from "testeranto/src/SubPackages/react/jsx/web";

import LoginPage from "../index.js";
import {
  LoginPageSpecs
} from "../test.js";
import implementations, { LoginPageReactTestInterface } from "./test.js";

export default test(
  implementations,
  LoginPageSpecs,
  LoginPage,
  LoginPageReactTestInterface
);
