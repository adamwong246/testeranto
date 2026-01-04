import type { Ibdd_in_any } from "../CoreTypes";
import { ITestArtifactory, ITestResourceConfiguration } from ".";

/**
 * Represents a collection of Given conditions keyed by their names.
 * Givens are typically organized as named collections because:
 * - They set up different initial states for tests
 * - Tests often need to reference specific Given conditions by name
 * - This allows for better organization and reuse of setup logic
 * - The BDD pattern often involves multiple named Given scenarios
 */
export type IGivens<I extends Ibdd_in_any> = Record<string, BaseGiven<I>>;

export abstract class BaseGiven<I extends Ibdd_in_any> {
  features: string[];
  whens: any[];
  thens: any[];
  error: Error;
  fail: any;
  store: I["istore"];
  recommendedFsPath: string;
  givenCB: I["given"];
  initialValues: any;
  key: string;
  failed: boolean;
  artifacts: string[] = [];

  status: boolean | undefined;

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

  constructor(
    features: string[],
    whens: any[],
    thens: any[],
    givenCB: I["given"],
    initialValues: any
  ) {
    this.features = features;
    this.whens = whens;
    this.thens = thens;
    this.givenCB = givenCB;
    this.initialValues = initialValues;
    this.fails = 0; // Initialize fail count
  }

  beforeAll(store: I["istore"]) {
    return store;
  }

  toObj() {
    return {
      key: this.key,
      whens: (this.whens || []).map((w) => {
        if (w && w.toObj) return w.toObj();
        console.error("When step is not as expected!", JSON.stringify(w));
        return {};
      }),
      thens: (this.thens || []).map((t) => (t && t.toObj ? t.toObj() : {})),
      error: this.error ? [this.error, this.error.stack] : null,
      failed: this.failed,
      features: this.features || [],
      artifacts: this.artifacts,
      status: this.status,
    };
  }

  abstract givenThat(
    subject: I["isubject"],
    testResourceConfiguration,
    artifactory: ITestArtifactory,
    givenCB: I["given"],
    initialValues: any
  ): Promise<I["istore"]>;

  async afterEach(
    store: I["istore"],
    key: string,
    artifactory: ITestArtifactory
  ): Promise<I["istore"]> {
    return store;
  }

  async give(
    subject: I["isubject"],
    key: string,
    testResourceConfiguration: ITestResourceConfiguration,
    tester: (t: Awaited<I["then"]> | undefined) => boolean,
    artifactory: ITestArtifactory,
    suiteNdx: number
  ) {
    this.key = key;
    this.fails = 0; // Initialize fail count for this given

    const givenArtifactory = (fPath: string, value: unknown) =>
      artifactory(`given-${key}/${fPath}`, value);

    try {
      // Ensure addArtifact is properly bound to 'this'
      const addArtifact = this.addArtifact.bind(this);

      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        givenArtifactory,
        this.givenCB,
        this.initialValues
      );
      this.status = true;
    } catch (e) {
      this.status = false;

      this.failed = true;
      this.fails++; // Increment fail count
      this.error = e.stack;
    }

    try {
      const whens = this.whens || [];
      for (const [thenNdx, thenStep] of this.thens.entries()) {
        try {
          const t = await thenStep.test(
            this.store,
            testResourceConfiguration,
            `suite-${suiteNdx}/given-${key}/then-${thenNdx}`
          );
          // If the test doesn't throw, it passed
          tester(t);
        } catch (e) {
          // Mark the given as failed if any then step fails
          this.failed = true;
          this.fails++; // Increment fail count
          // Re-throw to propagate the error
          throw e;
        }
      }
    } catch (e) {
      this.error = e.stack;
      this.failed = true;
    } finally {
      try {
        const addArtifact = this.addArtifact.bind(this);
        await this.afterEach(this.store, this.key);
      } catch (e) {
        this.failed = true;
        this.fails++; // Increment fail count
        throw e;
        // this.error = e.message;
      }
    }

    return this.store;
  }
}
