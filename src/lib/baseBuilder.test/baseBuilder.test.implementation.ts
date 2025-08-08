/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITestImplementation } from "../../CoreTypes";
import { MockBaseBuilder } from "./baseBuilder.test.mock";

import { I, O } from "./baseBuilder.test.types";
import { ITestJob, ITTestResourceRequest } from "..";
import { BaseBuilder } from "../basebuilder";

// Define our test subject type
type TestSubject = MockBaseBuilder<any, any, any, any, any, any>;

export const implementation: ITestImplementation<I, O, {}> = {
  suites: {
    Default: "BaseBuilder test suite",
  },

  givens: {
    "the default BaseBuilder": () => {
      return new MockBaseBuilder(
        {}, // input
        {}, // suitesOverrides
        {}, // givenOverrides
        {}, // whenOverrides
        {}, // thenOverrides
        { ports: 0 }, // testResourceRequirement
        () => [] // testSpecification
      );
    },
    "a BaseBuilder with TestInput": (input: any) => {
      return new MockBaseBuilder(
        input,
        {},
        {},
        {},
        {},
        { ports: [] },
        () => []
      );
    },
    "a BaseBuilder with Test Resource Requirements": (
      requirements: ITTestResourceRequest
    ) => {
      return new MockBaseBuilder({}, {}, {}, {}, {}, requirements, () => []);
    },
  },

  whens: {
    addArtifact: (artifact: Promise<any>) => (builder: TestSubject) => {
      builder.artifacts.push(artifact);
      return builder;
    },
    setTestJobs: (jobs: ITestJob[]) => (builder: TestSubject) => {
      builder.testJobs = jobs;
      return builder;
    },
  },

  thens: {
    "it is initialized": () => (builder, utils) => {
      utils.writeFileSync("hello.txt", "world");

      if (!(builder instanceof BaseBuilder)) {
        console.error("Builder instance:", builder);
        throw new Error(
          `Builder was not properly initialized - expected BaseBuilder instance but got ${builder?.constructor?.name}`
        );
      }

      // Verify required properties exist
      [
        "artifacts",
        "testJobs",
        "specs",
        "suitesOverrides",
        "givenOverides",
        "whenOverides",
        "thenOverides",
      ].forEach((prop) => {
        if (!(prop in builder)) {
          throw new Error(`Builder missing required property: ${prop}`);
        }
      });

      return builder;
    },
    "it generates TestSpecifications": () => (builder: TestSubject) => {
      if (!Array.isArray(builder.specs)) {
        throw new Error("Specs were not generated");
      }
      return builder;
    },
    "it creates jobs": () => (builder: TestSubject) => {
      if (!Array.isArray(builder.testJobs)) {
        throw new Error("Test jobs were not created");
      }
      return builder;
    },
    "it tracks artifacts": () => (builder: TestSubject, utils) => {
      if (!Array.isArray(builder.artifacts)) {
        throw new Error("Artifacts array not initialized");
      }
      // Verify we can write artifacts
      utils.writeFileSync("artifact_test.txt", "test");
      return builder;
    },
    resourceRequirementsSet: () => (builder: TestSubject) => {
      if (!builder.testResourceRequirement) {
        throw new Error("Resource requirements not set");
      }
      return builder;
    },
    suitesOverridesConfigured: () => (builder: TestSubject) => {
      if (!builder.suitesOverrides) {
        throw new Error("Suites overrides not configured");
      }
      return builder;
    },
    givensOverridesConfigured: () => (builder: TestSubject) => {
      if (!builder.givenOverides) {
        throw new Error("Givens overrides not configured");
      }
      return builder;
    },
    whensOverridesConfigured: () => (builder: TestSubject) => {
      if (!builder.whenOverides) {
        throw new Error("Whens overrides not configured");
      }
      return builder;
    },
    thensOverridesConfigured: () => (builder: TestSubject) => {
      if (!builder.thenOverides) {
        throw new Error("Thens overrides not configured");
      }
      return builder;
    },
  },
};
