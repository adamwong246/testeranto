/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Ibdd_in_any,
  Ibdd_out_any,
  ITestImplementation,
  ITestSpecification,
} from "../../CoreTypes";

import { ClassBuilder } from "../classBuilder";

import {
  ISuiteKlasser,
  IGivenKlasser,
  IWhenKlasser,
  IThenKlasser,
} from "../types";

import { ITTestResourceRequest } from "..";

/**
 * Concrete testable implementation of ClassBuilder for testing
 */
export default class TestClassBuilderMock<
  I extends Ibdd_in_any,
  O extends Ibdd_out_any,
  M = unknown
> extends ClassBuilder<I, O, M> {
  public testJobs: any[] = [];
  public specs: any[] = [];
  public artifacts: any[] = [];
  public summary: Record<string, any> = {};

  constructor(
    testImplementation: ITestImplementation<I, O, M>,
    testSpecification: ITestSpecification<I, O>,
    input: I["iinput"],
    suiteKlasser: ISuiteKlasser<I, O>,
    givenKlasser: IGivenKlasser<I>,
    whenKlasser: IWhenKlasser<I>,
    thenKlasser: IThenKlasser<I>,
    testResourceRequirement: ITTestResourceRequest
  ) {
    super(
      testImplementation,
      testSpecification,
      input,
      suiteKlasser,
      givenKlasser,
      whenKlasser,
      thenKlasser,
      testResourceRequirement
    );
  }

  // async runTests(puppetMaster: any): Promise<any> {
  //   this.summary = {
  //     [puppetMaster.testResourceConfiguration.name]: {
  //       typeErrors: 0,
  //       staticErrors: 0,
  //       runTimeError: "",
  //       prompt: "",
  //       failingFeatures: {},
  //     },
  //   };

  //   return {
  //     failed: false,
  //     fails: 0,
  //     artifacts: this.artifacts,
  //     logPromise: Promise.resolve(),
  //     features: [],
  //   };
  // }

  // protected async executeTestJob(job: any): Promise<any> {
  //   return job();
  // }

  // protected createArtifact(name: string, content: any): void {
  //   this.artifacts.push({ name, content });
  // }
}
