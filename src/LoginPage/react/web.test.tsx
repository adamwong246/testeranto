import test from "testeranto/src/SubPackages/react/jsx/web";

import LoginPage from "../index";
import {
  ILoginPageSpecs,
  LoginPageSpecs
} from "../test";
import implementations, { LoginPageReactTestInterface } from "./test";

export default test(
  implementations,
  LoginPageSpecs,
  LoginPage,
  LoginPageReactTestInterface
);
