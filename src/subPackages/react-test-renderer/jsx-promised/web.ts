import { IBaseTest } from "../../../Types";
import test from "../../../Web";
import { ITestImpl, ITestSpec } from "../../react/jsx";

import {
  testInterface, IInput
} from "./index";

export default <ITestShape extends IBaseTest>(
  testImplementations: ITestImpl<ITestShape>,
  testSpecifications: ITestSpec<ITestShape>,
  testInput: IInput
) => {
  return test<
    ITestShape
  >(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface,
  )
};
