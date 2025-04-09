import Testeranto from "../../../Web.js";
import { ITestImplementation, ITestSpecification, OT } from "../../../Types";

import type { IInput } from "./index";
import { I, testInterfacer } from "./dynamic.js";

export default <O extends OT, M>(
  testImplementations: ITestImplementation<I, O, M>,
  testSpecifications: ITestSpecification<I, O>,
  testInput: IInput
) => {
  const t = Testeranto<I, O, M>(
    testInput,
    testSpecifications,
    testImplementations,
    testInterfacer(testInput)
  );

  document.addEventListener("DOMContentLoaded", function () {
    const rootElement = document.getElementById("root");
    if (rootElement) {
    }
  });

  return t;
};
