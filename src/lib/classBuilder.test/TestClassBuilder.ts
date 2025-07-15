import { BaseBuilder } from "../basebuilder";
import {
  Ibdd_in_any,
  Ibdd_out_any,
  ITestImplementation,
  ITestSpecification,
} from "../../CoreTypes";
import {
  ISuiteKlasser,
  IGivenKlasser,
  IWhenKlasser,
  IThenKlasser,
  ICheckKlasser,
} from "../types";
import { ITTestResourceRequest } from "..";

/**
 * Concrete implementation of BaseBuilder for testing ClassBuilder
 */
export class TestClassBuilder<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any,
  M = unknown
> extends BaseBuilder<
  I,
  O,
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>
> {
  public summary: Record<string, any> = {};

  constructor(
    testImplementation: ITestImplementation<I, O, M> & {
      suites: Record<string, any>;
      givens: Record<string, any>;
      whens: Record<string, any>;
      thens: Record<string, any>;
      checks: Record<string, any>;
    },
    testSpecification: ITestSpecification<I, O>,
    input: I["iinput"],
    suiteKlasser: ISuiteKlasser<I, O>,
    givenKlasser: IGivenKlasser<I>,
    whenKlasser: IWhenKlasser<I>,
    thenKlasser: IThenKlasser<I>,
    checkKlasser: ICheckKlasser<I>,
    testResourceRequirement: ITTestResourceRequest
  ) {
    super(
      input,
      {}, // suitesOverrides
      {}, // givenOverides
      {}, // whenOverides
      {}, // thenOverides
      {}, // checkOverides
      testResourceRequirement,
      testSpecification
    );

    this.summary = {};
  }

  /**
   * Simplified test run for verification
   */
  public testRun(puppetMaster: any): Promise<any> {
    this.summary = {
      [puppetMaster.testResourceConfiguration.name]: {
        typeErrors: 0,
        staticErrors: 0,
        runTimeError: "",
        prompt: "",
        failingFeatures: {},
      },
    };

    return Promise.resolve({
      failed: false,
      fails: 0,
      artifacts: [],
      logPromise: Promise.resolve(),
      features: [],
    });
  }
}
