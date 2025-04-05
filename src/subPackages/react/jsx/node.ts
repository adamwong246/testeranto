import Testeranto from "../../../Node.js";
import { Ibdd_in, Ibdd_out, IPartialInterface } from "../../../Types";

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
  testInterface: IPartialInterface<I> = baseInterface
) => {
  return Testeranto<I, O>(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  );
};
