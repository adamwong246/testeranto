import Testeranto from "../../../Pure.js";
import { ITestImplementation, ITestSpecification, OT } from "../../../Types";

import { I, testInterfacer } from "./static.js";

export default <O extends OT, M>(
  testImplementations: ITestImplementation<I, O, M>,
  testSpecifications: ITestSpecification<I, O>,
  testInput: I["iinput"]
) => {
  return Testeranto<I, O, M>(
    testInput,
    testSpecifications,
    testImplementations,
    testInterfacer(testInput)
  );
};
