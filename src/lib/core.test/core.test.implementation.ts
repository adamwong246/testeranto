import { ITestImplementation } from "../../CoreTypes";
import { MockCore } from "./MockCore";
import { I, O, M } from "./core.test.types";
import { ITTestResourceRequest } from "..";
import { ITestAdapter } from "../../CoreTypes";

export const implementation: ITestImplementation<I, O, M> = {
  suites: {
    Default: "Testeranto test suite",
    ExtendedSuite: "Extended Testeranto test suite",
  },

  givens: {
    Default: () => {
      console.log('[DEBUG] Creating Default MockCore instance');
      const input = { debug: true };
      const resourceReq = { ports: [3000] };
      
      console.log('[DEBUG] Default Given - input:', input);
      console.log('[DEBUG] Default Given - resourceReq:', resourceReq);
      
      try {
        const instance = new MockCore(
          input,
          specification,
          implementation,
          resourceReq,
          testAdapter,
          (cb) => cb()
        );
        console.log('[DEBUG] MockCore instance created successfully:', instance);
        return instance;
      } catch (e) {
        console.error('[ERROR] Failed to create MockCore:', e);
        throw e;
      }
    },
    WithCustomInput: (input: any) => {
      return new MockCore(
        input,
        specification,
        implementation,
        { ports: [] },
        testAdapter,
        (cb) => cb()
      );
    },
    WithResourceRequirements: (requirements: ITTestResourceRequest) => {
      return new MockCore(
        {},
        specification,
        implementation,
        requirements,
        testAdapter,
        (cb) => cb()
      );
    },
    WithCustomAdapter: (customAdapter: Partial<ITestAdapter<any>>) => {
      return new MockCore(
        {},
        specification,
        implementation,
        { ports: [] },
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
      console.log('Modifying specs - current count:', builder.specs?.length);
      const newSpecs = modifier(builder.specs || []);
      console.log('Modifying specs - new count:', newSpecs.length);
      builder.specs = newSpecs;
      return builder;
    },
    triggerError: (message: string) => (builder) => {
      throw new Error(message);
    },
  },

  thens: {
    initializedProperly: () => (builder) => {
      if (!builder) {
        throw new Error("Builder is undefined");
      }
      if (!(builder instanceof MockCore)) {
        throw new Error(`Builder is not MockCore (got ${builder.constructor.name})`);
      }
      if (!builder.testResourceRequirement) {
        throw new Error("testResourceRequirement not set");
      }
      if (!builder.testAdapter) {
        throw new Error("testAdapter not set");
      }
      return builder;
    },
    specsGenerated: () => (builder) => {
      if (!Array.isArray(builder.specs)) {
        throw new Error("Specs were not generated");
      }
      return builder;
    },
    jobsCreated: () => (builder) => {
      if (!Array.isArray(builder.testJobs)) {
        throw new Error("Test jobs were not created");
      }
      return builder;
    },
    artifactsTracked: () => (builder) => {
      if (!Array.isArray(builder.artifacts)) {
        throw new Error("Artifacts array not initialized");
      }
      return builder;
    },
    resourceRequirementsSet: () => (builder) => {
      if (!builder.testResourceRequirement) {
        throw new Error("Resource requirements not set");
      }
      return builder;
    },
    interfaceConfigured: () => (builder) => {
      if (!builder.testAdapter) {
        throw new Error("Test adapter not configured");
      }
      return builder;
    },
    errorThrown: (expectedMessage: string) => (builder) => {
      // Handled by test runner
      return builder;
    },
    testRunSuccessful: () => async (builder) => {
      try {
        await builder.receiveTestResourceConfig("");
        return builder;
      } catch (e) {
        throw new Error(`Test run failed: ${e.message}`);
      }
    },
    specsModified: (expectedCount: number) => (builder) => {
      if (!builder.specs || builder.specs.length !== expectedCount) {
        throw new Error(
          `Expected ${expectedCount} specs, got ${builder.specs?.length}`
        );
      }
      return builder;
    },
  },
};
