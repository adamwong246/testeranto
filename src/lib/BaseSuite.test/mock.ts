/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

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
    whenCB: (store: TestStore) => Promise<TestStore>,
    testResource: any,
    pm: IPM
  ): Promise<TestStore> {
    const newStore = {
      ...store,
      testSelection: true, // Ensure testSelection is set for assertions
    };

    const result = await whenCB(newStore);

    return result;
  }

  addArtifact(name: string, content: string): this {
    // Mock implementation that just returns this for chaining
    return this;
  }
}

export class MockThen extends BaseThen<I> {
  async butThen(
    store: TestStore,
    thenCB: (selection: TestSelection) => Promise<TestSelection>,
    testResourceConfiguration: any,
    pm: any
  ): Promise<TestSelection> {
    // Create test selection with explicit type
    const testSelection: TestSelection = {
      name: store.name,
      index: store.index,
      testSelection: store.testSelection || false,
      error: store.error ? true : undefined,
    };

    try {
      const result = await thenCB(testSelection);

      if (!result || typeof result.testSelection === "undefined") {
        throw new Error(
          `Invalid test selection result: ${JSON.stringify(result)}`
        );
      }

      return result;
    } catch (e) {
      console.error("[ERROR] MockThen - butThen failed:", e);
      throw e;
    }
  }
}

export class MockSuite extends BaseSuite<I, O> {
  constructor(name: string, index: number) {
    if (!name) {
      throw new Error("MockSuite requires a non-empty name");
    }

    const suiteName = name || "testSuite"; // Ensure name is never undefined
    super(suiteName, index, {
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
