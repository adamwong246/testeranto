import { IInput, testInterface } from ".";
import { IBaseTest } from "../../../Types";
import test from "../../../Web";
import { ITestImpl, ITestSpec } from "../jsx-promised";

export default <ITestShape extends IBaseTest>(
  testImplementations: ITestImpl<ITestShape>,
  testSpecifications: ITestSpec<ITestShape>,
  testInput: IInput,
  testInterface2 = testInterface,
) => {
  return test<
    ITestShape
  >(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface2,
  )
};
