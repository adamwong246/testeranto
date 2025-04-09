import Testeranto from "../../../Node.js";

import { ITestImplementation, ITestSpecification, OT } from "../../../Types.js";

import { IInput, I } from "./index.js";
import { testInterface } from "./interface.js";

export default <O extends OT, IProps, IState, M = {}>(
  testImplementations: ITestImplementation<I, O, M>,
  testSpecifications: ITestSpecification<I, O>,
  testInput: IInput<IProps, IState>
) =>
  Testeranto<I, O, M>(
    testInput,
    testSpecifications,
    testImplementations,
    testInterface
  );
