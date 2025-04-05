import { Ibdd_in, Ibdd_out } from "../../../Types";
import test from "../../../Web";

import { ITestImpl, ITestSpec } from "../../react/jsx";

import { testInterface, IInput } from "./index";

export default <
  I extends Ibdd_in<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  >,
  O extends Ibdd_out<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
  >
>(
  testImplementations: ITestImpl<I, O>,
  testSpecifications: ITestSpec<I, O>,
  testInput: IInput
) => {
  return test<I, O>(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  );
};
