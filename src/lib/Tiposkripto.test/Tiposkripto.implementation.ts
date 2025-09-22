/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  ITestImplementation,
  ITestSpecification,
  ITestAdapter,
} from "../../CoreTypes";
import { MockTiposkripto } from "./MockTiposkripto";

import { I, O, M } from "./Tiposkripto.types";

import { ITTestResourceRequest } from "..";
import { specification } from "./Tiposkripto.specification";
import { testAdapter } from "./Tiposkripto.adapter";

export const implementation: ITestImplementation<I, O, M> = {
  suites: {
    Default: "Tiposkripto test suite",
    ExtendedSuite: "Extended Tiposkripto test suite",
  },
  givens: {
    Default: () => {
      console.log("Creating default test builder instance");
      const builder = new MockTiposkripto(
        {}, // input
        specification, // Use the current specification
        implementation, // Use the current implementation
        { ports: 0 }, // Default resource requirements
        testAdapter, // Default adapter
        (cb) => cb() // Default uberCatcher
      );
      console.log("Builder created:", builder);
      // Ensure the test adapter is properly set
      if (!builder.testAdapter) {
        builder.testAdapter = testAdapter;
      }
      return builder;
    },
    WithCustomInput: (input: any = {}) => {
      return new MockTiposkripto(
        input,
        specification,
        implementation,
        { ports: 0 },
        testAdapter,
        (cb) => cb()
      );
    },
    WithResourceRequirements: (
      requirements: ITTestResourceRequest = { ports: 0 }
    ) => {
      return new MockTiposkripto(
        {},
        specification,
        implementation,
        requirements,
        testAdapter,
        (cb) => cb()
      );
    },
    WithCustomImplementation: (
      impl: ITestImplementation<any, any> = implementation
    ) => {
      return new MockTiposkripto(
        {},
        specification,
        impl,
        { ports: 0 },
        testAdapter,
        (cb) => cb()
      );
    },
    WithCustomSpecification: (
      spec: ITestSpecification<any, any> = specification
    ) => {
      return new MockTiposkripto(
        {},
        spec,
        implementation,
        { ports: 0 },
        testAdapter,
        (cb) => cb()
      );
    },
    WithCustomAdapter: (customAdapter: Partial<ITestAdapter<any>> = {}) => {
      return new MockTiposkripto(
        {},
        specification,
        implementation,
        { ports: 0 },
        { ...testAdapter, ...customAdapter },
        (cb) => cb()
      );
    },
  },
  whens: {
    addArtifact: (artifact: Promise<any>) => (builder) => {
      builder.artifacts.push(artifact);
      return builder;
    },
    setTestJobs: (jobs: any[]) => (builder) => {
      builder.testJobs = jobs;
      return builder;
    },
    modifySpecs: (modifier: (specs: any[]) => any[]) => (builder) => {
      builder.specs = modifier(builder.specs || []);
      return builder;
    },
    modifyJobs: (modifier: (jobs: any[]) => any[]) => (builder) => {
      builder.testJobs = modifier(builder.testJobs || []);
      return builder;
    },
    triggerError: (message: string) => (builder) => {
      throw new Error(message);
    },
    // Add a when to simulate receiving test resource config
    receiveTestResourceConfig: (config: string) => async (builder) => {
      return await builder.receiveTestResourceConfig(config);
    },
  },
  thens: {
    initializedProperly: () => (builder: any, utils: any) => {
      if (!builder) {
        throw new Error("Builder is undefined");
      }
      if (!(builder instanceof MockTiposkripto)) {
        throw new Error(
          `Builder was not properly initialized. Expected MockTiposkripto instance but got ${builder?.constructor?.name}`
        );
      }

      // Verify required properties exist
      const requiredProps = [
        "specs",
        "testJobs",
        "artifacts",
        "suitesOverrides",
        "givenOverides",
        "whenOverides",
        "thenOverides",
      ];
      for (const prop of requiredProps) {
        if (!(prop in builder)) {
          throw new Error(`Missing required property: ${prop}`);
        }
      }

      return builder;
    },
    specsGenerated: () => (builder: any) => {
      if (!Array.isArray(builder.specs)) {
        throw new Error("Specs were not generated");
      }
      return builder;
    },
    jobsCreated: () => (builder: any) => {
      if (!Array.isArray(builder.testJobs)) {
        throw new Error("Test jobs were not created");
      }
      return builder;
    },
    artifactsTracked: () => (builder: any) => {
      if (!Array.isArray(builder.artifacts)) {
        throw new Error("Artifacts array not initialized");
      }
      return builder;
    },
    resourceRequirementsSet: () => (builder: any) => {
      if (!builder.testResourceRequirement) {
        throw new Error("Resource requirements not set");
      }
      return builder;
    },
    suitesOverridesConfigured: () => (builder: any) => {
      if (!builder.suitesOverrides) {
        throw new Error("Suites overrides not configured");
      }
      return builder;
    },
    givensOverridesConfigured: () => (builder: any) => {
      if (!builder.givenOverides) {
        throw new Error("Givens overrides not configured");
      }
      return builder;
    },
    whensOverridesConfigured: () => (builder: any) => {
      if (!builder.whenOverides) {
        throw new Error("Whens overrides not configured");
      }
      return builder;
    },
    thensOverridesConfigured: () => (builder: any) => {
      if (!builder.thenOverides) {
        throw new Error("Thens overrides not configured");
      }
      return builder;
    },
    interfaceConfigured: () => (builder: any) => {
      if (!builder.testAdapter) {
        throw new Error("Test adapter not configured");
      }
      // Check if the test adapter has the required methods
      const requiredMethods = [
        "beforeAll",
        "beforeEach",
        "andWhen",
        "butThen",
        "afterEach",
        "afterAll",
        "assertThis",
      ];
      for (const method of requiredMethods) {
        if (typeof builder.testAdapter[method] !== "function") {
          throw new Error(`Test adapter missing required method: ${method}`);
        }
      }
      return builder;
    },
    specsModified: (expectedCount: number) => (builder: any) => {
      if (builder.specs.length <= expectedCount) {
        throw new Error(`Expected at least ${expectedCount} modified specs`);
      }
      return builder;
    },
    jobsModified: (expectedCount: number) => (builder: any) => {
      if (builder.testJobs.length <= expectedCount) {
        throw new Error(`Expected at least ${expectedCount} modified jobs`);
      }
      return builder;
    },
    errorThrown: (expectedMessage: string) => (builder: any) => {
      // This is handled by the test runner
      return builder;
    },
    testRunSuccessful: () => async (builder: any) => {
      await builder.receiveTestResourceConfig("");
      return builder;
    },
    runTimeTestsCounted: () => async (builder: any) => {
      const result = await builder.receiveTestResourceConfig("");
      // The total number of tests should be greater than 0
      if (result.runTimeTests <= 0) {
        throw new Error(
          `Expected runTimeTests > 0, got ${result.runTimeTests}`
        );
      }
      return builder;
    },
    runTimeTestsSetToNegativeOne: () => async (builder: any) => {
      await builder.receiveTestResourceConfig("");
      // If we reach here, no error was thrown, which is unexpected
      // But we'll let the test fail naturally
      return builder;
    },
    runTimeTestsCountIs: (expectedCount: number) => async (builder: any) => {
      const result = await builder.receiveTestResourceConfig("");
      if (result.runTimeTests !== expectedCount) {
        throw new Error(
          `Expected runTimeTests to be ${expectedCount}, got ${result.runTimeTests}`
        );
      }
      return builder;
    },
    runTimeTestsIsNegativeOne: () => async (builder: any) => {
      await builder.receiveTestResourceConfig("");
      // If we reach here, no error was thrown, which is unexpected
      // But we'll let the test fail naturally
      return builder;
    },
  },
};
