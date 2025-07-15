import { ITestImplementation } from "../../CoreTypes";
import { MockCore } from "./MockCore";
import { I, O, M } from "./core.test.types";
import { PassThrough } from "stream";
import { ITTestResourceRequest } from "..";
import { ITestInterface } from "../../CoreTypes";

export const implementation: ITestImplementation<I, O, M> = {
  suites: {
    Default: "Testeranto test suite",
    ExtendedSuite: "Extended Testeranto test suite",
  },

  givens: {
    Default: () => {
      return new MockCore(
        {}, // input
        specification, // testSpecification 
        implementation, // testImplementation
        { ports: [] }, // testResourceRequirement
        testInterface, // testInterface
        (cb) => cb() // uberCatcher
      );
    },
    WithCustomInput: (input: any) => {
      return new MockCore(
        input,
        specification,
        implementation,
        { ports: [] },
        testInterface,
        (cb) => cb()
      );
    },
    WithResourceRequirements: (requirements: ITTestResourceRequest) => {
      return new MockCore(
        {},
        specification,
        implementation,
        requirements,
        testInterface,
        (cb) => cb()
      );
    },
    WithCustomInterface: (customInterface: Partial<ITestInterface<any>>) => {
      return new MockCore(
        {},
        specification,
        implementation,
        { ports: [] },
        {...testInterface, ...customInterface},
        (cb) => cb()
      );
    }
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
    triggerError: (message: string) => (builder) => {
      throw new Error(message);
    },
  },

  thens: {
    initializedProperly: () => (builder) => {
      if (!(builder instanceof MockCore)) {
        throw new Error("Builder was not properly initialized");
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
      if (!builder.testInterface) {
        throw new Error("Test interface not configured");
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
  },

  checks: {
    Default: () => new PassThrough(),
  },
};
