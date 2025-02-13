
import test from "testeranto/src/SubPackages/react-test-renderer/jsx/node.js";

import { LoginPageSpecs } from "../test.js";
import LoginPage from "../index.js";

import { loginPageImpl, LoginPageReactTestRendererTestInterface } from "./test.js";
import { features } from "../../../features.test.mjs";

export default test(
  loginPageImpl,
  LoginPageSpecs,
  LoginPage,
  LoginPageReactTestRendererTestInterface,
);
