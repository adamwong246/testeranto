/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

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
  protected addArtifact(path: string) {
    console.log(`[Artifact] Adding to ${this.constructor.name}:`, path);
    // console.log("mark111");
    // process.exit();
    this.artifacts.push(path);
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

        console.error("w is not as expected!", w.toString());
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
      const proxiedPm = beforeEachProxy(pm, suiteNdx.toString());
      console.log(`[Given] Setting currentStep for beforeEach:`, this.name);
      (proxiedPm as any).currentStep = this;
      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        givenArtifactory,
        this.givenCB,
        this.initialValues,
        proxiedPm
      );
    } catch (e) {
      console.error("Given failure: ", e.toString());
      this.error = e;
      throw e;
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
        // ((t) => {
        //   return tester(t);
        // })();
      }
    } catch (e) {
      this.failed = true;
      tLog(e.stack);
      throw e;
    } finally {
      try {
        await this.afterEach(
          this.store,
          this.key,
          givenArtifactory,

          afterEachProxy(pm, suiteNdx.toString(), key)
        );
      } catch (e) {
        console.error("afterEach failed!", e.toString());
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
    console.log("toObj error", this.error);

    if (this.error) {
      return {
        name: this.name,
        error: this.error && this.error.name + this.error.stack,
        artifacts: this.artifacts,
      };
    } else {
      return {
        name: this.name,
        artifacts: this.artifacts,
      };
    }
  }

  async test(
    store: I["istore"],
    testResourceConfiguration,
    tLog: ITLog,
    pm: IPM,
    filepath: string
  ) {
    try {
      tLog(" When:", this.name);
      console.debug("[DEBUG] Executing When step:", this.name.toString());

      const proxiedPm = andWhenProxy(pm, filepath);
      console.log(`[When] Setting currentStep for andWhen:`, this.name);
      (proxiedPm as any).currentStep = this;
      const result = await this.andWhen(
        store,
        this.whenCB,
        testResourceConfiguration,
        proxiedPm
      );

      console.debug("[DEBUG] When step completed:", this.name.toString());
      return result;
    } catch (e: Error) {
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
  thenCB: (storeState: I["iselection"]) => Promise<I["then"]>;
  error: boolean;
  artifacts: string[] = [];

  constructor(
    name: string,
    thenCB: (val: I["iselection"]) => Promise<I["then"]>
  ) {
    this.name = name;
    this.thenCB = thenCB;
    this.error = false;
  }

  toObj() {
    return {
      name: this.name,
      error: this.error,
      artifacts: this.artifacts,
    };
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
    const proxiedPm = butThenProxy(pm, filepath);
    console.log(`[Then] Setting currentStep for butThen:`, this.name);
    (proxiedPm as any).currentStep = this;
    return this.butThen(
      store,
      async (s: I["iselection"]) => {
        if (typeof this.thenCB === "function") {
          return await this.thenCB(s, proxiedPm);
        } else {
          return this.thenCB;
        }
      },
      testResourceConfiguration,
      butThenProxy(pm, filepath)
    ).catch((e) => {
      this.error = e.toString();
      // throw e;
    });
  }
}
