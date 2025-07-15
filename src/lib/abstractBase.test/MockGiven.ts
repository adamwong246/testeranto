import { BaseGiven } from "../abstractBase";
import { Ibdd_in_any } from "../../CoreTypes";

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
    return givenCB();
  }

  uberCatcher(e: Error): void {
    console.error("MockGiven error:", e);
    this.error = e;
  }
}
