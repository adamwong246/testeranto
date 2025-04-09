import test from "../node";

import { O } from "../../../../examples/react/component/test";
import { IProps, IState } from "../../../../examples/react/component";
import component from "../../../../examples/react/component/index";
import { specification } from "../../../../examples/react/component/test";

import { testImplementation } from "./implementation";

export default test<O, IProps, IState>(
  testImplementation,
  specification,
  component
);
