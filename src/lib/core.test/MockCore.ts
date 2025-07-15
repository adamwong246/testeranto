import TesterantoCore from "../core";

import {
  Ibdd_in_any,
  Ibdd_out_any,
  ITestImplementation,
  ITestSpecification,
  ITestInterface,
} from "../../CoreTypes";
import { ITTestResourceRequest, IFinalResults } from "..";

/**
 * Concrete implementation of Testeranto for testing purposes
 */
export class MockCore<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any,
  M = unknown
> extends TesterantoCore<I, O, M> {
  constructor(
    input: I["iinput"],
    testSpecification: ITestSpecification<I, O>,
    testImplementation: ITestImplementation<I, O, M>,
    testResourceRequirement: ITTestResourceRequest = { ports: [] },
    testInterface: Partial<ITestInterface<I>> = {},
    uberCatcher: (cb: () => void) => void = (cb) => cb()
  ) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testInterface,
      uberCatcher
    );
  }

  async receiveTestResourceConfig(
    partialTestResource: string
  ): Promise<IFinalResults> {
    return {
      failed: false,
      fails: 0,
      artifacts: [],
      logPromise: Promise.resolve(),
      features: [],
    };
  }
}
