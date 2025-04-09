import Testeranto from "../../../Web.js";
import {
  IPartialWebInterface,
  ITestImplementation,
  ITestSpecification,
  OT,
} from "../../../Types";

import { I, IInput } from "./dynamic.js";

export default <O extends OT, M>(
  testInput: IInput,
  testSpecifications: ITestSpecification<I, O>,
  testImplementations: ITestImplementation<I, O, M>,
  testInterface: IPartialWebInterface<I>
) => {
  const t = Testeranto<I, O, M>(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  );

  document.addEventListener("DOMContentLoaded", function () {
    const elem = document.getElementById("root");
    if (elem) {
      return t;
    }
  });

  return t;
};
