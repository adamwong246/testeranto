import test from "testeranto/src/SubPackages/react-test-renderer/component/node";

import { ClassicalComponent, IProps, IState } from "..";

import {
  ClassicalComponentSpec,
  IClassicalComponentSpec,
} from "../test";
import { testImplementation } from "./test";

export default test(
  testImplementation,
  ClassicalComponentSpec,
  ClassicalComponent,
);
