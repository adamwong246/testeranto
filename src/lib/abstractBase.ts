/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Do not add logging to this file as it is used by the pure runtime.

import type { Ibdd_in_any } from "../CoreTypes";

import { ITestArtifactory, ITLog, ITTestResourceConfiguration } from ".";
import { IPM } from "./types.js";
import {
  afterEachProxy,
  andWhenProxy,
  beforeEachProxy,
  butThenProxy,
} from "./pmProxy.js";

export type IGivens<I extends Ibdd_in_any> = Record<string, BaseGiven<I>>;

export abstract class BaseGiven<I extends Ibdd_in_any> {
  name: string;
  features: string[];
  whens: BaseWhen<I>[];
  thens: BaseThen<I>[];
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
    console.log("Given addArtifact", path);
    const normalizedPath = path.replace(/\\/g, "/"); // Normalize path separators
    this.artifacts.push(normalizedPath);
  }

  constructor(
    name: string,
    features: string[],
    whens: BaseWhen<I>[],
    thens: BaseThen<I>[],
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
  ): Promise<unknown> {
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
      const proxiedPm = beforeEachProxy(
        pm,
        suiteNdx.toString(),
        this.addArtifact.bind(this)
      );
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
        const proxiedPm = afterEachProxy(
          pm,
          suiteNdx.toString(),
          key,
          this.addArtifact.bind(this)
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

export abstract class BaseWhen<I extends Ibdd_in_any> {
  public name: string;
  whenCB: (x: I["iselection"]) => I["then"];
  error: Error;

  artifacts: string[] = [];

  addArtifact(path: string) {
    console.log("When addArtifact", path);
    const normalizedPath = path.replace(/\\/g, "/"); // Normalize path separators
    this.artifacts.push(normalizedPath);
  }

  constructor(name: string, whenCB: (xyz: I["iselection"]) => I["then"]) {
    this.name = name;
    this.whenCB = whenCB;
  }

  abstract andWhen(
    store: I["istore"],
    whenCB: (x: I["iselection"]) => I["then"],
    testResource,
    pm: IPM
  ): Promise<any>;

  toObj() {
    const obj = {
      name: this.name,
      error: this.error
        ? `${this.error.name}: ${this.error.message}\n${this.error.stack}`
        : null,
      artifacts: this.artifacts || [],
    };
    console.log(
      `[TOOBJ] Serializing ${this.constructor.name} with artifacts:`,
      obj.artifacts
    );
    return obj;
  }

  async test(
    store: I["istore"],
    testResourceConfiguration,
    tLog: ITLog,
    pm: IPM,
    filepath: string
  ) {
    try {
      // tLog(" When:", this.name);
      const proxiedPm = andWhenProxy(pm, filepath, this.addArtifact.bind(this));

      // (proxiedPm as any).currentStep = this;
      const result = await this.andWhen(
        store,
        this.whenCB,
        testResourceConfiguration,
        proxiedPm
      );

      return result;
    } catch (e: any) {
      console.error(
        "[ERROR] When step failed:",
        this.name.toString(),
        e.toString()
      );
      this.error = e;
      throw e;
    }
  }
}

export abstract class BaseThen<I extends Ibdd_in_any> {
  public name: string;
  thenCB: (storeState: I["iselection"], pm: IPM) => Promise<I["then"]>;
  error: boolean;
  artifacts: string[] = [];

  constructor(
    name: string,
    thenCB: (val: I["iselection"]) => Promise<I["then"]>
  ) {
    this.name = name;
    this.thenCB = thenCB;
    this.error = false;
    this.artifacts = [];
  }

  addArtifact(path: string) {
    console.log("Then addArtifact", path);
    const normalizedPath = path.replace(/\\/g, "/"); // Normalize path separators
    this.artifacts.push(normalizedPath);
  }

  toObj() {
    const obj = {
      name: this.name,
      error: this.error,
      artifacts: this.artifacts,
    };
    return obj;
  }

  abstract butThen(
    store: I["istore"],
    thenCB: (s: I["iselection"]) => Promise<I["isubject"]>,
    testResourceConfiguration: ITTestResourceConfiguration,
    pm: IPM,
    ...args: any[]
  ): Promise<I["iselection"]>;

  async test(
    store: I["istore"],
    testResourceConfiguration,
    tLog: ITLog,
    pm: IPM,
    filepath: string
  ): Promise<I["then"] | undefined> {
    const proxiedPm = butThenProxy(pm, filepath, this.addArtifact.bind(this));
    return this.butThen(
      store,
      async (s: I["iselection"]) => {
        try {
          if (typeof this.thenCB === "function") {
            return await this.thenCB(s, proxiedPm);
          } else {
            return this.thenCB;
          }
        } catch (e) {
          console.error(e.stack);
        }
      },
      testResourceConfiguration,
      proxiedPm
    ).catch((e) => {
      this.error = e.stack;
      // throw e;
    });
  }
}
