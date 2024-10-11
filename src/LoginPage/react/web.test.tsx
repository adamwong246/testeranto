import test from "testeranto/src/SubPackages/react/jsx/web";

import LoginPage from "../index";
import {
  LoginPageSpecs
} from "../test";
import implementations, { LoginPageReactTestInterface } from "./test";

export default test(
  implementations,
  LoginPageSpecs,
  LoginPage,
  LoginPageReactTestInterface
);
