/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseGiven } from "../BaseGiven";
import { BaseSuite } from "../BaseSuite";
import { BaseThen } from "../BaseThen";
import { BaseWhen } from "../BaseWhen";
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
      async () => ({ testStore: true, testSelection: false }), // givenCB
      {} // initialValues
    );
  }

  async givenThat(): Promise<TestStore> {
    return { testStore: true, testSelection: false };
  }

  uberCatcher(e: Error): void {
    console.error("Given error 2:", e);
  }
}

export class MockWhen extends BaseWhen<I> {
  async andWhen(
    store: TestStore,
    whenCB: I["when"],
    testResource: any,
    pm: IPM
  ): Promise<TestStore> {
    // The whenCB expects to be called with the store directly
    // Since I["when"] is (store: TestStore) => Promise<TestStore>
    const result = await whenCB(store);
    return result;
  }

  addArtifact(path: string): void {
    // Mock implementation
  }
}

export class MockThen extends BaseThen<I> {
  async butThen(
    store: TestStore,
    thenCB: I["then"],
    testResourceConfiguration: any,
    pm: IPM
  ): Promise<TestSelection> {
    // The thenCB expects to be called with the store directly
    // Since I["then"] is (store: TestStore) => Promise<TestSelection>
    const result = await thenCB(store);
    return result;
  }
}

export class MockSuite extends BaseSuite<I, O> {
  constructor(name: string, index: number) {
    if (!name) {
      throw new Error("MockSuite requires a non-empty name");
    }

    const suiteName = name || "testSuite";
    super(suiteName, index, {
      testGiven: new MockGiven(
        "testGiven",
        ["testFeature"],
        [
          new MockWhen("testWhen", async () =>
            Promise.resolve({ testSelection: true })
          ),
        ],
        [
          new MockThen("testThen", async () =>
            Promise.resolve(new BaseSuite("temp", 0, {} as any))
          ),
        ]
      ),
    });
  }
}
