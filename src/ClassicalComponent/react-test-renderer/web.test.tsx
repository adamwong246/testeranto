import test from "testeranto/src/SubPackages/react-test-renderer/component/web";

import {
  ClassicalComponentSpec,
  IClassicalComponentSpec,
} from "../test";

import { ClassicalComponent, IProps, IState } from "..";

import { testImplementation } from "./test";

export default test(
  testImplementation,
  ClassicalComponentSpec,
  ClassicalComponent,
);
