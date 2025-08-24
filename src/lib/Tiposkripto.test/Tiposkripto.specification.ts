import { ITestSpecification } from "../../CoreTypes";

import { I, O } from "./Tiposkripto.types";
import { implementation } from "./Tiposkripto.implementation";

export const specification: ITestSpecification<I, O> = (
  Suite,
  Given,
  When,
  Then
) => {
  return [
    Suite.Default("Tiposkripto Core Functionality", {
      // Basic initialization tests
      initialization: Given.Default(
        ["Tiposkripto should initialize with default values"],
        [],
        [Then.initializedProperly()]
      ),
      customInput: Given.WithCustomInput(
        { custom: "input" },
        [],
        [Then.initializedProperly()]
      ),
      resourceRequirements: Given.WithResourceRequirements(
        { ports: [3000, 3001] },
        [],
        [Then.resourceRequirementsSet()]
      ),

      // Core functionality tests
      specGeneration: Given.Default(
        ["Should generate specs from test specification"],
        [],
        [Then.specsGenerated()]
      ),
      jobCreation: Given.Default(
        ["Should create test jobs from specs"],
        [],
        [Then.jobsCreated()]
      ),
      artifactTracking: Given.Default(
        ["Should track artifacts"],
        [When.addArtifact(Promise.resolve("test"))],
        [Then.artifactsTracked()]
      ),

      // Configuration tests
      overridesConfiguration: Given.Default(
        ["Should properly configure all overrides"],
        [],
        [
          Then.suitesOverridesConfigured(),
          Then.givensOverridesConfigured(),
          Then.whensOverridesConfigured(),
          Then.thensOverridesConfigured(),
        ]
      ),
      interfaceConfiguration: Given.WithCustomAdapter(
        {
          assertThis: (x) => !!x,
          beforeEach: async (s, i) => i(),
        },
        [],
        [Then.interfaceConfigured()]
      ),
    }),

    Suite.ExtendedSuite("Tiposkripto Advanced Features", {
      // Custom implementations
      customImplementation: Given.WithCustomImplementation(
        implementation,
        [],
        [Then.specsGenerated(), Then.jobsCreated()]
      ),
      customSpecification: Given.WithCustomSpecification(
        specification,
        [],
        [Then.specsGenerated(), Then.jobsCreated()]
      ),

      // Dynamic modification tests
      specModification: Given.Default(
        ["Should allow modifying specs"],
        [When.modifySpecs((specs) => [...specs, "extra"])],
        [Then.specsModified(1)]
      ),
      jobModification: Given.Default(
        ["Should allow modifying jobs"],
        [When.modifyJobs((jobs) => [...jobs, {} as ITestJob])],
        [Then.jobsModified(1)]
      ),

      // Error handling
      errorHandling: Given.Default(
        ["Should properly handle errors"],
        [When.triggerError("test error")],
        [Then.errorThrown("test error")]
      ),

      // Full test run
      fullTestRun: Given.Default(
        ["Should complete a full test run successfully"],
        [],
        [Then.testRunSuccessful()]
      ),
    }),
  ];
};
