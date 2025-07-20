import { ITestSpecification } from "../../CoreTypes";
import { I, O } from "./core.test.types";

export const specification: ITestSpecification<I, O> = (
  Suite,
  Given,
  When,
  Then
) => {
  return [
    Suite.Default(
      "Testeranto Core Functionality",
      {
        // Initialization tests
        defaultInitialization: Given.Default(
          ["Should initialize with default values"],
          [],
          [Then.initializedProperly()]
        ),
        customInputInitialization: Given.WithCustomInput(
          { test: "input" },
          [],
          [Then.initializedProperly()]
        ),

        // Configuration tests
        resourceConfig: Given.WithResourceRequirements(
          { ports: [3000, 3001] },
          [],
          [Then.resourceRequirementsSet()]
        ),
        interfaceConfig: Given.WithCustomInterface(
          {
            assertThis: (x) => !!x,
            beforeEach: async (s, i) => i(),
          },
          [],
          [Then.interfaceConfigured()]
        ),

        // Core operations
        specGeneration: Given.Default(
          ["Should generate test specs"],
          [],
          [Then.specsGenerated()]
        ),
        jobCreation: Given.Default(
          ["Should create test jobs"],
          [],
          [Then.jobsCreated()]
        ),
        artifactHandling: Given.Default(
          ["Should track artifacts"],
          [When.addArtifact(Promise.resolve("test"))],
          [Then.artifactsTracked()]
        ),
      },
      []
    ),

    Suite.ExtendedSuite("Testeranto Advanced Features", {
      // Error handling
      errorPropagation: Given.Default(
        ["Should propagate errors properly"],
        [When.triggerError("test error")],
        [Then.errorThrown("test error")]
      ),

      // Dynamic behavior
      specModification: Given.Default(
        ["Should allow spec modification"],
        [When.modifySpecs((specs) => [...specs, { name: "extra" }])],
        [Then.specsModified(1)]
      ),

      // Full lifecycle
      testExecution: Given.Default(
        ["Should execute full test lifecycle"],
        [],
        [Then.testRunSuccessful()]
      ),

      // Custom implementations
      customImpl: Given.WithCustomImplementation(
        {
          ...implementation,
          suites: { Default: "Custom suite" },
        },
        [],
        [Then.specsGenerated()]
      ),
    }),
  ];
};
