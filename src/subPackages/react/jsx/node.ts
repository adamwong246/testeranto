import Testeranto from "../../../Node.js";
import {
  IPartialInterface,
  ITestImplementation,
  ITestSpecification,
  OT,
} from "../../../Types";

import { testInterface as baseInterface, I } from "./index.js";

export default <O extends OT, M = {}>(
  testImplementations: ITestImplementation<I, O, M>,
  testSpecifications: ITestSpecification<I, O>,
  testInput: I["iinput"],
  testInterface: IPartialInterface<I> = baseInterface
) => {
  return Testeranto<I, O, M>(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  );
};
