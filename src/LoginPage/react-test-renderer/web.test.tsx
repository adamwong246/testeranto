
import test from "testeranto/src/SubPackages/react-test-renderer/jsx/web";

import {
  ILoginPageSpecs,
  LoginPageSpecs,
} from "../test";
import LoginPage from "..";

import { loginPageImpl, LoginPageReactTestRendererTestInterface } from "./test";

export default test<
  ILoginPageSpecs
>(
  loginPageImpl,
  LoginPageSpecs,
  LoginPage,
  LoginPageReactTestRendererTestInterface
);
