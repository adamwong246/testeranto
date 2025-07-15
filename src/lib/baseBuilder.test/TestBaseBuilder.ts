import { BaseBuilder } from "../basebuilder";
import { Ibdd_in_any, Ibdd_out_any, ITestSpecification } from "../../CoreTypes";
import {
  ISuiteKlasser,
  IGivenKlasser,
  IWhenKlasser,
  IThenKlasser,
  ICheckKlasser,
} from "../types";
import { ITTestResourceRequest } from "..";

/**
 * Concrete implementation of BaseBuilder for testing purposes only
 */
export class TestBaseBuilder<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any,
  SuiteExtensions = {},
  GivenExtensions = {},
  WhenExtensions = {},
  ThenExtensions = {},
  CheckExtensions = {}
> extends BaseBuilder<
  I,
  O,
  SuiteExtensions,
  GivenExtensions,
  WhenExtensions,
  ThenExtensions,
  CheckExtensions
> {
  public summary: Record<string, any> = {};

  constructor(
    input: I["iinput"],
    suitesOverrides: Record<
      keyof SuiteExtensions,
      ISuiteKlasser<I, O>
    > = {} as any,
    givenOverrides: Record<keyof GivenExtensions, IGivenKlasser<I>> = {} as any,
    whenOverrides: Record<keyof WhenExtensions, IWhenKlasser<I>> = {} as any,
    thenOverrides: Record<keyof ThenExtensions, IThenKlasser<I>> = {} as any,
    checkOverrides: Record<keyof CheckExtensions, ICheckKlasser<I>> = {} as any,
    testResourceRequirement: ITTestResourceRequest = { ports: [] },
    testSpecification: ITestSpecification<I, O> = () => []
  ) {
    super(
      input,
      suitesOverrides,
      givenOverrides,
      whenOverrides,
      thenOverrides,
      checkOverrides,
      testResourceRequirement,
      testSpecification
    );

    this.summary = {};
  }

  /**
   * Simplified version for testing that doesn't actually run tests
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
