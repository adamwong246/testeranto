/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Tiposkripto from "../Tiposkripto";

import {
  Ibdd_in_any,
  Ibdd_out_any,
  ITestImplementation,
  ITestSpecification,
  ITestAdapter,
} from "../../CoreTypes";
import { ITTestResourceRequest, IFinalResults } from "..";

/**
 * Concrete implementation of Tiposkripto for testing purposes
 */
export class MockTiposkripto<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any,
  M = unknown
> extends Tiposkripto<I, O, M> {
  public specs: any[] = [];
  public testJobs: any[] = [];
  public artifacts: any[] = [];
  public testResourceRequirement: ITTestResourceRequest;
  public testAdapter: Partial<ITestAdapter<I>>;

  constructor(
    input: I["iinput"],
    testSpecification: ITestSpecification<I, O>,
    testImplementation: ITestImplementation<I, O, M>,
    testResourceRequirement: ITTestResourceRequest = { ports: [] },
    testAdapter: Partial<ITestAdapter<I>>,
    uberCatcher: (cb: () => void) => void = (cb) => cb()
  ) {
    // Validate required implementation methods
    const requiredMethods = ["suites", "givens", "whens", "thens"];
    requiredMethods.forEach((method) => {
      if (!testImplementation[method]) {
        throw new Error(`Missing required implementation method: ${method}`);
      }
    });

    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
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
      features: [],
    };
  }
}
