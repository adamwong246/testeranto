
import test from "testeranto/src/SubPackages/react-test-renderer/jsx/web";

import {
  LoginPageSpecs,
} from "../test";
import LoginPage from "..";

import { loginPageImpl, LoginPageReactTestRendererTestInterface } from "./test";

export default test(
  loginPageImpl,
  LoginPageSpecs,
  LoginPage,
  LoginPageReactTestRendererTestInterface
);
