import { IInput, testInterface } from ".";
import test from "../../../Node";
import { IBaseTest } from "../../../Types";
import { ITestImpl, ITestSpec } from "../../react/jsx";

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
