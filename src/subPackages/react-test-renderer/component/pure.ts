import Testeranto from "../../../Pure.js";

import { ITestImplementation, ITestSpecification, OT } from "../../../Types.js";

import { IInput, I } from "./index.js";
import { testInterface } from "./interface";

export default <O extends OT, M = {}>(
  testImplementations: ITestImplementation<I, O, M>,
  testSpecifications: ITestSpecification<I, O>,
  testInput: IInput<any, any>
) =>
  Testeranto<I, O, M>(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  );
