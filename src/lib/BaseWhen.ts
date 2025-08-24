/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Do not add logging to this file as it is used by the pure runtime.

import type { Ibdd_in_any } from "../CoreTypes";

import { ITLog } from ".";
import { IPM } from "./types.js";
import { andWhenProxy } from "./pmProxy.js";

export abstract class BaseWhen<I extends Ibdd_in_any> {
  public name: string;
  whenCB: (x: I["iselection"]) => I["then"];
  error: Error;
  artifacts: string[] = [];

  addArtifact(path: string) {
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
      // Ensure addArtifact is properly bound to 'this'
      const addArtifact = this.addArtifact.bind(this);
      const proxiedPm = andWhenProxy(pm, filepath, addArtifact);

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
/**
 * Represents a collection of When actions keyed by their names.
 * Whens are typically part of Given definitions rather than standalone collections,
 * but this type exists for consistency and potential future use cases where:
 * - When actions might need to be reused across multiple Given conditions
 * - Dynamic composition of test steps is required
 * - Advanced test patterns need to reference When actions by name
 */
export type IWhens<I extends Ibdd_in_any> = Record<string, BaseWhen<I>>;
