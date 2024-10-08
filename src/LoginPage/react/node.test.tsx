import test from "testeranto/src/SubPackages/react/jsx/node";

import LoginPage from "../index";
import {
  ILoginPageSpecs,
  LoginPageSpecs
} from "../test";
import implementations, { LoginPageReactTestInterface } from "./test";

export default test<
  ILoginPageSpecs
>(
  implementations,
  LoginPageSpecs,
  LoginPage,
  LoginPageReactTestInterface
);
