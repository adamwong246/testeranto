
import test from "testeranto/src/SubPackages/react-test-renderer/jsx/web.js";

import { LoginPageSpecs } from "../test.js";
import LoginPage from "../index.js";

import { loginPageImpl, LoginPageReactTestRendererTestInterface } from "./test.js";

export default test(
  loginPageImpl,
  LoginPageSpecs,
  LoginPage,
  LoginPageReactTestRendererTestInterface,
);
