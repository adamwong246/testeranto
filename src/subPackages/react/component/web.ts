import Testeranto from "../../../Web.js";
import { ITestImplementation, ITestSpecification, OT } from "../../../Types";

import { reactInterfacer, I } from "./index.js";

export default <O extends OT, M>(
  testImplementations: ITestImplementation<I, O, M>,
  testSpecifications: ITestSpecification<I, O>,
  testInput: I["iinput"]
) => {
  return Testeranto<I, O, M>(
    testInput,
    testSpecifications,
    testImplementations,
    reactInterfacer(testInput)
  );
};
