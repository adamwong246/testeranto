import test from "testeranto/src/SubPackages/react-test-renderer/component/web";

import { ClassicalComponent, IProps, IState } from "..";

import { testImplementation } from "./test.js";
import { ClassicalComponentSpec } from "../testeranto.js";

export default test(
  testImplementation,
  ClassicalComponentSpec,
  ClassicalComponent,
);
