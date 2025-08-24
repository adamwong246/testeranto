/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Do not add logging to this file as it is used by the pure runtime.

import type { Ibdd_in_any } from "../CoreTypes";

import { ITLog, ITTestResourceConfiguration } from ".";
import { IPM } from "./types.js";
import { butThenProxy } from "./pmProxy.js";

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
    pm: IPM
  ): Promise<I["iselection"]>;

  async test(
    store: I["istore"],
    testResourceConfiguration,
    tLog: ITLog,
    pm: IPM,
    filepath: string
  ): Promise<I["then"] | undefined> {
    // Ensure addArtifact is properly bound to 'this'
    const addArtifact = this.addArtifact.bind(this);
    const proxiedPm = butThenProxy(pm, filepath, addArtifact);
    return this.butThen(
      store,
      async (s: I["iselection"]) => {
        try {
          if (typeof this.thenCB === "function") {
            // Add debug logging to see what's being passed to thenCB

            // Check if the thenCB is spreading the arguments incorrectly
            // Wrap the proxy to see what's happening when writeFileSync is called
            const wrappedPm = new Proxy(proxiedPm, {
              get: (target, prop, receiver) => {
                if (prop === "writeFileSync") {
                  return (...args) => {
                    console.log(
                      `[DEBUG] writeFileSync called with args:`,
                      args
                    );
                    return target[prop](...args);
                  };
                }
                return target[prop];
              },
            });
            const result = await this.thenCB(s, wrappedPm);

            return result;
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
/**
 * Represents a collection of Then assertions keyed by their names.
 * Thens are typically part of Given definitions rather than standalone collections,
 * but this type exists for consistency and potential future use cases where:
 * - Assertions might need to be reused or composed dynamically
 * - Custom assertion libraries could benefit from named assertion collections
 * - Advanced validation patterns require named Then conditions
 */
export type IThens<I extends Ibdd_in_any> = Record<string, BaseThen<I>>;
