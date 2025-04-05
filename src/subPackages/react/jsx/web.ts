import {
  Ibdd_in,
  Ibdd_out,
  IPartialInterface,
  IPartialWebInterface,
} from "../../../Types";
import Testeranto from "../../../Web.js";

import {
  ITestImpl,
  ITestSpec,
  IInput,
  testInterface as baseInterface,
} from "./index.js";

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
  testInput: IInput,
  testInterface: IPartialWebInterface<I>
) => {
  return Testeranto<I, O>(testInput, testSpecifications, testImplementations, {
    ...baseInterface,
    ...testInterface,
  });
};
