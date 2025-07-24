import TesterantoCore from "../core";

import {
  Ibdd_in_any,
  Ibdd_out_any,
  ITestImplementation,
  ITestSpecification,
  ITestAdapter,
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
    console.log('[DEBUG] MockCore constructor starting...');
    
    if (!testImplementation) {
      throw new Error('testImplementation is required');
    }
    if (!testSpecification) {
      console.warn('[WARN] testSpecification is null/undefined - tests may fail');
    }
    
    console.log('[DEBUG] MockCore constructor called with:');
    console.log('- input:', JSON.stringify(input, null, 2));
    console.log('- testSpecification keys:', Object.keys(testSpecification));
    console.log('- testImplementation keys:', Object.keys(testImplementation));
    console.log('- testResourceRequirement:', JSON.stringify(testResourceRequirement));
    console.log('- testAdapter keys:', Object.keys(testAdapter));
    
    // Validate required implementation methods
    const requiredMethods = ['suites', 'givens', 'whens', 'thens'];
    requiredMethods.forEach(method => {
      if (!testImplementation[method]) {
        throw new Error(`Missing required implementation method: ${method}`);
      }
    });

    console.log('[DEBUG] Validation passed, calling super...');
    
    this.testResourceRequirement = testResourceRequirement;
    this.testAdapter = testAdapter;
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
      logPromise: Promise.resolve(),
      features: [],
    };
  }
}
