import { ITestResourceConfiguration } from ".";
import type { Ibdd_in_any } from "../CoreTypes";

export abstract class BaseThen<I extends Ibdd_in_any> {
  public name: string;
  thenCB: (
    storeState: I["iselection"]
    // pm: IPM
  ) => Promise<I["then"]>;
  error: boolean;
  artifacts: string[] = [];
  status: boolean | undefined;

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

  toObj() {
    const obj = {
      name: this.name,
      error: this.error,
      artifacts: this.artifacts,
      status: this.status,
    };
    return obj;
  }

  abstract butThen(
    store: I["istore"],
    thenCB: (s: I["iselection"]) => Promise<I["isubject"]>,
    testResourceConfiguration: ITestResourceConfiguration
  ): // pm: IPM
  Promise<I["iselection"]>;

  async test(
    store: I["istore"],
    testResourceConfiguration,
    // tLog: ITLog,
    // pm: IPM,
    filepath: string
  ): Promise<I["then"] | undefined> {
    // Ensure addArtifact is properly bound to 'this'
    const addArtifact = this.addArtifact.bind(this);
    // const proxiedPm = butThenProxy(pm, filepath, addArtifact);

    try {
      const x = await this.butThen(
        store,
        async (s: I["iselection"]) => {
          try {
            if (typeof this.thenCB === "function") {
              const result = await this.thenCB(s);
              return result;
            } else {
              return this.thenCB;
            }
          } catch (e) {
            // Mark this then step as failed
            this.error = true;
            // Re-throw to be caught by the outer catch block
            throw e;
          }
        },
        testResourceConfiguration
        // proxiedPm
      );
      this.status = true;
      return x;
    } catch (e) {
      this.status = false;
      this.error = true;
      throw e;
    }
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
