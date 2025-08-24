/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Do not add logging to this file as it is used by the pure runtime.

import type { Ibdd_in_any, Ibdd_out_any } from "../CoreTypes";

import { ITestArtifactory, ITLog, ITTestResourceConfiguration } from ".";
import { IPM } from "./types.js";
import { afterEachProxy, beforeEachProxy } from "./pmProxy.js";
import { BaseSuite } from "./BaseSuite";

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
  name: string;
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

  addArtifact(path: string) {
    const normalizedPath = path.replace(/\\/g, "/"); // Normalize path separators
    this.artifacts.push(normalizedPath);
  }

  constructor(
    name: string,
    features: string[],
    whens: any[],
    thens: any[],
    givenCB: I["given"],
    initialValues: any
  ) {
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
    this.givenCB = givenCB;
    this.initialValues = initialValues;
  }

  beforeAll(store: I["istore"]) {
    return store;
  }

  toObj() {
    return {
      key: this.key,
      name: this.name,
      whens: this.whens.map((w) => {
        if (w && w.toObj) return w.toObj();

        console.error("w is not as expected!", JSON.stringify(w));
        return {};
      }),
      thens: this.thens.map((t) => t.toObj()),
      error: this.error ? [this.error, this.error.stack] : null,
      failed: this.failed,
      features: this.features,
      artifacts: this.artifacts,
    };
  }

  abstract givenThat(
    subject: I["isubject"],
    testResourceConfiguration,
    artifactory: ITestArtifactory,
    givenCB: I["given"],
    initialValues: any,
    pm: IPM
  ): Promise<I["istore"]>;

  async afterEach(
    store: I["istore"],
    key: string,
    artifactory: ITestArtifactory,
    pm: IPM
  ): Promise<I["istore"]> {
    return store;
  }

  abstract uberCatcher(e);

  async give(
    subject: I["isubject"],
    key: string,
    testResourceConfiguration: ITTestResourceConfiguration,
    tester: (t: Awaited<I["then"]> | undefined) => boolean,
    artifactory: ITestArtifactory,
    tLog: ITLog,
    pm: IPM,
    suiteNdx: number
  ) {
    this.key = key;

    tLog(`\n ${this.key}`);
    tLog(`\n Given: ${this.name}`);

    const givenArtifactory = (fPath: string, value: unknown) =>
      artifactory(`given-${key}/${fPath}`, value);

    this.uberCatcher((e) => {
      console.error(e.toString());
      this.error = e.error;
      tLog(e.stack);
    });

    try {
      // Ensure addArtifact is properly bound to 'this'
      const addArtifact = this.addArtifact.bind(this);
      const proxiedPm = beforeEachProxy(pm, suiteNdx.toString(), addArtifact);
      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        givenArtifactory,
        this.givenCB,
        this.initialValues,
        proxiedPm
      );
    } catch (e) {
      // console.error("Given failure: ", e.stack);
      this.failed = true;
      this.error = e.stack;
      // throw e;
    }

    try {
      // tLog(`\n Given this.store`, this.store);

      for (const [whenNdx, whenStep] of this.whens.entries()) {
        await whenStep.test(
          this.store,
          testResourceConfiguration,
          tLog,
          pm,
          `suite-${suiteNdx}/given-${key}/when/${whenNdx}`
        );
      }

      for (const [thenNdx, thenStep] of this.thens.entries()) {
        const t = await thenStep.test(
          this.store,
          testResourceConfiguration,
          tLog,
          pm,
          `suite-${suiteNdx}/given-${key}/then-${thenNdx}`
        );
        tester(t);
      }
    } catch (e) {
      this.error = e.stack;
      this.failed = true;
      // tLog(e.stack);
      // throw e;
    } finally {
      try {
        // Ensure addArtifact is properly bound to 'this'
        const addArtifact = this.addArtifact.bind(this);
        const proxiedPm = afterEachProxy(
          pm,
          suiteNdx.toString(),
          key,
          addArtifact
        );
        // (proxiedPm as any).currentStep = this;
        await this.afterEach(this.store, this.key, givenArtifactory, proxiedPm);
      } catch (e) {
        this.failed = e;
        throw e;
        // this.error = e.message;
      }
    }

    return this.store;
  }
}
