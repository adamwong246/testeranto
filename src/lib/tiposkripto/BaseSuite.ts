import { ITestResourceConfiguration, ITestArtifactory } from ".";
import { Ibdd_in_any, Ibdd_out_any } from "../CoreTypes";
import { IGivens } from "./BaseGiven";

/**
 * Represents a collection of test suites keyed by their names.
 * Suites are organized as named collections because:
 * - Tests are typically grouped into logical suites (e.g., by feature, component)
 * - Suites may have different configurations or setup requirements
 * - Named suites allow for selective test execution and better reporting
 * - This supports the hierarchical structure of test organization
 */
export type ISuites<I extends Ibdd_in_any, O extends Ibdd_out_any> = Record<
  string,
  BaseSuite<I, O>
>;

export abstract class BaseSuite<I extends Ibdd_in_any, O extends Ibdd_out_any> {
  name: string;
  givens: IGivens<I>;
  store: I["istore"];
  testResourceConfiguration: ITestResourceConfiguration;
  index: number;
  failed: boolean;
  fails: number;

  artifacts: string[] = [];

  addArtifact(path: string) {
    if (typeof path !== "string") {
      throw new Error(
        `[ARTIFACT ERROR] Expected string, got ${typeof path}: ${JSON.stringify(
          path
        )}`
      );
    }
    const normalizedPath = path.replace(/\\/g, "/"); // Normalize path separators
    this.artifacts.push(normalizedPath);
  }

  constructor(name: string, index: number, givens: IGivens<I> = {}) {
    const suiteName = name || "testSuite"; // Ensure name is never undefined
    if (!suiteName) {
      throw new Error("BaseSuite requires a non-empty name");
    }

    this.name = suiteName;
    this.index = index;
    this.givens = givens;
    this.fails = 0;
  }

  public features() {
    try {
      const features = Object.keys(this.givens)
        .map((k) => this.givens[k].features)
        .flat()
        .filter((value, index, array) => {
          return array.indexOf(value) === index;
        });
      // Convert all features to strings
      const stringFeatures = features.map((feature) => {
        if (typeof feature === "string") {
          return feature;
        } else if (feature && typeof feature === "object") {
          return feature.name || JSON.stringify(feature);
        } else {
          return String(feature);
        }
      });
      return stringFeatures || [];
    } catch (e) {
      console.error("[ERROR] Failed to extract features:", JSON.stringify(e));
      return [];
    }
  }

  public toObj() {
    const givens = Object.keys(this.givens).map((k) => {
      const givenObj = this.givens[k].toObj();
      // Ensure given features are strings
      // if (givenObj.features) {
      //   givenObj.features = givenObj.features.map(feature => {

      //     return feature;
      //     // if (typeof feature === 'string') {
      //     //   return feature;
      //     // } else if (feature && typeof feature === 'object') {
      //     //   return feature.name || JSON.stringify(feature);
      //     // } else {
      //     //   return String(feature);
      //     // }
      //   });
      // }
      return givenObj;
    });

    return {
      name: this.name,
      givens,
      fails: this.fails,
      failed: this.failed,
      features: this.features(),
      artifacts: this.artifacts
        ? this.artifacts.filter((art) => typeof art === "string")
        : [],
    };
  }

  setup(
    s: I["iinput"],
    artifactory: ITestArtifactory,
    tr: ITestResourceConfiguration
    // pm: IPM
  ): Promise<I["isubject"]> {
    console.log("mark9");

    return new Promise((res) => res(s as unknown as I["isubject"]));
  }

  assertThat(t: Awaited<I["then"]> | undefined): boolean {
    return !!t;
  }

  afterAll(store: I["istore"], artifactory: ITestArtifactory) {
    return store;
  }

  async run(
    input: I["iinput"],
    testResourceConfiguration: ITestResourceConfiguration
  ): Promise<BaseSuite<I, O>> {
    this.testResourceConfiguration = testResourceConfiguration;
    const sNdx = this.index;

    const subject = await this.setup(
      input,
      // suiteArtifactory,
      testResourceConfiguration
      // proxiedPm
    );

    for (const [gKey, g] of Object.entries(this.givens)) {
      const giver = this.givens[gKey];
      try {
        this.store = await giver.give(
          subject,
          gKey,
          testResourceConfiguration,
          this.assertThat,
          sNdx
        );
        // Add the number of failures from this given to the suite's total
        this.fails += giver.fails || 0;
      } catch (e) {
        this.failed = true;
        // Add 1 to fails for the caught error
        this.fails += 1;
        // Also add any failures from the given itself
        if (giver.fails) {
          this.fails += giver.fails;
        }
        console.error(`Error in given ${gKey}:`, e);
        // Don't re-throw to continue with other givens
      }
    }

    // Mark the suite as failed if there are any failures
    if (this.fails > 0) {
      this.failed = true;
    }

    try {
      // Ensure addArtifact is properly bound to 'this'

      this.afterAll(this.store);
    } catch (e) {
      console.error(JSON.stringify(e));
      // this.fails.push(this);
      // return this;
    }

    return this;
  }
}
