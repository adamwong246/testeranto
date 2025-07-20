import { ITTestResourceConfiguration, ITestArtifactory } from "..";
import { BaseGiven, BaseWhen, BaseThen } from "../abstractBase";
import { BaseSuite } from "../BaseSuite";
import { IPM } from "../types";
import { I, TestStore, TestSelection, O } from "./test";

export class MockGiven extends BaseGiven<I> {
  constructor(
    name: string,
    features: string[],
    whens: BaseWhen<I>[],
    thens: BaseThen<I>[]
  ) {
    super(
      name,
      features,
      whens,
      thens,
      async () => ({ testStore: true }), // givenCB
      {} // initialValues
    );
  }

  async givenThat(
    subject: I["isubject"],
    testResourceConfiguration: ITTestResourceConfiguration,
    artifactory: ITestArtifactory,
    givenCB: I["given"],
    initialValues: any,
    pm: IPM
  ): Promise<TestStore> {
    return { testStore: true };
  }

  uberCatcher(e: Error): void {
    console.error("Given error 2:", e);
  }
}

export class MockWhen extends BaseWhen<I> {
  async andWhen(
    store: TestStore,
    whenCB: (x: TestSelection) => Promise<TestStore>,
    testResource: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<TestStore> {
    return { ...store, testStore: true };
  }
}

export class MockThen extends BaseThen<I> {
  async butThen(
    store: TestStore,
    thenCB: (s: TestSelection) => Promise<TestSelection>,
    testResourceConfiguration: ITTestResourceConfiguration,
    pm: IPM
  ): Promise<TestSelection> {
    return { testSelection: true };
  }
}

export class MockSuite extends BaseSuite<I, O> {
  constructor(name: string, index: number) {
    super(name, index, {
      testGiven: new MockGiven(
        "testGiven",
        ["testFeature"],
        [new MockWhen("testWhen", () => Promise.resolve({ testStore: true }))],
        [
          new MockThen("testThen", async () =>
            Promise.resolve({ testSelection: true })
          ),
        ]
      ),
    });
  }
}
