/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Ibdd_in_any } from "../../CoreTypes";
import { BaseGiven } from "../BaseGiven";
import { BaseThen } from "../BaseThen";
import { BaseWhen } from "../BaseWhen";

export class MockGiven<I extends Ibdd_in_any> extends BaseGiven<I> {
  constructor(
    name: string,
    features: string[],
    whens: BaseWhen<I>[],
    thens: BaseThen<I>[],
    givenCB: I["given"],
    initialValues: any
  ) {
    super(name, features, whens, thens, givenCB, initialValues);
  }

  async givenThat(
    subject: I["isubject"],
    testResourceConfiguration: any,
    artifactory: any,
    givenCB: I["given"],
    initialValues: any,
    pm: any
  ): Promise<I["istore"]> {
    // Call the givenCB which is a function that returns the store
    const result = givenCB();
    if (typeof result === 'function') {
      return result();
    }
    return result;
  }

  uberCatcher(e: Error): void {
    console.error("MockGiven error:", e);
    this.error = e;
  }
}
